const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    const stripAddress = "0xaf9Fc588A9860F43236D6b390A538305A26AA81D";
    const treasuryAddress = "0x56D43ea61d9098c73E6741912e9BC91B0F3CD9dF";
    const daoAddress = "0xe02eb7BDdf5b8bFD3404A8a77B88f9706EC7B225";
    const StripMimLpTokenAddress = "0xADdc2fAb2c09aEE808Efed90f6509Ee6A24ab6aa";
    const bondingCalculatorAddress = "0x9c3306e1Ba5f04CF98479Ed0BA6eD3684115FC18";
    // Deploy strip-MIM bond
    const StripMIMBond = await ethers.getContractFactory('StripBondDepository');
    const stripMIMBond = await StripMIMBond.deploy(stripAddress, StripMimLpTokenAddress, treasuryAddress, daoAddress, bondingCalculatorAddress);
    console.log("StripMIMBond deployed on ", stripMIMBond.address);
    // stripMIMBond address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})