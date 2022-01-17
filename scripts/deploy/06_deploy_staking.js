const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const epochLengthInBlocks = "1920";
    const firstEpochNumber = "68";
    const firstEpochBlock = "13819948";
    const stripAddress = "0x4d9b733Cc3d30f0fD64b3746d452e035aDbDF43f";
    const sStripAddress = "0x90317383A3b491B025942e606D52EE73Da3C9572";
    // Deploy Staking
    const Staking = await ethers.getContractFactory('StripStaking');
    const staking = await Staking.deploy( stripAddress, sStripAddress, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    console.log("StripStaking deployed on ", staking.address);
    // StripStaking address :
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})