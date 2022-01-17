const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stakingAddress = "0x6286c3c2ad15720cB75Abc4cb44bF58956b0d14E";
    const sStripAddress = "0x90317383A3b491B025942e606D52EE73Da3C9572";
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