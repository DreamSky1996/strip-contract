const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stakingAddress = "0x6286c3c2ad15720cB75Abc4cb44bF58956b0d14E";
    const stripAddress = "0x4d9b733Cc3d30f0fD64b3746d452e035aDbDF43f";
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