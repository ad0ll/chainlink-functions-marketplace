pragma solidity ^0.8.18;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract MockLinkToken is LinkTokenInterface {
    mapping(bytes32 => uint256) allowances;

    function allowance(address owner, address spender) external view returns (uint256 remaining) {
        bytes32 key = keccak256(abi.encodePacked(owner, spender));
        return allowances[key];
    }

    function approve(address spender, uint256 value) external returns (bool success) {
        bytes32 key = keccak256(abi.encodePacked(tx.origin, spender));
        allowances[key] += value;
        return true;
    }

    function balanceOf(address owner) external view returns (uint256 balance) {
        return 10 ** 18 * 1000;
    }

    function decimals() external view returns (uint8 decimalPlaces) {
        return 18;
    }

    function decreaseApproval(address spender, uint256 addedValue) external returns (bool success) {
        return true; //we don't use this
    }

    function increaseApproval(address spender, uint256 subtractedValue) external {
        //we don't use this
    }

    function name() external view returns (string memory tokenName) {
        return "LONK";
    }

    function symbol() external view returns (string memory tokenSymbol) {
        return "LONK";
    }

    function totalSupply() external view returns (uint256 totalTokensIssued) {
        return (10 ** 18) * (10 ** 9);
    }

    function transfer(address to, uint256 value) external returns (bool success) {
        return true;
    }

    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool success) {
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool success) {
        return true;
    }
}
