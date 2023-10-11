import {
  ConnectWallet,
  metamaskWallet,
  useAddress,
  Transaction,
  smartWallet,
  useWallet,
  useConnect,
  localWallet,
  WalletConfig,
  WalletInstance,
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
  const address = useAddress();
  const [password, setPassword] = useState("");
  const [hasSessionKey, setHasSessionKey] = useState<boolean>(false);
  return address ? (
    hasSessionKey ? (
      <div>
        <Connected />
      </div>
    ) : (
      <div>
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Agree pwd={password} setHasSessionKey={setHasSessionKey} />
      </div>
    )
  ) : (
    <ConnectWallet />
  );
};

export default Home;
