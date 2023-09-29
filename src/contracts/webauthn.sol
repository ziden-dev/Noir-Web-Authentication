// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.9;

contract WebAuthn {
      struct Transaction {
        address to;
        uint value;
        bytes data;
    }

    uint256 root;

    Transaction data;
    function update(uint256 oldRoot, uint256 newRoot) public {
        require(oldRoot == root);
        root = newRoot;
    } 
    function register(uint256 oldRoot, uint256 newRoot) public {
       require(oldRoot == root);
        root = newRoot;
    }

    function makeTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) public {
        data = Transaction({to: _to, value: _value, data: _data});
        (bool success, ) = data.to.call{value: data.value}(data.data);
        require(success, "tx failed");  
    }
}
