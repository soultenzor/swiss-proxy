// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SwisstonikUpgradeable {
    string private message;

    function initialize(string memory _message) public {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns(string memory) {
        return message;
    }
}