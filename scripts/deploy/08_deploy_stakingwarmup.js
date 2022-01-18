const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stakingAddress = "0xdC3849C73A484560fd5f87C85a24c3e1bd79dA85";
    const sStripAddress = "0x640637d95c9c2DaE60AAa1cc76741616a5256FE2";
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