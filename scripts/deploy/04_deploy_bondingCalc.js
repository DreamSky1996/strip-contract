const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stripAddress = "0x4d9b733Cc3d30f0fD64b3746d452e035aDbDF43f";
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