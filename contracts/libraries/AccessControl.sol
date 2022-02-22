// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library AccessControl {
    bytes32 constant ACCESS_CONTROL_STORAGE_POSITION = keccak256("diamond.standard.access.control");
    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');

    event RoleGranted(bytes32 role, address account, address user);

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    struct AccessData {
        mapping(bytes32 => RoleData) _roles;
    }

    function accessControlStorage() internal pure returns (AccessData storage data) {
        bytes32 position = ACCESS_CONTROL_STORAGE_POSITION;
        assembly {
            data.slot := position
        }
    }

    function enforceIsAdmin() internal view {
        require(accessControlStorage()._roles[ADMIN_ROLE].members[msg.sender], "Caller should be admin");
    }

    function _grantRole(bytes32 role, address account) internal {
        AccessData storage ds = accessControlStorage();
        if (!hasRole(role, account)) {
            ds._roles[role].members[account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    function hasRole(bytes32 role, address account) internal view returns(bool) {
        AccessData storage ds = accessControlStorage();
        return ds._roles[role].members[account];
    }
}
