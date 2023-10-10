import {
  useConnect,
  smartWallet,
  useWallet,
  localWallet,
} from "@thirdweb-dev/react";
import { factoryAddress } from "../const";
import { WalletInstance } from "@thirdweb-dev/react";

export const Connect = async (
  connect: any,
  sessionKey: WalletInstance,
  accountAddress: string
) => {
  console.log("your connected sessionKey:", sessionKey);
  const personalWalletConfig = localWallet();
  if (sessionKey) {
    const smartWalletConfig = smartWallet(personalWalletConfig, {
      factoryAddress: factoryAddress,
      gasless: true,
    });
    const connectedSmartWallet = await connect(smartWalletConfig, {
      accountAddress: accountAddress,
      personalWallet: sessionKey,
    });
    return connectedSmartWallet;
  }
};
