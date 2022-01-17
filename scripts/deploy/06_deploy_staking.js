const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const epochLengthInBlocks = "28800";
    const firstEpochNumber = "343";
    const firstEpochBlock = "1638511200";
    const stripAddress = "0x41bF588d7Eb46c36DB6fEF3eC446b477937017E9";
    const sStripAddress = "0x23604b09a83C44f28377666C9dfCEeAADBE62b34";
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