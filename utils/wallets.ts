import { SmartWallet, LocalWallet, SmartContract } from "@thirdweb-dev/react";
import { BaseContract } from "ethers";

export const deploySmartWallet = async (smartWallet: SmartWallet) => {
  const isDeployed = await smartWallet.isDeployed();
  if (isDeployed) {
    console.log("smart wallet already deployed...");
    console.log("continuing...");
    return await smartWallet.getAddress();
  } else {
    console.log("deploying...");
    await smartWallet.deploy();
    return await smartWallet.getAddress();
  }
};

export const generateSessionKey = async (
  sessionKey: LocalWallet,
  pwd: string
) => {
  // generate the session key
  console.log("generating session key...");
  await sessionKey.generate();

  // encrypt the session key
  console.log("encrypting session key...");
  const encryptedWallet = await sessionKey.export({
    strategy: "encryptedJson",
    password: pwd,
  });

  // Convert the JSON object to a string
  var encryptedString = JSON.stringify(encryptedWallet);
  console.log("encryptedString:", encryptedString);

  // Store the string in sessionStorage
  console.log("storing session key in session storage...");
  sessionStorage.setItem("wallet", encryptedString);
};

export const smartWalletActions = async (
  sessionKey: LocalWallet,
  smartWallet: SmartWallet,
  accountContractAddress: string,
  accountContract: SmartContract<BaseContract>
) => {
  const permissions = {
    approvedCallTargets: ["0x2D7Ef62705eaa2e990104E75B0F4769D8c56816A"], //TODO add contract address
    startDate: new Date(Date.now()),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    nativeTokenLimitPerTransaction: "1", //1 GoerliETH
  };
  // Add the local wallet as a signer on the smart wallet (currently connected as the smart wallet)
  console.log("granting permissions...");
  await accountContract?.account.grantPermissions(
    (await sessionKey?.getAddress()) as string,
    permissions
  );

  // connect the session key to the app: TODO do i need to do this
  console.log("connecting session key...");
  await sessionKey?.connect();

  // connect to the users smart wallet with the session key signer
  console.log("connecting smart wallet with session key...");
  await smartWallet?.connect({
    accountAddress: accountContractAddress,
    personalWallet: sessionKey as LocalWallet,
  });
  console.log("smartWallet conncted!");
  console.log("personal wallet session key:", smartWallet.getPersonalWallet());
};
