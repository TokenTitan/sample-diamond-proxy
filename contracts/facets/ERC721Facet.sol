// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { LibDiamond } from "../libraries/LibDiamond.sol";
import "contracts/interfaces/IERC20Facet.sol";

contract ERC721Facet {
    event ERC721Event();

    function init_721() external {
        LibDiamond.Asset721Storage storage s = LibDiamond.asset721Storage();
        s.totalSupply = 20000000000;
    }

    function totalSupply721() external view returns (uint256) {
        LibDiamond.Asset721Storage storage s = LibDiamond.asset721Storage();
        return s.totalSupply;
    }

    function methodCallOnOtherFacet() external view returns (uint256 val) {
        val = IERC20Facet(address(this)).totalSupply();
    }
}
