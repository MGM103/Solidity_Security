// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/*
LotterTKN is a contract where you are awarded Lottery tokens for guessing the right 4 digit combination.
This contract has a couple of vulnerabilities and numerous bad progamming practices.

Firstly, the mint function has no access control mechanism, Ownable is imported by onlyOwner modifier was not
applied to the mint function meaning that anyone can mint lottery tokens at will, when they are only supposed to be
awarded to winners.

Additionally, the incorrect visibility is applied to the _sendWinnings function meaning that anyone can claim the winnings
without actually having to guess the right number.

Finally, the incorrect visibility is applied to the _winningNumber, so that anyone can see what the number to win the lottery is.
The number is also hardcoded when it should use chainlink VRF, but not sure if that is in scope of the tool to pick up.
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotteryTKN is ERC20, ERC20Burnable, Ownable {
    uint256 public _winningNumber = 7429;

    event lotteryWon(uint256 guess);
    event badGuess(uint256 guess);

    constructor() ERC20("Lottery TKN", "LTKN") {}

    function betGuess(uint256 _guess) public {
        // Winner if the last 8 hex characters of the address are 0. 
        require(_guess >= 1000 && _guess <= 9999, "Guess must be between 1000 and 9999");

        if(_guess == _winningNumber){
            _sendWinnings();
            emit lotteryWon(_guess);
        }else{
            emit badGuess(_guess);
        }
     }

     function _sendWinnings() public {
        mint(msg.sender, 10000);
     }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}