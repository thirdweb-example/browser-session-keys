import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";
import {
  useContract,
  useAddress,
  localWallet,
  useWallet,
  useCreateWalletInstance,
  ConnectWallet,
  useAccountSigners,
  useCreateSessionKey,
  useDisconnect,
} from "@thirdweb-dev/react";
import { activeChain, factoryAddress } from "../const";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { deploySmartWallet, generateSessionKey } from "../utils/wallets";
import { Signer } from "ethers";

// Agree to let the app perform transactions on your behalf.
// This step created a local wallet and stores it in the browser
export const Agree = ({
  setHasSessionKey,
  setSigner,
  setText,
  project,
}: {
  setHasSessionKey: Dispatch<SetStateAction<boolean>>;
  setSigner: Dispatch<SetStateAction<Signer | undefined>>;
  setText: Dispatch<SetStateAction<string>>;
  project: string;
}) => {
  const connectedSmartWallet = useWallet("smartWallet");
  const [sessionKey, setSessionKey] = useState<LocalWallet>();
  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  useEffect(() => {
    setText("Wants to access your Smart Wallet");
  }, []);

  // create wallet instance hook
  const createWalletInstance = useCreateWalletInstance();
  // get the smart wallet account address
  const accountContractAddress = useAddress();

  const href: string = `https://thirdweb.com/${activeChain.slug}/${accountContractAddress}`;

  const disconnect = useDisconnect();

  // get instance of the smart walleet account contract
  const { contract: accountContract } = useContract(accountContractAddress);

  // View the account signers
  const { data: signers } = useAccountSigners(accountContract);
  const { mutate: createSessionKey, isLoading, error } = useCreateSessionKey();

  const initializeWallet = () => {
    // create a local wallet instance
    const walletConfig = localWallet();
    const wallet = createWalletInstance(walletConfig);
    if (wallet) {
      setSessionKey(wallet);
    }
  };

  useEffect(() => {
    initializeWallet();
    if (sessionKey) {
      console.log("session key:", sessionKey);
    }
  }, []);

  const config = {
    chain: activeChain,
    factoryAddress: factoryAddress,
    gasless: true,
    clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
  };
  const smartWallet = new SmartWallet(config);

  const createAndStore = async () => {
    try {
      // deploy the smart wallet
      console.log("deploying smart wallet...");
      const smartWalletAddress = await deploySmartWallet(
        connectedSmartWallet as SmartWallet
      );
      console.log("smart wallet address:", smartWalletAddress);
      //generate the session key and store it in the browser
      generateSessionKey(sessionKey as LocalWallet);
      const keyAddress: string = (await sessionKey?.getAddress()) as string;
      console.log("keyAddress:", keyAddress);
      signers?.some((signer) => console.log(signer.signer, keyAddress));
      if (signers?.some((signer) => signer.signer === keyAddress)) {
        console.log("session key is already a signer on the smart wallet...");
      } else {
        const permissions = {
          approvedCallTargets: ["0x2D7Ef62705eaa2e990104E75B0F4769D8c56816A"], //TODO add contract address
          startDate: new Date(Date.now()),
          expirationDate: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
          nativeTokenLimitPerTransaction: "1", //1 GoerliETH
        };
        // Add the local wallet as a signer on the smart wallet (currently connected as the smart wallet)
        console.log("granting permissions...");
        await createSessionKey({ keyAddress, permissions });
      }

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
      console.log(
        "personal wallet session key:",
        smartWallet.getPersonalWallet()
      );
      console.log("smart wallet signer:", await smartWallet.getSigner());
      setSigner(await smartWallet.getSigner());
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={styles.container}>
      <ConnectWallet />
      <div className={styles.agree}>
        <div className={styles.text}>
          <p>
            This will allow <span className={styles.project}>{project}</span>{" "}
            to:
          </p>
          <li className={styles.list}>
            Send transactions to this edition contract on your behalf
          </li>
          <li className={styles.list}>
            Send a maximum of 1 ETH from your smart wallet
          </li>
          <li className={styles.list}>
            Have signer permissions on your smart wallet for 1 hour
          </li>
          <p>Make sure you trust {project}</p>
          <p>
            You are exposing your smart wallet to an external party. To view the
            external parties which have access to your smart wallet view your{" "}
            <a href={href} className={styles.project}>
              Account Dashboard
            </a>
          </p>
        </div>
        <hr className={styles.line} />
        <div className={styles.buttonContainer}>
          <div className={styles.half}>
            <button className={styles.cancel} onClick={disconnect}>
              Cancel
            </button>
          </div>
          <div className={styles.half}>
            <button
              className={styles.button}
              onClick={(e) => {
                e.preventDefault();
                createAndStore();
                setHasSessionKey(true);
              }}
            >
              Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
