import { LocalWallet } from "@thirdweb-dev/wallets";
import {
  useSmartWallet,
  useAccountAdminsAndSigners,
  useSetAccountSigners,
  useContract,
  useAddress,
} from "@thirdweb-dev/react";
import { activeChain } from "../const";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Agree to let the app perform transactions on your behalf.
// This step created a local wallet and stores it in the browser
export const Agree = ({
  pwd,
  permissions,
  sessionKey,
}: {
  pwd: string;
  permissions: {
    approvedCallTargets: string[];
    startDate?: number | Date | undefined;
    expirationDate?: number | Date | undefined;
    nativeTokenLimitPerTransaction?: string;
  };
  sessionKey: LocalWallet;
}) => {
  const accountContractAddress = useAddress();
  // TODO: remove?
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string, // your private key
    activeChain,
    {
      clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
    }
  );
  const { contract } = useContract(accountContractAddress);

  const createAndStore = async () => {
    await sessionKey.generate();
    // encrypt it
    const encryptedWallet = await sessionKey.export({
      strategy: "encryptedJson",
      password: pwd,
    });

    // register account
    // upload encrypted wallet to session storage
    // Convert the JSON object to a string
    var encryptedString = JSON.stringify(encryptedWallet);
    // Store the string in sessionStorage
    sessionStorage.setItem("wallet:", encryptedString);
    // Add the local wallet as a signer on the smart wallet (currently connected as the smart wallet)
    contract?.account.grantPermissions(
      await sessionKey.getAddress(),
      permissions
    );

    // // // Connect the local wallet to the app TODO: do i need to connect the personal wallet at all?
    // // personalWallet.connect();
    // // connect the smart wallet to the app with the local wallet
    // await connectToSmartWallet({
    //   factoryAddress: "FACTORY_ADDRESS", // your own deployed account factory address
    //   personalWallet,
    //   gasless: true, // enable or disable gasless transactions
    //   // ...
    // });
  };
  return (
    <div>
      <h1>Agree</h1>
      <p>Agree to allow the app to perform transactions on your behalf</p>
      <button onClick={() => createAndStore()}>Agree</button>
    </div>
  );
};
