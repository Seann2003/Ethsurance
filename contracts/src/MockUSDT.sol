// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "tUSDT") {
        // Mint an initial supply
        _mint(msg.sender, 1000000 * 100 ** decimals());
    }

    // Mint more tokens as needed
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
