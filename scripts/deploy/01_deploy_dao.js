const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy DAO
    const DAO = await ethers.getContractFactory('MultiSigWalletWithDailyLimit');
    const dao = await DAO.deploy([deployer.address], 1, 0);
    console.log("dao deployed on ", dao.address);
    // dao address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})