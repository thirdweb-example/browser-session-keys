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
import { SessionKeyConnected } from "../components/connected";
import { useState } from "react";
import {
  LocalWallet,
  SmartWallet,
  SmartWalletConfig,
  MetaMaskWallet,
} from "@thirdweb-dev/wallets";
import { activeChain, factoryAddress } from "../const";
import { Signer } from "ethers";

const Home: NextPage = () => {
  const address = useAddress();
  const [hasSessionKey, setHasSessionKey] = useState<boolean>(false);
  const [signer, setSigner] = useState<Signer>();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.gradientText0}>
          <a
            href="https://thirdweb.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browser Session Keys
          </a>{" "}
        </span>
        Smart Wallet Demo
      </h1>
      {address ? (
        hasSessionKey ? (
          <div className={styles.container}>
            {signer ? (
              <>
                <SessionKeyConnected signer={signer} />
              </>
            ) : (
              <h2>loading...</h2>
            )}
          </div>
        ) : (
          <div>
            <Agree setHasSessionKey={setHasSessionKey} setSigner={setSigner} />
          </div>
        )
      ) : (
        <div className={styles.container}>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
};

export default Home;
