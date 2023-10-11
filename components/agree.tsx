import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";
import {
  useContract,
  useAddress,
  localWallet,
  useWallet,
  useCreateWalletInstance,
} from "@thirdweb-dev/react";
import { activeChain, factoryAddress } from "../const";
import { useState, Dispatch, SetStateAction } from "react";

// Agree to let the app perform transactions on your behalf.
// This step created a local wallet and stores it in the browser
export const Agree = async ({
  pwd,
  setHasSessionKey,
}: {
  pwd: string;
  setHasSessionKey: Dispatch<SetStateAction<boolean>>;
}) => {
  const [sessionKey, setSessionKey] = useState<LocalWallet>();
  const permissions = {
    approvedCallTargets: [""], //TODO add contract address
    startDate: new Date(Date.now()),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    nativeTokenLimitPerTransaction: "1", //1 GoerliETH
  };
  // create wallet instance hook
  const createWalletInstance = useCreateWalletInstance();
  // get the smart wallet account address
  const accountContractAddress = useAddress();
  // create a local wallet instance
  const walletConfig = localWallet();
  const wallet = createWalletInstance(walletConfig);
  setSessionKey(wallet);
  console.log("session key:", sessionKey);
  setHasSessionKey(true);

  const deploySmartWallet = async () => {
    const smartWallet = useWallet("smartWallet");
    const isDeployed = await smartWallet?.isDeployed();
    if (isDeployed) {
      console.log("smart wallet already deployed...");
      console.log("continuing...");
      return await smartWallet?.getAddress();
    } else {
      console.log("deploying...");
      await smartWallet?.deploy();
      return await smartWallet?.getAddress();
    }
  };

  const createAndStore = async () => {
    //deploy the smart wallet if it is not already
    console.log("deploying smart wallet...");
    const smartWalletAddress = await deploySmartWallet();
    console.log("smart wallet address:", smartWalletAddress);

    // get instance of the smart walleet account contract
    const { contract: accountContract } = useContract(accountContractAddress);
    console.log("account address:", accountContractAddress);

    // generate the session key
    console.log("generating session key...");
    await sessionKey?.generate();

    // encrypt the session key
    console.log("encrypting session key...");
    const encryptedWallet = await sessionKey?.export({
      strategy: "encryptedJson",
      password: pwd,
    });

    // Convert the JSON object to a string
    var encryptedString = JSON.stringify(encryptedWallet);
    console.log("encryptedString:", encryptedString);

    // Store the string in sessionStorage
    console.log("storing session key in session storage...");
    sessionStorage.setItem("wallet:", encryptedString);

    // Add the local wallet as a signer on the smart wallet (currently connected as the smart wallet)
    console.log("granting permissions...");
    await accountContract?.account.grantPermissions(
      (await sessionKey?.getAddress()) as string,
      permissions
    );

    // connect the session key to the app: TODO do i need to do this
    console.log("connecting session key...");
    await sessionKey?.connect();
    // smart wallet config
    const config = {
      chain: activeChain,
      factoryAddress: factoryAddress,
      secretKey: process.env.PRIVATE_KEY as string,
      gasless: true,
    };

    //create a smart wallet instance
    const smartWallet = new SmartWallet(config);

    // connect to the users smart wallet with the session key signer
    console.log("connecting smart wallet with session key...");
    await smartWallet.connect({
      accountAddress: accountContractAddress,
      personalWallet: sessionKey as LocalWallet,
    });
    console.log("smartWallet conncted!");
  };
  return (
    <div>
      <h1>Agree</h1>
      <p>Agree to allow the app to perform transactions on your behalf</p>
      <button onClick={() => createAndStore()}>Agree</button>
    </div>
  );
};
