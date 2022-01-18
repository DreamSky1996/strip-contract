const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const mimAddress = "0xf1aAEB228FEDa61f546CB154F09dd758d32e573c"
    const mimBondAddress = "0xeFc5eB216E05dA34d6a4cA90AcCD256c8b918E71";
    const stakingAddress = "0xdC3849C73A484560fd5f87C85a24c3e1bd79dA85";
    const stakingwarmupAddress = "0xE203eC62E1b4E019871fF06Bf46BFBB32A2338A2";
    const treasuryAddress = "0xAd33f21412Be9b98997f073DdCa8C3A45D718E39";
    const sStripAddress = "0x640637d95c9c2DaE60AAa1cc76741616a5256FE2";
    const stripAddress = "0x886a3898F07947B4A6c35eA4cd1FfA4619A2B8C9";
    const stripDistributor = "0xEB776b7a73F9dfAf068459Ed6438266da63681F4";

    
    const initialMint = "10000000000000000000000000";
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const initialIndex = "20064431173";
    const initialRewardRate = '3000';
    const largeApproval = '100000000000000000000000000000000';

    const MIMContract = await ethers.getContractFactory('AnyswapV5ERC20');
    const mimContract = await MIMContract.attach(mimAddress);

     // Deploy 10,000,000 mock MIM and mock wAvax
    //  await mimContract.initVault(deployer.address);
     

    const Treasury = await ethers.getContractFactory('StripTreasury');
    const treasury = await Treasury.attach(treasuryAddress);

    const SSTRIP = await ethers.getContractFactory('SStrip');
    const sSTRIP = await SSTRIP.attach(sStripAddress);

    const STRIP = await ethers.getContractFactory('StripERC20Token');
    const strip = await STRIP.attach(stripAddress);

    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.attach(stripDistributor);

    const Staking = await ethers.getContractFactory('StripStaking');
    const staking = await Staking.attach(stakingAddress);
    // set distributor contract and warmup contract
    await staking.setContract('0', stripDistributor);
    await staking.setContract('1', stakingwarmupAddress);
    console.log("set distributor contract and warmup contract");

    await mimContract.mint( deployer.address, initialMint );
    console.log("mim minted ", initialMint);

    // queue and toggle MIM and wAvax bond reserve depositor
    await treasury.queue('0', mimBondAddress);
    await treasury.toggle('0', mimBondAddress, zeroAddress);
    console.log("queue and toggle MIM bond reserve depositor");
    
    await sSTRIP.initialize(stakingAddress);
    await sSTRIP.setIndex(initialIndex);
    console.log("Initialize sdfire and set the index");

    // Set treasury for defire token
    await strip.setVault(treasuryAddress);
    console.log("Set treasury for defire token");

    // Add staking contract as distributor recipient
    await distributor.addRecipient(stakingAddress, initialRewardRate);
    console.log("Add staking contract as distributor recipient");
    // queue and toggle reward manager
    await treasury.queue('8', stripDistributor);
    console.log("queue reward manager");
    await treasury.toggle('8', stripDistributor, zeroAddress);
    console.log("toggle reward manager");

    await treasury.queue('0', deployer.address);
    console.log("queue deployer reserve depositor");
    await treasury.toggle('0', deployer.address, zeroAddress);
    console.log("toggle deployer reserve depositor");

    await treasury.queue('4', deployer.address);
    console.log("queue liquidity depositor");
    await treasury.toggle('4', deployer.address, zeroAddress);
    console.log("toggle liquidity depositor");

    await mimContract.approve(treasuryAddress, largeApproval );
    console.log("Approved the treasury to spend MIM");

    await treasury.deposit('9000000000000000000000000', mimAddress, '8910000000000000');
    console.log("treasury deposited mim");

    
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})