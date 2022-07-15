const { ethers } = require("ethers");
import { approveBurn, mintToken, burnToken, transferToken } from "./contract";

const providerOrigin = ethers.getDefaultProvider(
  process.env.ORIGIN_WSS_ENDPOINT
);
const providerDestination = ethers.getDefaultProvider(
  process.env.DESTINATION_WSS_ENDPOINT
);
const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS;
const DESTINATION_TOKEN_CONTRACT_ADDRESS =
  process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS;
const BRIDGE_WALLET = process.env.BRIDGE_WALLET;

const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY;

const WALLET_ORIGIN = new ethers.Wallet(BRIDGE_WALLET_KEY, providerOrigin);
const WALLET_DESTINATION = new ethers.Wallet(
  BRIDGE_WALLET_KEY,
  providerDestination
);

const SD_ABIJSON = require("../../web/src/artifacts/contracts/OriginToken.sol/StackDollars.json");
const WSD_ABIJSON = require("../../web/src/artifacts/contracts/DestinationToken.sol/WrappedStackDollars.json");

const BRIDGE_SIGNER = new ethers.Wallet(BRIDGE_WALLET_KEY, provider);

const ORIGIN_CONTRACT = new ethers.Contract(
  ORIGIN_TOKEN_CONTRACT_ADDRESS,
  SD_ABIJSON,
  provider
);

const ORIGIN = ORIGIN_CONTRACT.connect(WALLET_ORIGIN);
const DESTINATION = DESTINATION_CONTRACT.connect(WALLET_DESTINATION);

const DESTINATION_CONTRACT = new ethers.Contract(
  DESTINATION_TOKEN_CONTRACT_ADDRESS,
  WSD_ABIJSON,
  provider
);
const handleOriginEvents = async ({ from, to, amount, contract }) => {
  try {
    console.log("Handling ETH Event");

    if (from == BRIDGE_WALLET) {
      console.log("Transfer is a bridge back");
      return;
    }
    if (to == BRIDGE_WALLET && to != from) {
      console.log("Tokens received on bridge from ETH chain! Time to bridge!");

      try {
        const tokensMinted = await mintToken(contract, amount, from);
        if (!tokensMinted) return;
        console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
      } catch (err) {
        console.error("Error processing transaction", err);
        // TODO: return funds
      }
    } else {
      console.log("Another Transfer");
    }
  } catch (err) {
    console.log(err);
  }
};
const handleDestinationEvents = async ({
  from,
  value,
  to,
  contract,
  contractDest,
}) => {
  if (from == process.env.WALLET_ZERO) {
    console.log("Tokens minted");
    return;
  }

  if (to == BRIDGE_WALLET && to != from) {
    console.log(
      "Tokens received on bridge from destination chain! Time to bridge back!"
    );

    try {
      // we need to approve burn, then burn
      const tokenBurnApproved = await approveBurn(contractDest, value);
      if (!tokenBurnApproved) return;
      console.log("Tokens approved to be burnt");
      const tokensBurnt = await burnToken(contractDest, value);

      if (!tokensBurnt) return;
      console.log(
        "Tokens burnt on destination, time to transfer tokens in ETH side"
      );
      const transferBack = await transferToken(contract, value, from);
      if (!transferBack) return;

      console.log("Tokens transfered to ETH wallet");
      console.log("🌈🌈🌈🌈🌈 Bridge back operation completed");
    } catch (err) {
      console.error("Error processing transaction", err);
      // TODO: return funds
    }
  } else {
    console.log("Something else triggered Transfer event");
  }
};

const main = async () => {
  console.log("Listening for events");
  //// event listner
  ORIGIN_CONTRACT.on("Transfer", (from, to, amount) => {
    handleOriginEvents(from, to, amount, ORIGIN);
  });
  console.log(
    `Waiting for Transfer events on ${ORIGIN_TOKEN_CONTRACT_ADDRESS}`
  );

  DESTINATION_CONTRACT.on("Transfer", (from, to, amount) => {
    handleDestinationEvents(from, amount, to, ORIGIN, DESTINATION);
  });
  console.log(
    `Waiting for Transfer events on ${DESTINATION_TOKEN_CONTRACT_ADDRESS}`
  );
};

main();
