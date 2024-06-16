const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { assert } = require('chai')
const { BigNumber } = require('ethers')
const { parseEther } = require('ethers/lib/utils')
const { ethers, network } = require('hardhat')

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5')
    const game = await Game.deploy()

    return { game }
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables)

    const treshold = BigNumber.from(
      '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf',
    )
    let wallet
    while (true) {
      wallet = new ethers.Wallet.createRandom()
      addr = wallet.address
      console.log(addr)
      if (BigNumber.from(addr).lt(treshold)) break
    }

    // good luck
    wallet = wallet.connect(ethers.provider)
    await network.provider.send('hardhat_setBalance', [
      wallet.address,
      parseEther('1').toHexString(),
    ])
    await game.connect(wallet).win()

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game')
  })
})
