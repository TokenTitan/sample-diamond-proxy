// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { NewStorage } from "../libraries/NewStorage.sol";
import { AccessControl } from 'contracts/libraries/AccessControl.sol';

contract ERC20FacetV2 {
    event ERC20Event(address something);

    function init_20_v2() external {
        NewStorage.AssetStorage storage s = NewStorage.assetStorage();
        s.decimals = 10000000000;
       AccessControl._grantRole(AccessControl.ADMIN_ROLE, msg.sender);
    }

    // upgrading existing logic
    function totalSupply() external pure returns (string memory) {
        return "totalSupply was upgraded";
    }

    // New method added to the facet;
    function previousTotalSupply() external view returns (uint256) {
        AccessControl.enforceIsAdmin();
        NewStorage.AssetStorage storage s = NewStorage.assetStorage();
        return s.totalSupply;
    }

    // new variable added to the struct of asset storage
    function decimals() external view returns (uint256) {
        NewStorage.AssetStorage storage s = NewStorage.assetStorage();
        return s.decimals;
    }
}
