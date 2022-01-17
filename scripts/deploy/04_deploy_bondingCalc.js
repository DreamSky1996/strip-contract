const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stripAddress = "0x41bF588d7Eb46c36DB6fEF3eC446b477937017E9";
    // Deploy bonding calc
    const BondingCalculator = await ethers.getContractFactory('StripBondingCalculator');
    const bondingCalculator = await BondingCalculator.deploy( stripAddress );
    console.log("BondingCalculator deployed on ", bondingCalculator.address);
    // bondingCalculator address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})