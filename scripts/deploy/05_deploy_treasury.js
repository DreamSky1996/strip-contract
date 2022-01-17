const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stripAddress = "0x4d9b733Cc3d30f0fD64b3746d452e035aDbDF43f";
    const usdtAddress = "0xaCc58E44C73394c2FC12af9697bFD1D790ecA4B9";
    // Deploy treasury
    const Treasury = await ethers.getContractFactory('StripTreasury');
    const treasury = await Treasury.deploy( stripAddress, usdtAddress, 0 );
    console.log("treasury deployed on", treasury.address);
    // treasury address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})