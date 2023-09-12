// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.9;

contract WebAuthn {
    mapping(string => string) public publicKeys;
    mapping(string => uint256) public countLogin;

    function register(string memory id, string memory pubKey) public {
        require( bytes(publicKeys[id]).length == 0 , "Id already exists"); 
        publicKeys[id] = pubKey;
    }

    function authentication( string memory id) public {
        
        // trans these to buffer

        // trans buffer to base64url

        //Hash it + authenticationData on chain = ABC

        // use ABC check with signature and publicKey
        countLogin[id]  = countLogin[id] + 1;

    }
}