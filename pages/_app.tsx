import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  smartWallet,
  metamaskWallet,
  coinbaseWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet({
          factoryAddress: "0x3c115305ecC8119D9517BB67a5B3D4073Bc9CffF",
          gasless: true,
          personalWallets: [metamaskWallet(), coinbaseWallet()],
        }),
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
