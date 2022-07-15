# Bridge from ETH(Rinkeby) to Polygon(Mumbai)

Now you can transfer the Stacked Dollars to & fro from Rinkeby🔥 to Polygon 🔥. The website link will be out soon  
LFG 🚀🚀

## Screenshots

![Bridge](https://i.ibb.co/KF3ps0r/bridge.png)

## Demo Link

You can view the Demo Link here soon :

## Run Locally for your token && Deploy the Contracts

- Clone the project

```bash
  git clone https://github.com/Dhruv-2003/SDTokenBridge
```

- Go to Solidity directory

```bash
  cd solidity
```

```bash
  npm insatll
```

```bash
  npx hardhat run scripts/origin.js --network rinkeby
```

Copy out the Contract Addresses and store it in a file

```bash
  npx hardhat run scripts/destination.js --network mumbai
```

Copy out the Contract Addresses and store it in a file

- Go to backend project directory
  && change the .env file with the example below

```bash
  cd backend
```

```bash
  npm install

  or

  yarn install
```

```bash
npm start
```

-Go to the frontend project directory

```bash
  cd frontned
```

Install dependencies

```bash
  npm install

  or

  yarn install
```

- Change the .env files with the example file below

- Start the server

```bash
  npm run dev
```

## env Example

- frontend

```bash
ALCHEMY_ID =
ORIGIN_TOKEN_ADDRESS =
DESTINATION_TOKEN_ADDRESS =
BRIDGE_WALLET =
```

- backend

```bash
ORIGIN_WSS_ENDPOINT=
ORIGIN_HTTPS_ENDPOINT=
ORIGIN_TOKEN_CONTRACT_ADDRESS=
DESTINATION_WSS_ENDPOINT=
DESTINATION_HTTPS_ENDPOINT=
DESTINATION_TOKEN_CONTRACT_ADDRESS=
BRIDGE_WALLET=
BRIDGE_PRIV_KEY=
ORIGIN_EXPLORER=https://ropsten.etherscan.io/tx/
DESTINATION_EXPLORER=https://explorer.pops.one/
WALLET_ZERO=0x0000000000000000000000000000000000000000

```

## Support

For support, email contact.dhruvagarwal@gmail.com .
