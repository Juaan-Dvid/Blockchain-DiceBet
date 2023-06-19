const DiceBet = artifacts.require("Dice")

module.exports = async function (callback) {
    let dice = await DiceBet.deployed()

    // Se envia 1 bnb
    const ethers = 10**18 * 20

    // Direccion del owner
    const owner = '0x8A28d85Af46Da799ED26393e7D5109Db1d5273E1'

    await dice.sendEthers({from: owner, value: ethers})
    console.log('BNB sent successfully')
    callback()
}


