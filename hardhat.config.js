require("@nomiclabs/hardhat-waffle");
require('dotenv').config()
const privateKey = process.env.PRIVATEKEY
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.4.16',
      },
      {
        version: '0.5.14',
      },
      {
        version: '0.5.17',
      },
      {
        version: '0.6.6',
      },
      {
        version: '0.6.12',
      },
      {
        version: '0.7.5',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.8.2',
      }
    ]
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 30000000000,
      accounts: [privateKey]
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      gasPrice: 30000000000,
      accounts: [privateKey]
    }
  }
};
