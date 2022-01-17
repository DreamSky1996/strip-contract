const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const avaxBondAddress = "0xfcbd66A7D4674Bba16764Ea413e7f070A8Aa1e2f";
    const stakingAddress = "0x6966C9E01A4E4530F01590653aBbb74Ba5cDA1ec";
    const stakingHelperAddress = "0x2095C6a9a47695f4124A2A2e1178fDb16f61169a";
    const treasuryAddress = "0x4D75cca9A7F498Dc83EAEF67400C2CD3596c3592"
    const wavaxAddress = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    const avaxBondBCV = "220";
    const minBondPrice = "0";
    const maxBondPayout = "75";
    const maxBondDebt = "2000000000000000";
    const intialBondDebt = "0";
    const bondVestingLength = "432000";

    console.log("start");
    const AvaxBond = await ethers.getContractFactory('KandyEthBondDepository');
    const avaxBond = await AvaxBond.attach(avaxBondAddress);
    console.log("start set");
    // Set AVAX bond terms
    await avaxBond.initializeBondTerms(avaxBondBCV, minBondPrice, maxBondPayout, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set AVAX bond terms");

    // Set staking for AVAX bond
    await avaxBond.setStaking(stakingAddress, 0);
    await avaxBond.setStaking(stakingHelperAddress, 1);
    console.log("Set AVAX bond staking");

    const Treasury = await ethers.getContractFactory('KandyTreasury');
    const treasury = await Treasury.attach(treasuryAddress);

    await treasury.queue('2', wavaxAddress);
    await treasury.toggle('2', wavaxAddress, zeroAddress);
    console.log("queue and toggle WAVAX reserve token");

    // queue and toggle WAVAX bond reward manager
    await treasury.queue('8', avaxBond.address);
    await treasury.toggle('8', avaxBond.address, zeroAddress);
    console.log("queue and toggle WAVAX bond reward manager");
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})