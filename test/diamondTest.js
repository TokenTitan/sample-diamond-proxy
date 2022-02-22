/* global describe it before ethers */

const {
  getSelectors,
} = require('../scripts/libraries/diamond.js')

const { deployDiamond } = require('../scripts/deploy.js')
const { upgradeFacet } = require('../scripts/upgrade.js')

const { assert } = require('chai')

describe('DiamondTest', async function () {
  let diamondAddress
  let diamondCutFacet
  let diamondLoupeFacet
  let result
  const addresses = []

  before(async function () {
    diamondAddress = await deployDiamond()
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress)
    erc20Facet = await ethers.getContractAt('ERC20Facet', diamondAddress)
    erc721Facet = await ethers.getContractAt('ERC721Facet', diamondAddress)
  })

  it('should have three facets -- call to facetAddresses function', async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address)
    }

    assert.equal(addresses.length, 4)
  })

  it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
    let selectors = getSelectors(diamondCutFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(diamondLoupeFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(erc20Facet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(erc721Facet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[3])
    assert.sameMembers(result, selectors)
  })

  it('selectors should be associated to facets correctly -- multiple calls to facetAddress function', async () => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress('0x1f931c1c')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0xcdffacc6')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0x01ffc9a7')
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress('0x20535dd9')
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress('0x18160ddd')
    )
    assert.equal(
      addresses[3],
      await diamondLoupeFacet.facetAddress('0x0b447da6')
    )
    assert.equal(
      addresses[3],
      await diamondLoupeFacet.facetAddress('0x8b3b3a12')
    )
  })

  it('should test function call on erc20', async () => {
    let erc20Facet = await ethers.getContractAt('ERC20Facet', diamondAddress)
    assert.equal(await erc20Facet.totalSupply(), 0)
    await erc20Facet.init_20()
    assert.equal(await erc20Facet.totalSupply(), 10000000000)
  })

  it('should test function call on erc721', async () => {
    let erc721Facet = await ethers.getContractAt('ERC721Facet', diamondAddress)
    assert.equal(await erc721Facet.totalSupply721(), 0)
    await erc721Facet.init_721()
    assert.equal(await erc721Facet.totalSupply721(), 20000000000)
  })

  it('should test function call on erc20 facet from erc721', async () => {
    let erc721Facet = await ethers.getContractAt('ERC721Facet', diamondAddress)
    assert.equal(await erc721Facet.methodCallOnOtherFacet(), 10000000000) // erc20 total supply
  })

  describe('upgrade erc20 facet', async function () {
    before(async function () {
      await upgradeFacet(diamondAddress);
    })

    it('should be execute the upgraded logic', async () => {
      let erc20FacetV2 = await ethers.getContractAt('ERC20FacetV2', diamondAddress)
      assert.equal(await erc20FacetV2.totalSupply(), "totalSupply was upgraded")
    })

    it('should be execute the added function', async () => {
      let erc20FacetV2 = await ethers.getContractAt('ERC20FacetV2', diamondAddress)
      assert.equal(await erc20FacetV2.previousTotalSupply(), 10000000000)
    })

    it('should fetch the newly added variable', async () => {
      let erc20FacetV2 = await ethers.getContractAt('ERC20FacetV2', diamondAddress)
      assert.equal(await erc20FacetV2.decimals(), 10000000000)
    })
  })
})
