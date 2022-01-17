const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const mimBondAddress = "0x90317383A3b491B025942e606D52EE73Da3C9572";
    const stakingAddress = "0xaCc58E44C73394c2FC12af9697bFD1D790ecA4B9";
    const stakingHelperAddress = "0x94dd396818c3120b01e11D7f99954f2D7e4D9F8C";

    const mimBondBCV = "220";
    const minBondPrice = "500";
    const maxBondPayout = "75";
    const bondFee = "10000";
    const maxBondDebt = "2000000000000000";
    const intialBondDebt = "0";
    const bondVestingLength = "432000";

    const MIMBond = await ethers.getContractFactory('StripBondDepository');
    const mimBond = await MIMBond.attach(mimBondAddress);
    
    // Set MIM bond terms
    await mimBond.initializeBondTerms(mimBondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set MIM bond terms");

    // Set staking for MIM bond
    await mimBond.setStaking(stakingAddress, 0);
    await mimBond.setStaking(stakingHelperAddress, 1);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})