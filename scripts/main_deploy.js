const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const epochLengthInBlocks = "28800";
    const firstEpochNumber = "342";
    const firstEpochBlock = "1638482400";
    const initialIndex = "7675210820";
    const initialRewardRate = "3000";

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const mimAddress = "0x130966628846bfd36ff31a822705796e8cb8c18d";
    const mimBondBCV = "220";
    const minBondPrice = "500";
    const maxBondPayout = "75";
    const bondFee = "10000";
    const maxBondDebt = "2000000000000000";
    const intialBondDebt = "0";
    const bondVestingLength = "432000";
    const initTokenMint = "1000000000000";
    const largeApproval = "100000000000000000000000000000000";

    // Deploy DAO
    const DAO = await ethers.getContractFactory('MultiSigWalletWithDailyLimit');
    const dao = await DAO.deploy([deployer.address], 1, 0);
    console.log("dao deployed on ", dao.address);
    
    // Deploy strip
    const Strip = await ethers.getContractFactory('StripERC20Token');
    const strip = await Strip.deploy();
    console.log("strip deployed on ", strip.address);
    // Deploy MEMO
    const MEMO = await ethers.getContractFactory('MEMOries');
    const memo = await MEMO.deploy();
    console.log("memo deployed on ", memo.address);
    // Deploy bonding calc
    const BondingCalculator = await ethers.getContractFactory('StripBondingCalculator');
    const bondingCalculator = await BondingCalculator.deploy( strip.address );
    console.log("BondingCalculator deployed on ", bondingCalculator.address);
    // Deploy treasury
    const Treasury = await ethers.getContractFactory('StripTreasury');
    const treasury = await Treasury.deploy( strip.address, mimAddress, 0 );
    console.log("treasury deployed on", treasury.address);
    // Deploy Staking
    const Staking = await ethers.getContractFactory('StripStaking');
    const staking = await Staking.deploy( strip.address, memo.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    console.log("StripStaking deployed on ", staking.address);
    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, strip.address);
    console.log("stakingHelper deployed on ", stakingHelper.address);
    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(staking.address, memo.address);
    console.log("stakingWarmup deployed on ", stakingWarmup.address);
    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, strip.address, epochLengthInBlocks, firstEpochBlock);
    console.log("distributor deployed on ", distributor.address);
    const MIMBond = await ethers.getContractFactory('StripBondDepository');
    const mimBond = await MIMBond.deploy(strip.address, mimAddress, treasury.address, dao.address, zeroAddress);
    console.log("mimBond deployed on ", mimBond.address);
    
    // const daoAddress = "0x3d4D636340C79a51BB729AcE2A9fFF065D5aF867";
    // const stripAddress = "0x39aAb4d3fa504666DF98745e9d04B7B5b1b5d108";
    // const memoAddress = "0xD6eeEF61Db61109313Fb89D711eB7720a67426bE";
    // const calcAddress = "0xCcf62d3052dcdA88cDAB5358828BFd40BD1fC379";
    // const treasuryAddress = "0x45b82B147Ef5a4A205b2446bf7B45040249596f3";
    // const stakingAddress = "0x805d567592883F3ef4fc9c663c318e6BdaA3Ac0d";
    // const stakingHelperAddress = "0x93845e0A1049468b3315e18136Bafa4b83098219";
    // const stakingWarmupAddress = "0xE5B13e7d84942044763B6eB043f2691342Fb7E07";
    // const distributorAddress = "0x3beE8a8aBf17ea560f2d98Ab804967842E865a02";
    // const mimBondAddress = "0xea609bF22238baa25a33AaA5D19D54834df3843D"; 

    // const DAO = await ethers.getContractFactory('MultiSigWalletWithDailyLimit');
    // const dao = await DAO.attach(daoAddress);
    
    // const Strip = await ethers.getContractFactory('StripERC20Token');
    // const strip = await Strip.attach(stripAddress);
    
    // const MEMO = await ethers.getContractFactory('MEMOries');
    // const memo = await MEMO.attach(memoAddress);

    // const BondingCalculator = await ethers.getContractFactory('StripBondingCalculator');
    // const bondingCalculator = await BondingCalculator.attach( calcAddress );

    // const Treasury = await ethers.getContractFactory('StripTreasury');
    // const treasury = await Treasury.attach( treasuryAddress );

    // const Staking = await ethers.getContractFactory('StripStaking');
    // const staking = await Staking.attach( stakingAddress );

    // const StakingHelper = await ethers.getContractFactory('StakingHelper');
    // const stakingHelper = await StakingHelper.attach( stakingHelperAddress );

    // const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    // const stakingWarmup = await StakingWarmpup.attach( stakingWarmupAddress );

    // const Distributor = await ethers.getContractFactory('Distributor');
    // const distributor = await Distributor.attach( distributorAddress );

    // const MIMBond = await ethers.getContractFactory('StripBondDepository');
    // const mimBond = await MIMBond.attach(mimBondAddress);

    
    
    // Initialize sstrip and set the index
    await memo.initialize(staking.address);
    await memo.setIndex(initialIndex);
    console.log("Initialize sstrip and set the index");
    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);
    console.log("set distributor contract and warmup contract");
    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);
    console.log("Add staking contract as distributor recipient");
    // queue and toggle reward manager
    await treasury.queue('8', distributor.address);
    console.log("queue reward manager");
    await treasury.toggle('8', distributor.address, zeroAddress);
    console.log("toggle reward manager");
    // Approve staking and staking helper contact to spend deployer's strip

    // console.log("start");

    await strip.approve(staking.address, largeApproval);
    await strip.approve(stakingHelper.address, largeApproval);
    console.log("strip approved stakingHelper");
    // queue and toggle MIM bond reserve depositor
    await treasury.queue('0', mimBond.address);
    await treasury.toggle('0', mimBond.address, zeroAddress);
    console.log("queue and toggle MIM bond reserve depositor");
    // Set MIM bond terms
    await mimBond.initializeBondTerms(mimBondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set MIM bond terms");
    // Set staking for MIM bond
    await mimBond.setStaking(staking.address, 0);
    await mimBond.setStaking(stakingHelper.address, 1);
    console.log("Set staking for MIM bond");

    // Set treasury for strip token
    await strip.setVault(deployer.address);
    console.log("Set treasury for strip token");

    // Set treasury for strip token
    await strip.mint(deployer.address, initTokenMint);
    console.log("Token mint 1000");

    // Set treasury for strip token
    await strip.setVault(treasury.address);
    console.log("Set treasury for strip token");
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})