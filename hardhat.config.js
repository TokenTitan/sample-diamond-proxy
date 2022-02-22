
/* global ethers task */
require('@nomiclabs/hardhat-waffle')
require("@nomiclabs/hardhat-etherscan")
require('@nomiclabs/hardhat-ethers')
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.GOERLI_ALCHEMY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
      tags: ['testnet', 'L1'],
      // gasPrice: 600000000000, // Uncomment in case of pending txs, and adjust gas
      companionNetworks: {
        l2: 'mumbai',
      },
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  }
}
