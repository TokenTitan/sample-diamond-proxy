// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { LibDiamond } from "../libraries/LibDiamond.sol";

contract ERC20Facet {
    event ERC20Event(address something);

    function init_20() external {
        LibDiamond.AssetStorage storage s = LibDiamond.assetStorage();
        s.totalSupply = 10000000000;
    }

    function totalSupply() external view returns (uint256) {
        LibDiamond.AssetStorage storage s = LibDiamond.assetStorage();
        return s.totalSupply;
    }
}
