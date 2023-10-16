import {
  useClaimNFT,
  useOwnedNFTs,
  useContract,
  useAddress,
  ThirdwebNftMedia,
  ThirdwebSDKProvider,
  ConnectWallet,
  Web3Button,
} from "@thirdweb-dev/react";
import { editionDrop } from "../const";
import { Signer } from "ethers";
import { activeChain } from "../const";
import toast from "react-hot-toast";
import toastStyle from "../utils/toastConfig";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { Dispatch } from "react";
import { SetStateAction } from "react";

interface ConnectedProps {
  signer?: Signer | undefined;
  setText?: Dispatch<SetStateAction<string>>;
}

export const SessionKeyConnected: React.FC<ConnectedProps> = ({
  signer,
  setText,
}) => {
  return (
    <ThirdwebSDKProvider
      signer={signer}
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <Connected setText={setText} />
    </ThirdwebSDKProvider>
  );
};

const Connected: React.FC<ConnectedProps> = ({ setText }) => {
  const address = useAddress();
  const { contract: editionDropContract } = useContract(editionDrop);
  const { data: nfts } = useOwnedNFTs(editionDropContract, address);

  useEffect(() => {
    if (setText) {
      setText(
        "Interacting with the blockchain is now gasless and transactionless!"
      );
    }
  }, []);

  return (
    <div className={styles.container}>
      <Web3Button
        contractAddress={editionDrop}
        action={async (contract) => {
          await contract.erc1155.claim(0, 1);
        }}
        onSuccess={async () => {
          alert("Claim successful! ✅");
        }}
      >
        Mint an NFT with Your Session Wallet
      </Web3Button>
      {nfts && nfts[0] ? (
        <>
          <ThirdwebNftMedia metadata={nfts[0]?.metadata} />
          <h2>Number of Edition Tokens Owned: {nfts[0].quantityOwned}</h2>
        </>
      ) : null}
    </div>
  );
};
