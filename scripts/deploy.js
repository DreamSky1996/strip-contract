// @dev. This script will deploy this V1.1 of KandyLand. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the kandyland as of V1.1.
// Not that the every instance of the Treasury's function 'valueOf' has been changed to 'valueOfToken'... 
// This solidity function was conflicting w js object property name

const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Initial staking index
    const initialIndex = '20064431173';

    // First block epoch occurs
    const firstEpochBlock = '1638252000';

    // What epoch will be first epoch
    const firstEpochNumber = '334';

    // How many blocks are in each epoch
    const epochLengthInBlocks = '28800';

    // Initial reward rate for epoch
    const initialRewardRate = '3000';

    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Large number for approval for wAvax and MIM
    const largeApproval = '100000000000000000000000000000000';

    // Initial mint for wAvax and MIM (10,000,000)
    const initialMint = '10000000000000000000000000';

    // MIM bond BCV
    const mimBondBCV = '369';

    // wAvax bond BCV
    const wavaxBondBCV = '690';

    // Bond vesting length in blocks. 33110 ~ 5 days
    const bondVestingLength = '33110';

    // Min bond price
    const minBondPrice = '50000';

    // Max bond payout
    const maxBondPayout = '50'

    // DAO fee for bond
    const bondFee = '10000';

    // Max debt bond can take on
    const maxBondDebt = '1000000000000000';

    // Initial Bond debt
    const intialBondDebt = '0';

    // AVAX/USD price feed address
    const avaxUsdPriceFeedAddress = '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD';

 

    // Avax address
    const avaxAddress = '0xd00ae08403b9bbb9124bb305c09058e32c39a48c';

    // Deploy DAO *
    const DAO = await ethers.getContractFactory('MultiSigWalletWithDailyLimit');
    const dao = await DAO.deploy([deployer.address], 1, 0);
    console.log("dao deployed on ", dao.address);

    // Deploy kandy *
    const Kandy = await ethers.getContractFactory('KandyERC20Token');
    const kandy = await Kandy.deploy();
    console.log("kandy deployed on ", kandy.address);

    // Deploy MIM
    const MIM = await ethers.getContractFactory('AnyswapV5ERC20');
    const mim = await MIM.deploy("Magic Internet Money", "MIM", 18, zeroAddress, deployer.address);
    console.log("mim deployed on ", mim.address);

    // Deploy 10,000,000 mock MIM and mock wAvax
    await mim.initVault(deployer.address);
    await mim.mint( deployer.address, initialMint );
    console.log("mim minted ", initialMint);


    // Deploy treasury *
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was conflicting w js object property name
    const Treasury = await ethers.getContractFactory('KandyTreasury');
    const treasury = await Treasury.deploy( kandy.address, mim.address, 0 );
    console.log("treasury deployed on", treasury.address);

    // Deploy bonding calc *
    const BondingCalculator = await ethers.getContractFactory('KandyBondingCalculator');
    const bondingCalculator = await BondingCalculator.deploy( kandy.address );
    console.log("BondingCalculator deployed on ", bondingCalculator.address);

    // Deploy staking distributor *
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, kandy.address, epochLengthInBlocks, firstEpochBlock);
    console.log("distributor deployed on ", distributor.address);

    // Deploy MEMO *
    const MEMO = await ethers.getContractFactory('MEMOries');
    const memo = await MEMO.deploy();
    console.log("memo deployed on ", memo.address);

    // Deploy wMEMO
    const wMEMO = await ethers.getContractFactory('wMEMO');
    const wmemo = await wMEMO.deploy(memo.address);
    console.log("wmemo deployed on ", wmemo.address);

    // Deploy Staking *
    const Staking = await ethers.getContractFactory('KandyStaking');
    const staking = await Staking.deploy( kandy.address, memo.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    console.log("KandyStaking deployed on ", staking.address);

    // Deploy staking warmpup *
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(staking.address, memo.address);
    console.log("stakingWarmup deployed on ", stakingWarmup.address);

    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, kandy.address);
    console.log("stakingHelper deployed on ", stakingHelper.address);

    // Deploy MIM bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treasury contract
    const MIMBond = await ethers.getContractFactory('KandyBondDepository');
    const mimBond = await MIMBond.deploy(kandy.address, mim.address, treasury.address, dao.address, zeroAddress);
    console.log("mimBond deployed on ", mimBond.address);

  

    // Deploy AVAX bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treasury contract
    const AvaxBond = await ethers.getContractFactory('KandyEthBondDepository');
    const avaxBond = await AvaxBond.deploy(kandy.address, avaxAddress, treasury.address, dao.address, avaxUsdPriceFeedAddress);
    console.log("avaxBond deployed on ", avaxBond.address);

 

    // queue and toggle MIM and wAvax bond reserve depositor
    await treasury.queue('0', mimBond.address);
    await treasury.queue('0', avaxBond.address);
    await treasury.toggle('0', mimBond.address, zeroAddress);
    await treasury.toggle('0', avaxBond.address, zeroAddress);
    console.log("queue and toggle MIM and wAvax bond reserve depositor");

    // Set MIM and wAvax bond terms
    await mimBond.initializeBondTerms(mimBondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set MIM bond terms");
    await avaxBond.initializeBondTerms(wavaxBondBCV, minBondPrice, maxBondPayout, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set WAVAX bond terms");

    // Set staking for MIM and wAvax bond
    await mimBond.setStaking(staking.address, 0);
    await mimBond.setStaking(stakingHelper.address, 1);
    await avaxBond.setStaking(staking.address, 0);
    await avaxBond.setStaking(stakingHelper.address, 1);
    console.log("Set staking for MIM and wAvax bond");

    // Initialize memo and set the index
    await memo.initialize(staking.address);
    await memo.setIndex(initialIndex);
    console.log("Initialize memo and set the index");

    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);
    console.log("set distributor contract and warmup contract");

    // Set treasury for Kandy token
    await kandy.setVault(treasury.address);
    console.log("Set treasury for Kandy token");

    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);
    console.log("Add staking contract as distributor recipient");

    // queue and toggle reward manager
    await treasury.queue('8', distributor.address);
    console.log("queue reward manager");
    await treasury.toggle('8', distributor.address, zeroAddress);
    console.log("toggle reward manager");

    // queue and toggle deployer reserve depositor
    await treasury.queue('0', deployer.address);
    console.log("queue deployer reserve depositor");
    await treasury.toggle('0', deployer.address, zeroAddress);
    console.log("toggle deployer reserve depositor");

    // queue and toggle liquidity depositor
    await treasury.queue('4', deployer.address, );
    console.log("queue liquidity depositor");
    await treasury.toggle('4', deployer.address, zeroAddress);
    console.log("toggle liquidity depositor");

    // Approve the treasury to spend MIM and wAvax
    await mim.approve(treasury.address, largeApproval );
    console.log("Approved the treasury to spend MIM and wAvax");

    // Approve mim and wavax bonds to spend deployer's MIM and wAvax
    await mim.approve(mimBond.address, largeApproval );
    // await wavax.approve(avaxBond.address, largeApproval );
    // await wavax.approve(kandyAvaxBond.address, largeApproval );
    console.log("Approved mim and wavax bonds to spend deployer's MIM and wAvax");

    // Approve staking and staking helper contact to spend deployer's Kandy
    await kandy.approve(staking.address, largeApproval);
    await kandy.approve(stakingHelper.address, largeApproval);
    console.log("kandy approved stakingHelper");

    // Deposit 9,000,000 MIM to treasury, 600,000 kandy gets minted to deployer and 8,400,000 are in treasury as excesss reserves
    await treasury.deposit('9000000000000000000000000', mim.address, '8400000000000000');
    console.log("treasury deposited mim");

    // Stake kandy through helper
    await stakingHelper.stake('100000000000', deployer.address);
    console.log("Staked kandy through helper");

    // Bond 1,000 kandy and wAvax in each of their bonds
    await mimBond.deposit('1000000000000000000000', '60000', deployer.address );
    console.log("mimBond deposited");
    // await avaxBond.deposit('1000000000000000000000', '60000', deployer.address );
    // console.log("wavaxBond deposited");
    // await kandyMIMBond.deposit('1000000000000000000000', '60000', deployer.address );
    // console.log("kandyMIMBond deposited");
    // await kandyAvaxBond.deposit('1000000000000000000000', '60000', deployer.address );
    // console.log("kandyMIMBond deposited");

    console.log( "Kandy: " + kandy.address );
    console.log( "MIM: " + mim.address );
    console.log( "wAvax: " + avaxAddress );
    console.log( "MEMO: " + memo.address );
    console.log( "Treasury: " + treasury.address );
    console.log( "Calc: " + bondingCalculator.address );
    console.log( "Staking: " + staking.address );
    console.log( "Distributor: " + distributor.address );
    console.log( "Staking Wawrmup: " + stakingWarmup.address );
    console.log( "Staking Helper: " + stakingHelper.address );
    console.log( "MIM Bond: " + mimBond.address );
    console.log( "wAvax Bond: " + avaxBond.address );

    // mim: 0
    // avax : 2
    // 
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})