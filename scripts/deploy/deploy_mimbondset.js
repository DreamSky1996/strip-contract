const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const mimBondAddress = "0xeFc5eB216E05dA34d6a4cA90AcCD256c8b918E71";
    const stakingAddress = "0xdC3849C73A484560fd5f87C85a24c3e1bd79dA85";
    const stakingHelperAddress = "0x524B086f9722fD2e1960724D39fEac5E80Cb54EC";

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