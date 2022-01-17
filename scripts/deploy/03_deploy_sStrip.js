const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy MEMO
    const MEMO = await ethers.getContractFactory('SStrip');
    const memo = await MEMO.deploy();
    console.log("sStrip deployed on ", memo.address);
    // sStrip address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})