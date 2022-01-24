const { expect } = require("chai");

const zeroAddress = '0x0000000000000000000000000000000000000000';
const largeApproval = '100000000000000000000000000000000';
const initialMint = '10000000000000000000000000';
const epochLengthInBlocks = "1920";
const firstEpochNumber = "68";
const firstEpochBlock = "13819948";
const initialRewardRate = "3000";
const mimBondBCV = "220";
const minBondPrice = "15000";
const maxBondPayout = "75";
const bondFee = "10000";
const maxBondDebt = "2000000000000000";
const intialBondDebt = "0";
const bondVestingLength = "28800";
const initialIndex = '20064431173';

describe("Mock MIM Test", function() {
  let deployer, addr1, addr2; // address
  let Strip, strip; // strip contract
  let  MIM, mim; // Mock MIM contract
  let SStrip, sStrip; // sStrip contract
  let Treasury, treasury; // Treasury contract
  let BondingCalculator, bondingCalculator; // BondingCalc contract
  let Staking, staking; // staking contract
  let StakingHelper, stakingHelper; // stakinghelper contract
  let StakingWarmpup, stakingWarmup; // stakingWarmpup contract
  let Distributor, distributor; // distributor contract
  let MIMBond, mimBond // mimbond contract
  
  beforeEach(async () => {
    [deployer, dao, addr1, addr2] = await ethers.getSigners();
    
    // console.log("\nStripERC20Token: deploying ...")
    Strip = await ethers.getContractFactory('StripERC20Token');
    strip = await Strip.deploy();
    // console.log("StripERC20Token: deployed");
    
    // console.log("MIM: deploying ...");
    MIM = await ethers.getContractFactory('AnyswapV5ERC20');
    mim = await MIM.deploy("Magic Internet Money", "MIM", 18, zeroAddress, deployer.address);
    // console.log("MIM: deployed");

    await mim.initVault(deployer.address);
    await mim.mint( deployer.address, initialMint );
    
    // console.log("SStrip: deploying ...");
    SStrip = await ethers.getContractFactory('SStrip');
    sStrip = await SStrip.deploy();
    // console.log("SStrip: deployed");

    // console.log("StripTreasury: deploying ...");
    Treasury = await ethers.getContractFactory('StripTreasury');
    treasury = await Treasury.deploy( strip.address, mim.address, 0 );
    // console.log("StripTreasury: deployed");
    
    // console.log("StripBondingCalculator: deploying ...");
    BondingCalculator = await ethers.getContractFactory('StripBondingCalculator');
    bondingCalculator = await BondingCalculator.deploy( strip.address );
    // console.log("StripBondingCalculator: deployed");

    // console.log("StripStaking: deploying ...");
    Staking = await ethers.getContractFactory('StripStaking');
    staking = await Staking.deploy( strip.address, sStrip.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    
    // console.log("StripStaking: deployed");

    // console.log("StakingHelper: deploying ...");
    StakingHelper = await ethers.getContractFactory('StakingHelper');
    stakingHelper = await StakingHelper.deploy(staking.address, strip.address);
    // console.log("StakingHelper: deployined");

    // console.log("StakingWarmup: deploying ...");
    StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    stakingWarmup = await StakingWarmpup.deploy(staking.address, sStrip.address);
    // console.log("StakingWarmup: deployed");

    // console.log("Distributor: deploying ...");
    Distributor = await ethers.getContractFactory('Distributor');
    distributor = await Distributor.deploy(treasury.address, strip.address, epochLengthInBlocks, firstEpochBlock);
    // console.log("Distributor: deployed");

    // console.log("StripBondDepository: deploying ...\n");
    MIMBond = await ethers.getContractFactory('StripBondDepository');
    mimBond = await MIMBond.deploy(strip.address, mim.address, treasury.address, dao.address, zeroAddress);
    // console.log("StripBondDepository: deployed\n");

    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);

    distributor.addRecipient(staking.address, initialRewardRate);

    await treasury.queue('0', mimBond.address);
    await treasury.toggle('0', mimBond.address, zeroAddress);

    await mimBond.initializeBondTerms(mimBondBCV, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt, bondVestingLength);
    await mimBond.setStaking(staking.address, 0);
    await mimBond.setStaking(stakingHelper.address, 1);

    await sStrip.initialize(staking.address);
    await sStrip.setIndex(initialIndex);

    await strip.setVault(treasury.address);

    await treasury.queue('8', distributor.address);
    await treasury.toggle('8', distributor.address, zeroAddress);

    await treasury.queue('0', deployer.address);
    await treasury.toggle('0', deployer.address, zeroAddress);

    await treasury.queue('4', deployer.address, );
    await treasury.toggle('4', deployer.address, zeroAddress);

    await mim.approve(treasury.address, largeApproval );
    await mim.approve(mimBond.address, largeApproval );
    await strip.approve(staking.address, largeApproval);
    await strip.approve(stakingHelper.address, largeApproval);
    
  });

  describe("MOCK MIM", function() {
    it("mint", async () => {
      console.log("\tcheck mint function");
      expect(await mim.balanceOf(deployer.address)).to.equal(initialMint);
    });
  });
});
