const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy kandy
    const Kandy = await ethers.getContractFactory('StripERC20Token');
    const kandy = await Kandy.deploy();
    console.log("Strip deployed on ", kandy.address);
    // Strip address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})