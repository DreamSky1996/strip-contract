const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stakingAddress = "0xaCc58E44C73394c2FC12af9697bFD1D790ecA4B9";
    const stripAddress = "0x41bF588d7Eb46c36DB6fEF3eC446b477937017E9";
    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(stakingAddress, stripAddress);
    console.log("stakingHelper deployed on ", stakingHelper.address);
    // stakingHelper address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})