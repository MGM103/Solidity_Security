const { util } = require("chai");
const { utils } = require("ethers");
const hre = require("hardhat");

async function main() {
  // We get the contractas to deploy
  const lotteryFactory = await hre.ethers.getContractFactory("LotteryTKN");
  const attackerFactory = await hre.ethers.getContractFactory("Attacker");

  const lotteryContract = await lotteryFactory.deploy();
  const attackerContract = await attackerFactory.deploy(lotteryContract.address);

  await lotteryContract.deployed();
  await attackerContract.deployed();

  [owner, addr1, addr2] = await hre.ethers.getSigners();

  let txData = {
    value: ethers.utils.parseEther("10.0")
  }

  let bal = await addr2.getBalance();
  await lotteryContract.connect(addr2).deposit(txData);
  bal = await addr2.getBalance();
  console.log(bal);

  let attack = await attackerContract.connect(addr1).attack(txData);
  await attack.wait();
  bal = await addr1.getBalance();
  console.log(bal);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
