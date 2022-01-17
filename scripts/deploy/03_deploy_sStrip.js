const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy MEMO
    const SStrip = await ethers.getContractFactory('SStrip');
    const sStrip = await SStrip.deploy();
    console.log("sStrip deployed on ", sStrip.address);
    // sStrip address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})