// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SwisstonikUpgradeableV2 {
    string private message;
    uint256 private messageCount;

    function initialize(string memory _message) public {
        message = _message;
        messageCount = 0;
    }

    function setMessage(string memory _message) public {
        message = _message;
        messageCount++;
    }

    function getMessage() public view returns(string memory) {
        return message;
    }

    function getMessageCount() public view returns(uint256) {
        return messageCount;
    }

    function getMessageWithCount() public view returns(string memory, uint256) {
        return (message, messageCount);
    }
}