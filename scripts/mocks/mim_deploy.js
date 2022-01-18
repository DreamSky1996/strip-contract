const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);


    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Initial mint for wAvax and MIM (10,000,000)
    const initialMint = '10000000000000000000000000';

 
    // Deploy MIM
    const MIM = await ethers.getContractFactory('AnyswapV5ERC20');
    const mim = await MIM.deploy("Magic Internet Money", "MIM", 18, zeroAddress, deployer.address);
    console.log("mim deployed on ", mim.address);

    // Deploy 10,000,000 mock MIM and mock wAvax
    await mim.initVault(deployer.address);
    await mim.mint( deployer.address, initialMint );
    console.log("mim minted ", initialMint);

    console.log( "MIM: " + mim.address );

  
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})