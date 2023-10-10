import {
  ConnectWallet,
  metamaskWallet,
  useAddress,
  Transaction,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { Agree } from "../components/agree";
import { Connected } from "../components/connected";
import { useState } from "react";
import {
  LocalWallet,
  SmartWallet,
  SmartWalletConfig,
  MetaMaskWallet,
} from "@thirdweb-dev/wallets";
import { activeChain, factoryAddress } from "../const";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const [password, setPassword] = useState("");
  const [sessionKey, setSessionKey] = useState<LocalWallet>();
  console.log("sessionKey:", sessionKey);
  const permissions = {
    approvedCallTargets: [""], //TODO add contract address
    startDate: new Date(Date.now()),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    nativeTokenLimitPerTransaction: "1", //1 GoerliETH
  };
  const config: SmartWalletConfig = {
    chain: activeChain,
    factoryAddress: factoryAddress,
    clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
    gasless: true,
  };
  const metaMask = new MetaMaskWallet({});
  const smartWallet = new SmartWallet(config);
  const connectSmartWalletWithAdmin = async () => {
    await smartWallet.connect({ personalWallet: metaMask });
    //if smart wallet not alreADy deployed
    if (await smartWallet.isDeployed()) {
      setAddress(await smartWallet.getAddress());
      console.log(
        "smartWallet already deployed at address:",
        await smartWallet.getAddress()
      );
      console.log("address:", address);
      return;
    } else {
      await smartWallet.deploy();
      setAddress(await smartWallet.getAddress());
      console.log(
        "smartWallet deployed at address:",
        await smartWallet.getAddress()
      );
      console.log("address:", address);
    }
  };
  return address ? (
    sessionKey ? (
      <div>
        <Connected />
      </div>
    ) : (
      <div>
        <Agree
          pwd={password}
          sessionKey={sessionKey as LocalWallet}
          permissions={permissions}
          setSessionKey={setSessionKey}
        />
      </div>
    )
  ) : (
    <div>
      <button onClick={() => connectSmartWalletWithAdmin()}>Connect</button>
      <input
        type="password"
        placeholder="Password"
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
};

export default Home;
