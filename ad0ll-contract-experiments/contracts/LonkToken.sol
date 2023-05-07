// SPDX-License-Identifier: GPL-3.0
// pragma solidity ^0.4.0;
pragma solidity ^0.8.0;

// import "@chainlink/contracts/src/v0.4/LinkToken.sol";

// pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract LonkToken is ERC777 {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() ERC777("LonkToken", "LONK", new address[](0)) {
        console.log("token owner/minter: %s , token address: , block timestamp: %o", msg.sender, block.timestamp);
        _mint(msg.sender, 100000 * 10 ** 18, "", "");
    }
}
