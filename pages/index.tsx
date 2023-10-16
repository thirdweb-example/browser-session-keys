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
import { useEffect, useState } from "react";
import {
  LocalWallet,
  SmartWallet,
  SmartWalletConfig,
  MetaMaskWallet,
} from "@thirdweb-dev/wallets";
import { activeChain, factoryAddress, project } from "../const";
import { Signer } from "ethers";

const Home: NextPage = () => {
  const [text, setText] = useState<string>("");

  const address = useAddress();
  const [hasSessionKey, setHasSessionKey] = useState<boolean>(false);
  const [signer, setSigner] = useState<Signer>();
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.border}>
          <h1 className={styles.title}>
            <span className={styles.gradientText0}>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {project}
              </a>{" "}
            </span>
          </h1>
          <p className={styles.description}>{text}</p>
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
              <Agree
                setHasSessionKey={setHasSessionKey}
                setSigner={setSigner}
                setText={setText}
                project={project}
              />
            )
          ) : (
            <div className={styles.container}>
              <ConnectWallet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
