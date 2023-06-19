import React, { Component } from 'react';
import smart_contract from '../abis/Dice.json';
import Web3 from 'web3';
import logo1 from '../logo1.png';
import logo2 from '../logo2.png';
import logo3 from '../logo3.png';
import logo4 from '../logo4.png';
import logo5 from '../logo5.png';
import logo6 from '../logo6.png';
import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import Navigation from './Navbar';
// import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';
// import BuySellTokens from './BuySellTokens';

class Dice extends Component {

    async componentDidMount() {
        // 1. Carga de Web3
        await this.loadWeb3()
        // 2. Carga de datos de la Blockchain
        await this.loadBlockchainData()
    }

    // 1. Carga de Web3
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts: ', accounts)
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('¡Deberías considerar usar Metamask!')
        }
    }

    // 2. Carga de datos de la Blockchain
    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
        const networkId = await web3.eth.net.getId()
        console.log('networkid:', networkId)
        const networkData = smart_contract.networks[networkId]
        console.log('NetworkData:', networkData)

        if (networkData) {
            const abi = smart_contract.abi
            console.log('abi', abi)
            const address = networkData.address
            console.log('address:', address)
            const contract = new web3.eth.Contract(abi, address)
            this.setState({ contract })
            let balanceTokens = await contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: balanceTokens.toString() })
            const _balanceEthersSC = await contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
        } else {
            window.alert('Connect your Metamask Wallet to the Binance network!')
            this.setState({ account: '0x0' })
        }
    }


    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            loading: false,
            contract: null,
            errorMessage: "",
            inputText: '',
            balanceTokens: '0',
            balanceETH: '0',
            balanceTokensSC: '0'
        }
    }


    _bet1 = async (_amountBet) => {

        try {
            console.log("Apuesta al numero 1 en ejecucion")

            if (this.state.account === "0x0") {
                Swal.fire('Connect your Metamask Wallet to the Binance network!')
                return;
            }

            if (_amountBet === "") {
                Swal.fire('First enter amount to bet ')
                return;
            }

            if (parseInt(_amountBet) === 0) {
                Swal.fire('You can not bet 0 tokens')
                return;
              }

            const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userBalance.toString() })
            const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
            const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
            //const _tokenPrice = await this.state.contract.methods.tokenPrice(_amountBet).call()

            // const _priceTokenInt = _pricePerOneToken / 10 ** 15
            // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
            // const numInt = Math.floor(maxBuy)

            if (parseInt(_userBalance) < parseInt(_amountBet)) {
                Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
                return;
            }

            // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
            //     Swal.fire(`Maximum tokens to Bet: ${numInt} `)
            //     return;
            // }

            const _Bet = _balanceTokensSC / 2
            const maxBet = Math.floor(_Bet)

            if (parseInt(_balanceTokensSC) < parseInt(_amountBet * 2)) {
                Swal.fire(`The smart contract does not have enough tokens to reward. Maximum bet: ${maxBet} JDM `)
                return;
            }

            // const web3 = window.web3
            // const ethers = web3.utils.toWei(_numTokens, 'ether')
            await this.state.contract.methods.bet1(_amountBet).send({
                from: this.state.account,
            })
            const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userEndBalance.toString() })

            const _randomNumber = await this.state.contract.methods.idPersona_randomNumber(this.state.account).call()
            const _selectedNumber = await this.state.contract.methods.id_userNumber(this.state.account).call()

            if (_randomNumber === _selectedNumber) {

                Swal.fire({
                    icon: 'success',
                    title: 'YOU WIN!',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'YOU LOSE',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            }

        } catch (err) {
            this.setState({ errorMessage: err })
        } finally {
            this.setState({ loading: false })
        }
    }

    _bet2 = async (_amountBet) => {

        try {
            console.log("Apuesta al numero 2 en ejecucion")

            if (this.state.account === "0x0") {
                Swal.fire('Connect your Metamask Wallet to the Binance network!')
                return;
            }

            if (_amountBet === "") {
                Swal.fire('First enter amount to bet ')
                return;
            }

            if (parseInt(_amountBet) === 0) {
                Swal.fire('You can not bet 0 tokens')
                return;
              }

            const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userBalance.toString() })
            const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
            const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
            //const _tokenPrice = await this.state.contract.methods.tokenPrice(_amountBet).call()

            // const _priceTokenInt = _pricePerOneToken / 10 ** 15
            // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
            // const numInt = Math.floor(maxBuy)

            if (parseInt(_userBalance) < parseInt(_amountBet)) {
                Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
                return;
            }

            // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
            //     Swal.fire(`Maximum tokens to Bet: ${numInt} `)
            //     return;
            // }

            const _Bet = _balanceTokensSC / 2
            const maxBet = Math.floor(_Bet)

            if (parseInt(_balanceTokensSC) < parseInt(_amountBet * 2)) {
                Swal.fire(`The smart contract does not have enough tokens to reward. Maximum bet: ${maxBet} JDM `)
                return;
            }

            // const web3 = window.web3
            // const ethers = web3.utils.toWei(_numTokens, 'ether')
            await this.state.contract.methods.bet2(_amountBet).send({
                from: this.state.account,
            })
            const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userEndBalance.toString() })

            const _randomNumber = await this.state.contract.methods.idPersona_randomNumber(this.state.account).call()
            const _selectedNumber = await this.state.contract.methods.id_userNumber(this.state.account).call()

            if (_randomNumber === _selectedNumber) {

                Swal.fire({
                    icon: 'success',
                    title: 'YOU WIN!',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'YOU LOSE',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            }

        } catch (err) {
            this.setState({ errorMessage: err })
        } finally {
            this.setState({ loading: false })
        }
    }

    _bet3 = async (_amountBet) => {

        try {
            console.log("Apuesta al numero 3 en ejecucion")

            if (this.state.account === "0x0") {
                Swal.fire('Connect your Metamask Wallet to the Binance network!')
                return;
            }

            if (_amountBet === "") {
                Swal.fire('First enter amount to bet ')
                return;
            }

            if (parseInt(_amountBet) === 0) {
                Swal.fire('You can not bet 0 tokens')
                return;
              }

            const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userBalance.toString() })
            const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
            const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
            //const _tokenPrice = await this.state.contract.methods.tokenPrice(_amountBet).call()

            // const _priceTokenInt = _pricePerOneToken / 10 ** 15
            // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
            // const numInt = Math.floor(maxBuy)

            if (parseInt(_userBalance) < parseInt(_amountBet)) {
                Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
                return;
            }

            // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
            //     Swal.fire(`Maximum tokens to Bet: ${numInt} `)
            //     return;
            // }

            const _Bet = _balanceTokensSC / 2
            const maxBet = Math.floor(_Bet)

            if (parseInt(_balanceTokensSC) < parseInt(_amountBet * 2)) {
                Swal.fire(`The smart contract does not have enough tokens to reward. Maximum bet: ${maxBet} JDM `)
                return;
            }

            // const web3 = window.web3
            // const ethers = web3.utils.toWei(_numTokens, 'ether')
            await this.state.contract.methods.bet3(_amountBet).send({
                from: this.state.account,
            })
            const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userEndBalance.toString() })

            const _randomNumber = await this.state.contract.methods.idPersona_randomNumber(this.state.account).call()
            const _selectedNumber = await this.state.contract.methods.id_userNumber(this.state.account).call()

            if (_randomNumber === _selectedNumber) {

                Swal.fire({
                    icon: 'success',
                    title: 'YOU WIN!',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'YOU LOSE',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            }

        } catch (err) {
            this.setState({ errorMessage: err })
        } finally {
            this.setState({ loading: false })
        }
    }

    _bet4 = async (_amountBet) => {

        try {
            console.log("Apuesta al numero 4 en ejecucion")

            if (this.state.account === "0x0") {
                Swal.fire('Connect your Metamask Wallet to the Binance network!')
                return;
            }

            if (_amountBet === "") {
                Swal.fire('First enter amount to bet ')
                return;
            }

            if (parseInt(_amountBet) === 0) {
                Swal.fire('You can not bet 0 tokens')
                return;
              }

            const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userBalance.toString() })
            const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
            const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
            //const _tokenPrice = await this.state.contract.methods.tokenPrice(_amountBet).call()

            // const _priceTokenInt = _pricePerOneToken / 10 ** 15
            // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
            // const numInt = Math.floor(maxBuy)

            if (parseInt(_userBalance) < parseInt(_amountBet)) {
                Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
                return;
            }

            // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
            //     Swal.fire(`Maximum tokens to Bet: ${numInt} `)
            //     return;
            // }

            const _Bet = _balanceTokensSC / 2
            const maxBet = Math.floor(_Bet)

            if (parseInt(_balanceTokensSC) < parseInt(_amountBet * 2)) {
                Swal.fire(`The smart contract does not have enough tokens to reward. Maximum bet: ${maxBet} JDM `)
                return;
            }

            // const web3 = window.web3
            // const ethers = web3.utils.toWei(_numTokens, 'ether')
            await this.state.contract.methods.bet4(_amountBet).send({
                from: this.state.account,
            })
            const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userEndBalance.toString() })

            const _randomNumber = await this.state.contract.methods.idPersona_randomNumber(this.state.account).call()
            const _selectedNumber = await this.state.contract.methods.id_userNumber(this.state.account).call()

            if (_randomNumber === _selectedNumber) {

                Swal.fire({
                    icon: 'success',
                    title: 'YOU WIN!',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'YOU LOSE',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            }

        } catch (err) {
            this.setState({ errorMessage: err })
        } finally {
            this.setState({ loading: false })
        }
    }

    _bet5 = async (_amountBet) => {

        try {
            console.log("Apuesta al numero 5 en ejecucion")

            if (this.state.account === "0x0") {
                Swal.fire('Connect your Metamask Wallet to the Binance network!')
                return;
            }

            if (_amountBet === "") {
                Swal.fire('First enter amount to bet ')
                return;
            }

            if (parseInt(_amountBet) === 0) {
                Swal.fire('You can not bet 0 tokens')
                return;
              }

            const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userBalance.toString() })
            const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
            const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
            //const _tokenPrice = await this.state.contract.methods.tokenPrice(_amountBet).call()

            // const _priceTokenInt = _pricePerOneToken / 10 ** 15
            // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
            // const numInt = Math.floor(maxBuy)

            if (parseInt(_userBalance) < parseInt(_amountBet)) {
                Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
                return;
            }

            // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
            //     Swal.fire(`Maximum tokens to Bet: ${numInt} `)
            //     return;
            // }

            const _Bet = _balanceTokensSC / 2
            const maxBet = Math.floor(_Bet)

            if (parseInt(_balanceTokensSC) < parseInt(_amountBet * 2)) {
                Swal.fire(`The smart contract does not have enough tokens to reward. Maximum bet: ${maxBet} JDM `)
                return;
            }

            // const web3 = window.web3
            // const ethers = web3.utils.toWei(_numTokens, 'ether')
            await this.state.contract.methods.bet5(_amountBet).send({
                from: this.state.account,
            })
            const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userEndBalance.toString() })

            const _randomNumber = await this.state.contract.methods.idPersona_randomNumber(this.state.account).call()
            const _selectedNumber = await this.state.contract.methods.id_userNumber(this.state.account).call()

            if (_randomNumber === _selectedNumber) {

                Swal.fire({
                    icon: 'success',
                    title: 'YOU WIN!',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'YOU LOSE',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            }

        } catch (err) {
            this.setState({ errorMessage: err })
        } finally {
            this.setState({ loading: false })
        }
    }

    _bet6 = async (_amountBet) => {

        try {
            console.log("Apuesta al numero 6 en ejecucion")

            if (this.state.account === "0x0") {
                Swal.fire('Connect your Metamask Wallet to the Binance network!')
                return;
            }

            if (_amountBet === "") {
                Swal.fire('First enter amount to bet ')
                return;
            }

            if (parseInt(_amountBet) === 0) {
                Swal.fire('You can not bet 0 tokens')
                return;
              }

            const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userBalance.toString() })
            const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
            const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
            //const _tokenPrice = await this.state.contract.methods.tokenPrice(_amountBet).call()

            // const _priceTokenInt = _pricePerOneToken / 10 ** 15
            // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
            // const numInt = Math.floor(maxBuy)

            if (parseInt(_userBalance) < parseInt(_amountBet)) {
                Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
                return;
            }

            // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
            //     Swal.fire(`Maximum tokens to Bet: ${numInt} `)
            //     return;
            // }

            const _Bet = _balanceTokensSC / 2
            const maxBet = Math.floor(_Bet)

            if (parseInt(_balanceTokensSC) < parseInt(_amountBet * 2)) {
                Swal.fire(`The smart contract does not have enough tokens to reward. Maximum bet: ${maxBet} JDM `)
                return;
            }

            // const web3 = window.web3
            // const ethers = web3.utils.toWei(_numTokens, 'ether')
            await this.state.contract.methods.bet6(_amountBet).send({
                from: this.state.account,
            })
            const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
            this.setState({ balanceTokens: _userEndBalance.toString() })

            const _randomNumber = await this.state.contract.methods.idPersona_randomNumber(this.state.account).call()
            const _selectedNumber = await this.state.contract.methods.id_userNumber(this.state.account).call()

            if (_randomNumber === _selectedNumber) {

                Swal.fire({
                    icon: 'success',
                    title: 'YOU WIN!',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'YOU LOSE',
                    width: 800,
                    padding: '3em',
                    text: `The random number was ${_randomNumber}. You chose number ${_selectedNumber} `,
                    backdrop: `
                    rgba(15, 238, 168, 0.2)
                    left top
                    no-repeat                
                    `
                })

            }

        } catch (err) {
            this.setState({ errorMessage: err })
        } finally {
            this.setState({ loading: false })
        }
    }


    render() {
        let content
        if (this.state.loading) {
            content = <p id="loader" className='text-center'>Loading...</p>
        } else {
            content = this.state.balanceTokens
        }
        return (
            <div>
                <Navigation account={this.state.account} />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <Container>
                                <Row>
                                    <Col>
                                        <h4 className="text-center"><p>My balance: {content} JDM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p></h4>
                                        &nbsp;
                                        <h5 className="text-center"> &nbsp;&nbsp;&nbsp;&nbsp;Bet &nbsp;
                                            <input
                                                type="text"
                                                maxLength="4"
                                                placeholder="Enter amount to bet"
                                                value={this.state.inputText}
                                                onChange={(e) => this.setState({ inputText: e.target.value.replace(/\D/, '') })}
                                                pattern="^[0-9]*$"
                                            />
                                            &nbsp;&nbsp;JDM. You will win {this.state.inputText * 2}  JDM
                                        </h5>
                                        <Row>
                                        </Row>
                                        &nbsp;
                                        <h3>Play now!</h3>
                                        <h3>Which number will be?</h3>
                                        &nbsp;
                                        <Row>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col>
                                                <img src={logo1} onClick={() => this._bet1(this.state.inputText)} alt="Imagen" width="100%" height="100%" />
                                            </Col>
                                            <Col>
                                                <img src={logo2} onClick={() => this._bet2(this.state.inputText)} alt="Imagen" width="100%" height="100%" />
                                            </Col>
                                            <Col>
                                                <img src={logo3} onClick={() => this._bet3(this.state.inputText)} alt="Imagen" width="100%" height="100%" />
                                            </Col>
                                            <Col></Col>
                                            <Col></Col>
                                        </Row>
                                        &nbsp;
                                        <Row>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col>
                                                <img src={logo4} onClick={() => this._bet4(this.state.inputText)} alt="Imagen" width="100%" height="100%" />
                                            </Col>
                                            <Col>
                                                <img src={logo5} onClick={() => this._bet5(this.state.inputText)} alt="Imagen" width="100%" height="100%" />
                                            </Col>
                                            <Col>
                                                <img src={logo6} onClick={() => this._bet6(this.state.inputText)} alt="Imagen" width="100%" height="100%" />
                                            </Col>
                                            <Col></Col>
                                            <Col></Col>
                                        </Row>
                                        &nbsp;
                                        <Row>
                                            <Col>
                                                <h3>Play the Dice and double your JDM tokens!</h3>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        </main>
                    </div>
                </div >
            </div >
        );
    }
}

export default Dice;
