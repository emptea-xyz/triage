import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BackpackWalletAdapter,
  CoinbaseWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";
import Head from "next/head";

import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material";

import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/globals.css";
import "../styles/adapter.css";
import "../styles/home.css";
import "../styles/create.css";


/* 
import "../styles/home.css";
import "../styles/explore.css";
import "../styles/charts.css";
import "../styles/reader.css";
import "../styles/item.css";
*/

const App = ({ Component, pageProps }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  const StyledSnackbarProvider = styled(SnackbarProvider)`
    &.SnackbarItem-contentRoot {
      background-color: var(--white);
      color: var(--black);
      font-family: "Inter Tight SemiBold";
      font-size: 14px;
      border-radius: 10px;
    }

    &.SnackbarItem-contentRoot button {
      background-color: transparent;
      border: 0px solid var(--white);
      color: var(--black);
      font-family: "Inter Tight Regular";
      font-size: 16px;
      cursor: pointer;
    }
    &.SnackbarItem-contentRoot button:hover {
      color: var(--sign);
      transition-duration: 0.2s;
    }
    &.SnackbarItem-contentRoot button:not(:hover) {
      transition-duration: 0.2s;
    }
  `;
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Head>
            <title>emptea oxygen</title>
            <meta name="description" content="Create NFT's. Easy, fast & cheap." />
          </Head>
          <StyledSnackbarProvider   autoHideDuration={10000}>
            <Component {...pageProps} />
          </StyledSnackbarProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
