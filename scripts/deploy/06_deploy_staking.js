const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const epochLengthInBlocks = "1920";
    const firstEpochNumber = "68";
    const firstEpochBlock = "13819948";
    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
    const sStripAddress = "0x640637d95c9c2DaE60AAa1cc76741616a5256FE2";
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