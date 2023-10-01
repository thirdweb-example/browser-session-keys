import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { Agree } from "../components/agree";
import { Connect } from "../components/connect";
import { Connected } from "../components/connected";
import { useState } from "react";
import { LocalWallet } from "@thirdweb-dev/wallets";

const Home: NextPage = () => {
  const [password, setPassword] = useState("");
  const sessionKey = new LocalWallet();
  const smartWallet = 0;
  const permissions = {
    approvedCallTargets: [""], //TODO add contract address
    startDate: new Date(Date.now()),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    nativeTokenLimitPerTransaction: "1", //1 GoerliETH
  };
  return sessionKey ? (
    smartWallet ? (
      <div>
        <Connected />
      </div>
    ) : (
      <div>
        <Agree
          pwd={password}
          permissions={permissions}
          sessionKey={sessionKey}
        />
      </div>
    )
  ) : (
    <div>
      <ConnectWallet />
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
