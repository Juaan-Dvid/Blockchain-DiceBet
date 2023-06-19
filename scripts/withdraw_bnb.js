const DiceBet = artifacts.require("Dice")

module.exports = async function (callback) {
    let dice = await DiceBet.deployed() 
    
    // BNB a retirar
    await dice.withdraw(20)

    console.log('Withdraw successfully')
    callback()
}
