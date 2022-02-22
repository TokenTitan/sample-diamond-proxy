// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

library NewStorage {
    struct AssetStorage {
        uint256 totalSupply;
        uint256 decimals;
    }

    function assetStorage() internal pure returns (AssetStorage storage s) {
        bytes32 position = LibDiamond.ASSET_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }
}
