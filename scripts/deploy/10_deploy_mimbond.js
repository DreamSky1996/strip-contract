const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    const stripAddress = "0x41bF588d7Eb46c36DB6fEF3eC446b477937017E9";
    const treasuryAddress = "0x58863DfCDC511a93a4A544388E0557a74Fd16c0f";
    const daoAddress = "0x012bAbB7632f5F7d3d6E68edea4bdc53Eb537C8a";
    const mimAddress = "0x1BFA78D76256d3b00FB13745cfC3934301cb6d8f";
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    // Deploy MIM bond
    const MIMBond = await ethers.getContractFactory('StripBondDepository');
    const mimBond = await MIMBond.deploy(stripAddress, mimAddress, treasuryAddress, daoAddress, zeroAddress);
    console.log("mimBond deployed on ", mimBond.address);
    // mimBond address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})