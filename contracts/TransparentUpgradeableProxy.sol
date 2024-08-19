// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TransparentUpgradeableProxy {
    address public implementation;
    address private _admin;

    constructor(address _implementation, address _adminAddress) {
        implementation = _implementation;
        _admin = _adminAddress;
    }

    fallback() external payable {
        _delegate(implementation);
    }

    receive() external payable {
        _delegate(implementation);
    }

    function _delegate(address _impl) internal {
        assembly {
            let returndata := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(0, 0, size)
            switch returndata
            case 0 { revert(0, size) }
            default { return(0, size) }
        }
    }

    function upgradeTo(address newImplementation) public {
        require(msg.sender == _admin, "Not authorized");
        implementation = newImplementation;
    }
    
    function admin() public view returns (address) {
        return _admin;
    }
}