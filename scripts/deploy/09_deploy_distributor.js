const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const firstEpochBlock = "13819948";
    const epochLengthInBlocks = "1920";

    const stripAddress = "0x4d9b733Cc3d30f0fD64b3746d452e035aDbDF43f";
    const treasuryAddress = "0xdfddb8B260916cE081E1Ead4B8bDcD0451B1621B";
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