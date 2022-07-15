require("@nomiclabs/hardhat-waffle");
//load env file
require("dotenv").config();
//....
module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: "./contracts",
    artifacts: "../web/src/artifacts",
    tests: "./test",
  },
  networks: {
    // Eth side of the bridge
    origin: {
      url: process.env.DEPLOY_ENDPOINT_ORIGIN,
      accounts: [process.env.DEPLOY_ACC_KEY],
    },
    // Harmony side of the bridge
    destination: {
      url: process.env.DEPLOY_ENDPOINT_DESTINATION,
      accounts: [process.env.DEPLOY_ACC_KEY],
    },
  },
};
