const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy kandy
    const Strip = await ethers.getContractFactory('StripERC20Token');
    const strip = await Strip.deploy();
    console.log("Strip deployed on ", strip.address);
    // Strip address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})