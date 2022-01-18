const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
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