const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stakingAddress = "0xaCc58E44C73394c2FC12af9697bFD1D790ecA4B9";
    const sStripAddress = "0x23604b09a83C44f28377666C9dfCEeAADBE62b34";
    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(stakingAddress, sStripAddress);
    console.log("stakingWarmup deployed on ", stakingWarmup.address);
    // stakingWarmup address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})