const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    const kandyAddress = "0xaf9Fc588A9860F43236D6b390A538305A26AA81D";
    const treasuryAddress = "0x56D43ea61d9098c73E6741912e9BC91B0F3CD9dF";
    const daoAddress = "0xe02eb7BDdf5b8bFD3404A8a77B88f9706EC7B225";
    const avaxAddress = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
    const avaxUsdPriceFeedAddress = "0x0A77230d17318075983913bC2145DB16C7366156";
    // Deploy MIM bond
    const AvaxBond = await ethers.getContractFactory('KandyEthBondDepository');
    const avaxBond = await AvaxBond.deploy(kandyAddress, avaxAddress, treasuryAddress, daoAddress, avaxUsdPriceFeedAddress);
    console.log("avaxBond deployed on ", avaxBond.address);
    // avaxBond address : 0x8cce0d3f7b13246E45F14d4De0e50303330Ea1a0
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})