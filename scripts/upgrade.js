/* global ethers */
/* eslint prefer-const: "off" */

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')
const hre = require("hardhat");

async function upgradeFacet (diamondAddress) {
  const accounts = await hre.ethers.getSigners()
  const contractOwner = accounts[0]

  const diamondContract = await hre.ethers.getContractFactory('Diamond')
  const diamond = await diamondContract.attach(diamondAddress)

  // deploy facets
  console.log('Deploying ERC20FacetV2')
  const Facet = await ethers.getContractFactory("ERC20FacetV2")
  const facet = await Facet.deploy()
  await facet.deployed()

  console.log(`ERC20FacetV2 deployed: ${facet.address}`)

  let selectors = getSelectors(facet);
  const cut = []

  // add new methods
  let selector = [selectors[0]]
  selector.contract = selectors.contract
  selector.remove = selectors.remove
  selector.get = selectors.get
  cut.push({
    facetAddress: facet.address,
    action: FacetCutAction.Add,
    functionSelectors: selector
  })

  selector = [selectors[1]]
  selector.contract = selectors.contract
  selector.remove = selectors.remove
  selector.get = selectors.get
  cut.push({
    facetAddress: facet.address,
    action: FacetCutAction.Add,
    functionSelectors: selector
  })

  selector = [selectors[2]]
  selector.contract = selectors.contract
  selector.remove = selectors.remove
  selector.get = selectors.get
  cut.push({
    facetAddress: facet.address,
    action: FacetCutAction.Add,
    functionSelectors: selector
  })

  // replace implementation of total supply
  selector = [selectors[3]]
  selector.contract = selectors.contract
  selector.remove = selectors.remove
  selector.get = selectors.get
  cut.push({
    facetAddress: facet.address,
    action: FacetCutAction.Replace,
    functionSelectors: selector
  })
  

  // upgrade diamond with facets
  console.log('Diamond Cut:', cut)
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address)
  let tx
  let receipt
  // call to init function
  let functionCall = facet.interface.encodeFunctionData('init_20_v2')
  tx = await diamondCut.diamondCut(cut, diamondAddress, functionCall)
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
  return diamond.address
}

if (require.main === module) {
  upgradeFacet()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.upgradeFacet = upgradeFacet
