const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);
    const mimKandyBondAddress = "0xd0023548349FeD39e1CAB232D02766E40067ADE0";
    const stakingAddress = "0x6966C9E01A4E4530F01590653aBbb74Ba5cDA1ec";
    const stakingHelperAddress = "0x2095C6a9a47695f4124A2A2e1178fDb16f61169a";
    const treasuryAddress = "0x4D75cca9A7F498Dc83EAEF67400C2CD3596c3592";
    const mimKandyLPTokenAddress = "0xf12B055625200a6e30c35424b9F02A76BCF9d106";
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const bondCalcAddress = "0x99d8B8A86E96f9092a14fdBc5d92eFFA0D0cf4fB";

    const BondBCV = "220";
    const minBondPrice = "0";
    const maxBondPayout = "75";
    const maxBondDebt = "2000000000000000";
    const intialBondDebt = "0";
    const bondVestingLength = "432000";
    const bondFee = "10000";

    console.log("start");
    const MIMKandyBond = await ethers.getContractFactory('KandyBondDepository');
    const mimKandyBond = await MIMKandyBond.attach(mimKandyBondAddress);
    console.log("start set");
    // Set AVAX bond terms
    await mimKandyBond.initializeBondTerms(BondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set AvaxKandy bond terms");

    // Set staking for AVAX bond
    await mimKandyBond.setStaking(stakingAddress, 0);
    await mimKandyBond.setStaking(stakingHelperAddress, 1);
    console.log("Set AvaxKandy bond staking");

    const Treasury = await ethers.getContractFactory('KandyTreasury');
    const treasury = await Treasury.attach(treasuryAddress);

    await treasury.queue('5', mimKandyLPTokenAddress);
    await treasury.toggle('5', mimKandyLPTokenAddress, bondCalcAddress);
    console.log("queue and toggle LP token reserve token");

    // queue and toggle WAVAX bond reward manager
    await treasury.queue('4', mimKandyBond.address);
    await treasury.toggle('4', mimKandyBond.address, zeroAddress);
    console.log("queue and toggle AvaxKandy bond reward manager");

 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})