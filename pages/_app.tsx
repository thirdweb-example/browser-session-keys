import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  smartWallet,
  metamaskWallet,
  coinbaseWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import { factoryAddress, activeChain } from "../const";
// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.

function MyApp({ Component, pageProps }: AppProps) {
  const smartWalletConfig = {
    factoryAddress: factoryAddress,
    gasless: true,
  };
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[smartWallet(metamaskWallet(), smartWalletConfig)]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
