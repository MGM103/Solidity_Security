const { util } = require("chai");
const { utils } = require("ethers");
const hre = require("hardhat");

async function main() {
  // We get the contractas to deploy
  const etherBankFactory = await hre.ethers.getContractFactory("EtherBank");
  const attackerFactory = await hre.ethers.getContractFactory("Attack");

  const etherBankContract = await etherBankFactory.deploy();
  const attackerContract = await attackerFactory.deploy(etherBankContract.address);

  await etherBankContract.deployed();
  await attackerContract.deployed();

  [owner, addr1] = await hre.ethers.getSigners();

  let txData = {
    value: ethers.utils.parseEther("10.0")
  }

  let bal = await etherBankContract.getBalance();
  bal = ethers.utils.formatEther(bal);
  console.log(`The amount of eth in store at the beginning: ${bal}`);

  bal = await attackerContract.getBalance();
  bal = ethers.utils.formatEther(bal);
  console.log(`The amount of eth in attacker at the beginning: ${bal}`);

  await etherBankContract.connect(addr1).deposit(txData);
  bal = await etherBankContract.getBalance();
  bal = ethers.utils.formatEther(bal);
  console.log(`The amount of eth in store after deposit: ${bal}`);

  let attack = await attackerContract.connect(owner).attack(txData);
  await attack.wait();

  bal = await attackerContract.getBalance();
  bal = ethers.utils.formatEther(bal);
  console.log(`The amount of eth in attacker at the end: ${bal}`);

  bal = await etherBankContract.getBalance();
  bal = ethers.utils.formatEther(bal);
  console.log(`The amount of eth in store at the end: ${bal}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
