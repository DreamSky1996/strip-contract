const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stripAddress = "0x41bF588d7Eb46c36DB6fEF3eC446b477937017E9";
    const mimAddress = "0x1BFA78D76256d3b00FB13745cfC3934301cb6d8f";
    // Deploy treasury
    const Treasury = await ethers.getContractFactory('StripTreasury');
    const treasury = await Treasury.deploy( stripAddress, mimAddress, 0 );
    console.log("treasury deployed on", treasury.address);
    // treasury address : 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})