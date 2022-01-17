const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    const stripAddress = "0x4d9b733Cc3d30f0fD64b3746d452e035aDbDF43f";
    const treasuryAddress = "0xdfddb8B260916cE081E1Ead4B8bDcD0451B1621B";
    const daoAddress = "0x012bAbB7632f5F7d3d6E68edea4bdc53Eb537C8a";
    const usdtAddress = "0xaCc58E44C73394c2FC12af9697bFD1D790ecA4B9";
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    // Deploy MIM bond
    const USDTBond = await ethers.getContractFactory('StripBondDepository');
    const usdtBond = await USDTBond.deploy(stripAddress, usdtAddress, treasuryAddress, daoAddress, zeroAddress);
    console.log("usdtBond deployed on ", usdtBond.address);
    // mimBond address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})