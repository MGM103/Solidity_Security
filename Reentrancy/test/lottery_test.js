const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LotteryTkn", function () {
  let lotteryContract;
  let owner, addr1;

  beforeEach(async () => {
    const lotteryFactory = await ethers.getContractFactory("LotteryTKN");
    lotteryContract = await lotteryFactory.deploy();
    await lotteryContract.deployed();

    [owner, addr1] = await ethers.getSigners();
  })

  it("Should emit an event for an incorrect guess", async function () {
    let guess = 7248;
    let txn = await lotteryContract.betGuess(guess);
    await txn.wait();

    expect(txn).to.emit(lotteryContract, "badGuess");
  });

  it("Should emit an event for a correct guess and pay the player", async function () {
    let guess = 7429;
    let winningAmount = 10000;
    let txn = await lotteryContract.betGuess(guess);
    await txn.wait();

    txn = await lotteryContract.balanceOf(owner.address);

    expect(txn).to.equal(winningAmount);
    expect(txn).to.emit(lotteryContract, "lotteryWon");
  });

  it("Only owner can mint tokens", async function () {
    let mintNum = 10000;
    let expctTkns = 0;
    let txn = await lotteryContract.connect(addr1).mint(addr1.address, mintNum);
    await txn.wait();

    txn = await lotteryContract.balanceOf(addr1.address);

    expect(txn).to.equal(expctTkns);
  });

  it("Only allows winners to receive winnings", async function () {
    let expctTkns = 0;
    let txn = await lotteryContract.connect(addr1)._sendWinnings();
    await txn.wait();

    txn = await lotteryContract.balanceOf(addr1.address);

    expect(txn).to.equal(expctTkns);
  });
});
