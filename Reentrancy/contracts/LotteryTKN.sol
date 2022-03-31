// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotteryTKN is ERC20, ERC20Burnable, Ownable {
    uint256 private _winningNumber = 7;

    mapping(address => uint256) balances;

    event lotteryWon(uint256 guess);
    event badGuess(uint256 guess);

    constructor() ERC20("Lottery TKN", "LTKN") {}

    function withdrawWinnings(uint256 _guess) public {
        // Winner if the last 8 hex characters of the address are 0. 
        require(_guess <=100, "Guess must be between 0 and 100");
        require(balances[msg.sender] != 0, "Must deposit eth to play");

        if(_guess == _winningNumber){
            _sendWinnings();
            emit lotteryWon(_guess);
        }else{
            emit badGuess(_guess);
        }
     }

     function _sendWinnings() public {
        mint(msg.sender, 10000e18);
     }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawDeposit(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Must depost eth to withdraw");

        (bool sent,) = msg.sender.call{value: _amount}("");
        require(sent, "Deposit wasn't returned");

        balances[msg.sender] -= _amount;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
