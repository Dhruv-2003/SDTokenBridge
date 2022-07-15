import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers, BigNumber } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import {
  useProvider,
  useSigner,
  useContract,
  chain,
  useConnect,
  useAccount,
} from "wagmi";
import StackDollars from "../../web/src/artifacts/contracts/OriginToken.sol/StackDollars.json";
import WrappedStackDollars from "../../web/src/artifacts/contracts/DestinationToken.sol/WrappedStackDollars.json";

export default function Home() {
  const [isOrigin, setIsOrigin] = useState(false);
  const [isDestination, setIsDestination] = useState(false);
  const [amount, setAmount] = useState(0);
  const [chainId, setChainId] = useState(0);

  const provider = useProvider();
  const { data: signer } = useSigner();
  const bridgeWalletAddress = process.env.BRIDGE_WALLET;

  const checkChain = () => {
    const { data: details } = useConnect();
    console.log(details.chain.id);
    setChainId(details.chain.id);
  };

  const ORIGIN_TOKEN_ADDRESS = "0x03057b79841ac3b79dd21e12dd69ca45b7639782";
  const DESTINATION_TOKEN_ADDRESS =
    "0x7d3a78fc9115f8485095c8fdfe57829582b96eeb";

  const SDcontract = useContract({
    addressOrName: ORIGIN_TOKEN_ADDRESS,
    contractInterface: StackDollars.abi,
    signerOrProvider: signer || provider,
  });

  const WrappedSDcontract = useContract({
    addressOrName: DESTINATION_TOKEN_ADDRESS,
    contractInterface: WrappedStackDollars.abi,
    signerOrProvider: signer || provider,
  });

  const originSend = async () => {
    try {
      if (chainId == 4) {
        const amountFormatted = ethers.utils.parseUnits(amount, 18);
        console.log("Sending Tokens to the bridge");
        const tx = await SDcontract.transfer(
          bridgeWalletAddress,
          amountFormatted.toString()
        );
        await tx.wait();
        console.log("Tokens Sent to the Bridge with txID:", tx.hash);
      } else {
        /// connect with rinkeby
        /// switch network
        const connect = useConnect({
          chainId: chain.rinkeby,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const destinationSend = async () => {
    try {
      if (chainId == 80001) {
        const amountFormatted = ethers.utils.parseUnits(amount, 18);
        console.log("Sending Tokens to the bridge");
        const tx = await WrappedSDcontract.transfer(
          bridgeWalletAddress,
          amountFormatted.toString()
        );
        await tx.wait();
        console.log("Tokens Sent to the Bridge with txID:", tx.hash);
      } else {
        /// connect with polygon Mumbai
        /// switch network
        const connect = useConnect({
          chainId: chain.polygonMumbai,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const origin = () => {
    return (
      <div className={styles.form}>
        <a>How much Stacked Dollars you would like to send to Mumbai ?</a>
        <div className={styles.firstrow}>
          <input
            className={styles.input}
            type="number"
            value={amount}
            placeholder="$ 0.00"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          ></input>
          <a>SD</a>
        </div>
        <div className={styles.buttonrow}>
          <button onClick={originSend} className={styles.button2}>
            Bridge from ETH to Polygon
          </button>
        </div>
      </div>
    );
  };

  const destination = () => {
    return (
      <div className={styles.form}>
        <a>
          How much Stacked Dollars you would like to send back to ETH(Rinkeby) ?
        </a>
        <div className={styles.firstrow}>
          <input
            className={styles.input}
            type="number"
            value={amount}
            placeholder="$ 0.00"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          ></input>
          <a>WSD</a>
        </div>
        <div className={styles.buttonrow}>
          <button onClick={destinationSend} className={styles.button2}>
            Bridge from ETH to Polygon
          </button>
        </div>
      </div>
    );
  };
  // const Form = () => {
  //   return (
  //     <div className={styles.form}>
  //       {isOrigin && setIsDestination(false) && origin()}
  //       {isDestination && setIsOrigin(false) && destination()}
  //     </div>
  //   );
  // };

  useEffect(() => {
    setIsDestination(false);
    setIsOrigin(false);
    checkChain;
    setAmount(0);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Bridge ETH to Polygon</title>
        <meta name="description" content="Bridge to transfer Stacked " />
        <link rel="icon" href="/iconbridge.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bridge Stacked Dollars from<a> Rinkeby(ETH)</a> to
          <a> Mumbai(polygon)</a>
        </h1>

        <ConnectButton />

        <p className={styles.description}>
          This is Bridge to & fro transfer of Stacked Dollars from Rinkeby(ETH)
          Network to the L2 Mumbai network(Polygon)
        </p>

        <p className={styles.description}>
          Token on ETH(Rinkeby) is Stacked Dollars with <a href=""> address </a>
        </p>
        <p className={styles.description}>
          Token on Polygon(Mumbai) is Wrapped Stacked Dollars with
          <a href=""> address </a>
        </p>

        <div className={styles.form}>
          <div className={styles.buttonrow}>
            <button
              onClick={() => {
                setIsOrigin(true) && setIsDestination(false);
              }}
              className={styles.button}
            >
              ETH To Polygon
            </button>
            <button
              onClick={() => {
                setIsDestination(true) && setIsOrigin(false);
              }}
              className={styles.button}
            >
              Polygon to ETH
            </button>
          </div>
        </div>
        {isOrigin && origin()}
        {isDestination && destination()}
        {/* 
        {isOrigin && setIsDestination(false) && origin()}
        {isDestination && setIsOrigin(false) && destination()} */}
        {/* <Form /> */}

        {/* <img src="/ethtopolygonbridge.png" className={styles.img} /> */}
      </main>

      <footer className={styles.footer}>
        <a href="https://twitter.com/0xdhruva ">Built by @0xdhruva 🚀</a>
      </footer>
    </div>
  );
}
