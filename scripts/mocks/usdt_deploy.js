const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Initial mint for USDT
    const initialMint = '100000000000';

 
    // Deploy MIM
    const USDT = await ethers.getContractFactory('AnyswapV5ERC20');
    const usdt = await USDT.deploy("Tether USD", "USDT", 6, zeroAddress, deployer.address);
    console.log("mim deployed on ", usdt.address);

    // Deploy 10,000,000 mock MIM and mock wAvax
    await usdt.initVault(deployer.address);
    await usdt.mint( deployer.address, initialMint );
    console.log("USDT minted ", initialMint);

    console.log( "USDT: " + usdt.address );

  
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})