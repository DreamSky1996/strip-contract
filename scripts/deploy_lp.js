// @dev. This script will deploy this V1.1 of KandyLand. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the kandyland as of V1.1.
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

    // Kandy-MIM lp token address
    const KandyMimLpTokenAddress = '0xD58AFc1c62C99BE0D79ec9D587b62cA49d5Dd68e'; // mim-kandy

    // kandy-AVAX lp token address
    const KandyAvaxLpTokenAddress = '0xf0b7eAb44fab7e4afB7110d8475B7725EfF57F48'; // avax-kandy

    // Avax address
    const avaxAddress = '0xd00ae08403b9bbb9124bb305c09058e32c39a48c';

    const daoAddress = '0x50d1D6398A3037E5B98Fa3efF6bDa1131143408a';

    const kandyAddress = '0x4010DdbfA72724f5c697908296a75301a0e8710e';

    const mimAddress = '0x7929959Aaa69F313856b2327a2cFAAB5728D8AF3';

    const treasuryAddress = '0xc335f1CeCA6fEB06498531041345e79c59345F49';

    const bondingCalculatorAddress = '0xf597a73ee0d1393998a7A99256b100D765B5ECcA';

    const distributorAddress = '0xd96f44848786fb9CAcFC101fd21bdB754459A644';
    
    const memoAddress = '0xA9E3340Ef70B2AED56279C73a9191317b7770A54';

    const wMemoAddress = '0xEc8137F20b2E356bdE56A07C360d975bd4b6476E';

    const stakingAddress = '0xA93de7762d7d02Cc7d7831924c29D50e6878BBFC';

    const stakingWarmupAddress = '0x652d712114B06f4C2Ac675c47A42CC13a7288760';

    const stakingHelperAddress = '0xfFfA655BD5660c44F82890eC60791936ad59579B';

    const mimBondAddress = '0xC46BA2CB3523A441d085E9F6bE3D753E90045D80';

    const avaxBond = '0xdB4d4828BE38822F2a7cF8e0f18c585Eca09bAE8';

    // Deploy kandy-MIM bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treasury contract
    const KandyMIMBond = await ethers.getContractFactory('KandyBondDepository');
    const kandyMIMBond = await KandyMIMBond.deploy(kandyAddress, KandyMimLpTokenAddress, treasuryAddress, daoAddress, bondingCalculatorAddress);
    console.log("KandyMIMBond deployed on ", kandyMIMBond.address);

    

    // Deploy Kandy-AVAX bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treasury contract
    const KandyAvaxBond = await ethers.getContractFactory('KandyBondDepository');
    const kandyAvaxBond = await KandyAvaxBond.deploy(kandyAddress, KandyAvaxLpTokenAddress, treasuryAddress, daoAddress, bondingCalculatorAddress);
    console.log("KandyAvaxBond deployed on ", kandyAvaxBond.address);

    // queue and toggle MIM and wAvax bond reserve depositor
    const Treasury = await ethers.getContractFactory('KandyTreasury');
    const treasury = await Treasury.attach(treasuryAddress);
    await treasury.queue('4', kandyMIMBond.address);
    await treasury.queue('4', kandyAvaxBond.address);
    await treasury.toggle('4', kandyMIMBond.address, zeroAddress);
    await treasury.toggle('4', kandyAvaxBond.address, zeroAddress);
    console.log("queue and toggle MIM and wAvax bond reserve depositor");

    // Set MIM and wAvax bond terms
    await kandyMIMBond.initializeBondTerms(mimBondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set Kandy-MIM bond terms");
    await kandyAvaxBond.initializeBondTerms(wavaxBondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    console.log("Set Kandy-WAVAX bond terms");

    // Set staking for MIM and wAvax bond
    await kandyMIMBond.setStaking(stakingAddress, 0);
    await kandyMIMBond.setStaking(stakingHelperAddress, 1);
    await kandyAvaxBond.setStaking(stakingAddress, 0);
    await kandyAvaxBond.setStaking(stakingHelperAddress, 1);
    console.log("Set staking for MIM and wAvax bond");

    // Approve mim and wavax bonds to spend deployer's MIM and wAvax
    const MIM = await ethers.getContractFactory('AnyswapV5ERC20');
    const mim = MIM.attach(mimAddress);
    await mim.approve(kandyMIMBond.address, largeApproval );

    console.log("Approved mim and wavax bonds to spend deployer's MIM and wAvax");
    console.log( "KandyMim Bond: ", kandyMIMBond.address );
    console.log( "KandyAvax Bond: ", kandyAvaxBond.address );
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})