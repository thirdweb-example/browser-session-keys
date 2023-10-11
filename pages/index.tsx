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
  return address ? (
    hasSessionKey ? (
      <div>
        {signer ? (
          <>
            <ConnectWallet />
            <SessionKeyConnected signer={signer} />
          </>
        ) : (
          <p>loading...</p>
        )}
      </div>
    ) : (
      <div>
        <Agree setHasSessionKey={setHasSessionKey} setSigner={setSigner} />
      </div>
    )
  ) : (
    <ConnectWallet />
  );
};

export default Home;
