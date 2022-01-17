const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const firstEpochBlock = "1638511200";
    const epochLengthInBlocks = "28800";

    const stripAddress = "0x41bF588d7Eb46c36DB6fEF3eC446b477937017E9";
    const treasuryAddress = "0x58863DfCDC511a93a4A544388E0557a74Fd16c0f";
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