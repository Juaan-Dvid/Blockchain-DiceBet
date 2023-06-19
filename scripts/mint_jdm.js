const DiceBet = artifacts.require("Dice")

module.exports = async function (callback) {
    let dice = await DiceBet.deployed()

    // Numero tokens a crear
    const num = 100

    await dice.mint(num)
    console.log('mint new JMD successfully')
    callback()
}