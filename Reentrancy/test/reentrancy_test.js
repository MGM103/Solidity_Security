const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy", function () {
  let etherBankContract, attackerContract;
  let owner, addr1;

  beforeEach(async () => {
    // We get the contractas to deploy
    const etherBankFactory = await hre.ethers.getContractFactory("EtherBank");
    const attackerFactory = await hre.ethers.getContractFactory("Attack");

    etherBankContract = await etherBankFactory.deploy();
    attackerContract = await attackerFactory.deploy(etherBankContract.address);

    await etherBankContract.deployed();
    await attackerContract.deployed();

    [owner, addr1] = await hre.ethers.getSigners();
  });

  it("Allows users to deposit and withdraw their funds", async function () {
    let depositAmount = "10.0";
    let withdraw = "0.0";
    let txData = {
        value: ethers.utils.parseEther("10.0")
    }

    let txn = await etherBankContract.connect(addr1).deposit(txData);
    await txn.wait();

    txn = await etherBankContract.connect(addr1).getBalance();
    txn = ethers.utils.formatEther(txn);
    expect(txn).to.equal(depositAmount);

    txn = await etherBankContract.connect(addr1).withdraw();
    txn = await etherBankContract.connect(addr1).getBalance();
    txn = ethers.utils.formatEther(txn);
    expect(txn).to.equal(withdraw);
  });

  it("Defends users funds from reentrancy", async function () {
    let txData = {
        value: ethers.utils.parseEther("10.0")
    }
    let attackerExpectedVal = "10.0";
    let bankExpectedVal = "10.0"

    let txn = await etherBankContract.connect(addr1).deposit(txData);
    await txn.wait();

    let attack = await attackerContract.connect(owner).attack(txData);
    await attack.wait();

    balAttacker = await attackerContract.getBalance();
    balAttacker = ethers.utils.formatEther(balAttacker);

    balBank = await etherBankContract.getBalance();
    balBank = ethers.utils.formatEther(balBank);

    expect(balBank).to.equal(bankExpectedVal);
    expect(balAttacker).to.equal(attackerExpectedVal);
  });
});
