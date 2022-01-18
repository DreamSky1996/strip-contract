const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
    const mimAddress = "0xf1aAEB228FEDa61f546CB154F09dd758d32e573c";
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