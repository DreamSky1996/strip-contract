const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
    const treasuryAddress = "0xAd33f21412Be9b98997f073DdCa8C3A45D718E39";
    const daoAddress = "0x85eCD09b2Dfc0C29f936F37ebD9A7274ad4f297a";
    const mimAddress = "0xf1aAEB228FEDa61f546CB154F09dd758d32e573c";
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