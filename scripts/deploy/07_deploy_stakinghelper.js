const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stakingAddress = "0xdC3849C73A484560fd5f87C85a24c3e1bd79dA85";
    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
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