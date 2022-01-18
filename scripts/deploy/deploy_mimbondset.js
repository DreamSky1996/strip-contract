const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const mimBondAddress = "0xA40C72Fd2B7d49588D65d86cbAA551c105C0Af96";
    const stakingAddress = "0x6286c3c2ad15720cB75Abc4cb44bF58956b0d14E";
    const stakingHelperAddress = "0x79EfC34B4eDec1175eAa68ac727615E5dB7336df";

    const mimBondBCV = "220";
    const minBondPrice = "15000";
    const maxBondPayout = "75";
    const bondFee = "10000";
    const maxBondDebt = "2000000000000000";
    const intialBondDebt = "0";
    const bondVestingLength = "28800";

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