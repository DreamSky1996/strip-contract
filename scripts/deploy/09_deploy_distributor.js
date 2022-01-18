const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const firstEpochBlock = "13819948";
    const epochLengthInBlocks = "1920";

    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
    const treasuryAddress = "0xAd33f21412Be9b98997f073DdCa8C3A45D718E39";
    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasuryAddress, stripAddress, epochLengthInBlocks, firstEpochBlock);
    console.log("distributor deployed on ", distributor.address);
    // distributor address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})