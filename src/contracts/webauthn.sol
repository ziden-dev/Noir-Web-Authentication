// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.9;

contract WebAuthn {

    uint256 root;

    function update(uint256 oldRoot, uint256 newRoot) public {
        require(oldRoot == root);
        root = newRoot;
    } 

    function register(uint256 oldRoot, uint256 newRoot) public {
       require(oldRoot == root);
        root = newRoot;
    }

}
