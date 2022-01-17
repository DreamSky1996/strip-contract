// @dev. This script will deploy this V1.1 of Kandyland. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the Kandyland as of V1.1.
// Not that the every instance of the Treasury's function 'valueOf' has been changed to 'valueOfToken'... 
// This solidity function was conflicting w js object property name

const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Initial staking index
    const initialIndex = '7675210820';

    // First block epoch occurs
    const firstEpochBlock = '8961000';

    // What epoch will be first epoch
    const firstEpochNumber = '338';

    // How many blocks are in each epoch
    const epochLengthInBlocks = '2200';

    // Initial reward rate for epoch
    const initialRewardRate = '3000';

    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Large number for approval for Frax and MIM
    const largeApproval = '100000000000000000000000000000000';

    // Initial mint for Frax and MIM (10,000,000)
    const initialMint = '10000000000000000000000000';

    // MIM bond BCV
    const mimBondBCV = '369';


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
    const intialBondDebt = '0'

    // AVAX/USD price feed address
    const avaxUsdPriceFeedAddress = '0x0a77230d17318075983913bc2145db16c7366156';

    // Deploy DAO
    const DAO = await ethers.getContractFactory('MultiSigWalletWithDailyLimit');
    const dao = await DAO.deploy([deployer.address], 1, 0);
    console.log("dao deployed on ", dao.address);

    // Deploy KANDY
    const KANDY = await ethers.getContractFactory('KandylandERC20Token');
    const kandy = await KANDY.deploy();

    console.log("KANDY deployed on ",kandy.address);

    // Deploy MIM
    const MIM = await ethers.getContractFactory('AnyswapV5ERC20');
    const mim = await MIM.deploy("Magic Internet Money","MIM",18, zeroAddress, deployer.address );
    console.log("MIM deployed on ",mim.address);

    const WAVAX = await ethers.getContractFactory('WAVAX');
    const wAVAX = await WAVAX.deploy();
    console.log("WAVAX deployed on ", wAVAX.address);


    // Deploy 10,000,000 mock MIM and mock Frax
    await wAVAX.mint( deployer.address, initialMint );
    console.log("wAvax minted ", initialMint);

    await mim.initVault(deployer.address);
    await mim.mint( deployer.address, initialMint );
    console.log("mim minted ", initialMint);
    

    // Deploy treasury
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
    const Treasury = await ethers.getContractFactory('KandyTreasury'); 
    const treasury = await Treasury.deploy( kandy.address, mim.address, 0 );
    console.log("Treasury deployed on ", treasury.address);
    

    // Deploy bonding calc
    const KandylandBondingCalculator = await ethers.getContractFactory('KandyBondingCalculator');
    const kandylandBondingCalculator = await KandylandBondingCalculator.deploy( kandy.address );
    console.log("KandylandBondingCalculator deployed on ",kandylandBondingCalculator.address);
    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, kandy.address, epochLengthInBlocks, firstEpochBlock);
    console.log("Distributor deployed on ",distributor.address);
    // Deploy sKANDY
    const SKANDY = await ethers.getContractFactory('sKandyland');
    const sKANDY = await SKANDY.deploy();
    console.log("SKANDY deployed on ",sKANDY.address);

    // Deploy MEMO
    const wsKANDY = await ethers.getContractFactory('wsKANDY');
    const wskandy = await wsKANDY.deploy(sKANDY.address);
    console.log("wsKANDY deployed on ", wskandy.address);
    

    // Deploy Staking
    const Staking = await ethers.getContractFactory('KandyStaking');
    const staking = await Staking.deploy( kandy.address, sKANDY.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    console.log("Staking deployed on ",staking.address);

    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(staking.address, sKANDY.address);
    console.log("StakingWarmpup deployed on ",stakingWarmup.address);

    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, kandy.address);
    console.log("StakingHelper deployed on ",stakingHelper.address);

    // Deploy MIM bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const MIMBond = await ethers.getContractFactory('KandyBondDepository');
    const mimBond = await MIMBond.deploy(kandy.address, mim.address, treasury.address, dao.address, zeroAddress);
    console.log("MIMBond deployed on ",mimBond.address);


    // queue and toggle MIM and Frax bond reserve depositor
    await treasury.queue('0', mimBond.address);
 
    await treasury.toggle('0', mimBond.address, zeroAddress);
    console.log("mimBond toggle");
    
    // Set MIM and Frax bond terms
    await mimBond.initializeBondTerms(mimBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
    console.log("mimBond initializeBondTerms");
    // Set staking for MIM and Frax bond
    await mimBond.setStaking(staking.address, 0);
    console.log("mimBond setStaking");

    // Initialize sKANDY and set the index
    await sKANDY.initialize(staking.address);
    console.log("sKANDY.initialize");
    await sKANDY.setIndex(initialIndex);
    console.log("sKANDY.setIndex");

    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);

    // Set treasury for KANDY token
    await kandy.setVault(treasury.address);

    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);

    
    
    // queue and toggle reward manager
    await treasury.queue('8', distributor.address);
    await treasury.toggle('8', distributor.address, zeroAddress);

    // queue and toggle deployer reserve depositor
    await treasury.queue('0', deployer.address);
    await treasury.toggle('0', deployer.address, zeroAddress);

    // queue and toggle liquidity depositor
    await treasury.queue('4', deployer.address, );
    await treasury.toggle('4', deployer.address, zeroAddress);

    console.log("queue & toggle")
    // Approve the treasury to spend MIM and Frax
    await mim.approve(treasury.address, largeApproval );

    // Approve mim and frax bonds to spend deployer's MIM and Frax
    await mim.approve(mimBond.address, largeApproval );

    console.log("mim.approve")
    // Approve staking and staking helper contact to spend deployer's KANDY
    await kandy.approve(staking.address, largeApproval);
    await kandy.approve(stakingHelper.address, largeApproval);

    // Deposit 9,000,000 MIM to treasury, 600,000 KANDY gets minted to deployer and 8,400,000 are in treasury as excesss reserves
    await treasury.deposit('9000000000000000000000000', mim.address, '8400000000000000');
    console.log("treasury.deposit")

    // Stake KANDY through helper
    await stakingHelper.stake('100000000000', deployer.address);
    console.log("stakingHelper.stake")
    // Bond 1,000 KANDY and Frax in each of their bonds
    await mimBond.deposit('1000000000000000000000', '60000', deployer.address );
    console.log("mimBond.deposit")

    console.log( "KANDY: " + kandy.address );
    console.log( "MIM: " + mim.address );
    console.log( "Treasury: " + treasury.address );
    console.log( "Calc: " + kandylandBondingCalculator.address );
    console.log( "Staking: " + staking.address );
    console.log( "sKANDY: " + sKANDY.address );
    console.log( "wsKANDY: " + wsKANDY.address );
    console.log( "Distributor " + distributor.address);
    console.log( "Staking Wawrmup " + stakingWarmup.address);
    console.log( "Staking Helper " + stakingHelper.address);
    console.log("MIM Bond: " + mimBond.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})