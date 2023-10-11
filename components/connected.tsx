import {
  useClaimNFT,
  useOwnedNFTs,
  useContract,
  useAddress,
  ThirdwebNftMedia,
  ThirdwebSDKProvider,
} from "@thirdweb-dev/react";
import { editionDrop } from "../const";
import { Signer } from "ethers";
import { activeChain } from "../const";

interface ConnectedProps {
  signer: Signer | undefined;
}

export const SessionKeyConnected: React.FC<ConnectedProps> = ({ signer }) => {
  return (
    <ThirdwebSDKProvider
      signer={signer}
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <Connected />
    </ThirdwebSDKProvider>
  );
};

const Connected = () => {
  const address = useAddress();
  const { contract: editionDropContract } = useContract(editionDrop);
  const {
    mutateAsync: claimNft,
    isLoading,
    error,
  } = useClaimNFT(editionDropContract);
  const { data: nfts } = useOwnedNFTs(editionDropContract, address);
  return (
    <div>
      <button
        onClick={() => claimNft({ to: address, quantity: 1, tokenId: 0 })}
      >
        Mint an NFT with Your Session Wallet
      </button>
      {nfts && nfts[0] ? (
        <ThirdwebNftMedia metadata={nfts[0]?.metadata} />
      ) : null}
    </div>
  );
};
