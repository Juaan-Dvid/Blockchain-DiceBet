import React, { Component } from 'react';
import smart_contract from '../abis/Dice.json';
import Web3 from 'web3';
import logo8 from '../logo8.png';
import logo9 from '../logo9.png';
import logo10 from '../logo10.png';

import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
// import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';

class BuySellTokens extends Component {

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
      const _balanceTokensSC = await contract.methods.balanceTokensSC().call()
      this.setState({ balanceTokensSC: _balanceTokensSC })
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
      tokenPrice: '0.003',
      inputNumber: '',
      balanceTokens: '0',
      balanceTokensSC: '0',
      balanceETH: '0'
    }
  }



  _buyTokens = async (_numTokens) => {

    try {
      console.log("Compra de tokens en ejecucion")

      if (this.state.account === "0x0") {
        Swal.fire('Connect your Metamask Wallet to the Binance network!')
        return;
      }

      if (_numTokens === "") {
        Swal.fire('First enter amount')
        return;
      }

      const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
      this.setState({ balanceETH: _balanceEthersSC.toString() })
      // console.log(`balance de ether ${_balanceEthersSC}`)
      const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
      this.setState({ balanceTokensSC: _balanceTokensSC })
      const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
      this.setState({ balanceTokens: _userBalance.toString() })
      //const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
      const _tokenPrice = await this.state.contract.methods.tokenPrice(_numTokens).call()

      if (_balanceEthersSC === "0") {
        Swal.fire('The smart contract does not have enough BNB to reward!')
        return;
      }                

      // const _priceTokenInt = _pricePerOneToken / 10 ** 15
      // const maxBuy = (_balanceEthersSC / (_priceTokenInt * 2))
      // const numInt = Math.floor(maxBuy)

            
      // if (parseInt(_balanceEthersSC) < (parseInt(_tokenPrice) / 10 ** 15) * 2) {
      //   Swal.fire(`Maximum tokens available to Buy: ${numInt} JDM`)
      //   return;
      // }

      if (parseInt(_numTokens) > parseInt(_balanceTokensSC)) {
        Swal.fire(`Maximum tokens available to buy: ${_balanceTokensSC} JDM `)        
        return;
      }
      

      if (parseInt(_numTokens) === 0) {
        Swal.fire('You can not buy 0 tokens')
        return;
      }     

      const calculo = parseInt(_tokenPrice) / 10 ** 18
      const toString = calculo.toString()
      const web3 = window.web3
      const ethers = web3.utils.toWei(toString, 'ether')
      await this.state.contract.methods.buyTokens(_numTokens).send({
        from: this.state.account,
        value: ethers
      })    
      const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
      this.setState({ balanceTokens: _userEndBalance.toString() })

      Swal.fire({
        icon: 'success',
        title: 'The purchase was successfull!',
        width: 800,
        padding: '3em',
        text: `You bought ${_numTokens} JDM tokens. You payed ${calculo} BNB`,
        backdrop: `
        rgba(15, 238, 168, 0.2)
        left top
        no-repeat
        `
      })

    } catch (err) {
      this.setState({ errorMessage: err })
    } finally {
      this.setState({ loading: false })
    }
  }

  _sellTokens = async (_numTokens) => {    

    try {      
      console.log("venta de tokens en ejecucion")

      if (this.state.account === "0x0") {
        Swal.fire('Connect your Metamask Wallet to the Binance network!')
        return;
      }
      if (_numTokens === "") {
        Swal.fire('First enter amount')
        return;
      }
      if (parseInt(_numTokens) === 0) {
        Swal.fire(`You can not sell 0 tokens`)
        return;
      }

      const _userBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
      this.setState({ balanceTokens: _userBalance.toString() })
      const _tokenPrice = await this.state.contract.methods.tokenPrice(_numTokens).call()
      const _pricePerOneToken = await this.state.contract.methods.tokenPrice(1).call()
      const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
      this.setState({ balanceETH: _balanceEthersSC.toString() })
  
  
      if (parseInt(_userBalance) < parseInt(_numTokens)) {
        Swal.fire(`You do not have enough tokens. Your balance is ${_userBalance} JDM`)
        return;
      }
      console.log(`_tokenPrice: ${_balanceEthersSC}`)
      console.log(`_pricePerOneToken: ${_pricePerOneToken / 10**15}`)

      const _priceTokenInt = _pricePerOneToken / 10 ** 15
      const maxSell = (_balanceEthersSC / _priceTokenInt)
      const numInt = Math.floor(maxSell)

      if (parseInt(_tokenPrice) / 10**15 > parseInt(_balanceEthersSC) ) {
        Swal.fire(`The smart contract does not have enough BNB to send you, 
        try it later. At the moment you can withdraw ${numInt} JDM tokens`)
        return;
      }

      // const web3 = window.web3
      // const ethers = web3.utils.toWei(_numTokens, 'ether')
      await this.state.contract.methods.sellTokens(_numTokens).send({
        from: this.state.account,
      })
      const _userEndBalance = await this.state.contract.methods.balanceTokens(this.state.account).call()
      this.setState({ balanceTokens: _userEndBalance.toString() })
      
      Swal.fire({
        icon: 'success',
        title: 'You have sold tokens successfull!',
        width: 800,
        padding: '3em',
        text: `You sold ${_numTokens} tokens. You received ${_tokenPrice / 10 ** 18} BNB in your Metamask Wallet`,
        backdrop: `
        rgba(15, 238, 168, 0.2)
        left top
        no-repeat
        `
      })

    } catch (err) {
      this.setState({ errorMessage: err })
    } finally {
      this.setState({ loading: false })
    }
  }

  // _sendEthers = async (_amount) => {
  //   try {
  //     console.log("Envio de ethers en ejecucion")
  //     const web3 = window.web3
  //     const ethers = web3.utils.toWei(_amount, 'ether')
  //     await this.state.contract.methods.sendEthers(_amount).send({
  //       from: this.state.account,
  //       value: ethers
  //     })

  //     Swal.fire({
  //       icon: 'success',
  //       title: 'You sent BNB to smart contract successfull!',
  //       width: 800,
  //       padding: '3em',
  //       text: `You sent ${_amount} BNB to smart contract.`,
  //       backdrop: `
  //       rgba(15, 238, 168, 0.2)
  //       left top
  //       no-repeat
  //       `
  //     })

  //   } catch (err) {
  //     this.setState({ errorMessage: err })
  //   } finally {
  //     this.setState({ loading: false })
  //   }
  // }

  // _withdraw = async (_amount) => {
  //   try {
  //     console.log("Envio de ethers en ejecucion")


  //     await this.state.contract.methods.withdraw(_amount).send({
  //       from: this.state.account,

  //     })

  //     Swal.fire({
  //       icon: 'success',
  //       title: 'You Withdraw BNB to smart contract successfull!',
  //       width: 800,
  //       padding: '3em',
  //       text: `You withdraw ${_amount} BNB to metamask.`,
  //       backdrop: `
  //       rgba(15, 238, 168, 0.2)
  //       left top
  //       no-repeat
  //       `
  //     })

  //   } catch (err) {
  //     this.setState({ errorMessage: err })
  //   } finally {
  //     this.setState({ loading: false })
  //   }
  // }

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
            <main role="main" className="col-lg-9 d-flex text-center">
              <Container>
                <Row>
                  <Col className="justify-content-end">
                  </Col>
                  <div className="content mr-auto ml-auto w-50">
                    <Col>
                      <h4 className="text-left">
                        <p>My balance: {content} JDM</p>
                      </h4>
                      <div className='card mb-4' style={{ padding: '10px' }}>
                        <h1><img src={logo8} alt="Imagen" width="70%" height="70%" /></h1>
                        <h1>&nbsp;</h1>
                        <Container >
                          <Row>
                            <Col >
                              <h6 className='text-left'>AMOUNT</h6>

                              <h4 className='card mb-4'>
                                <div style={{ position: 'relative', marginLeft: ' 70px', textAlign: 'right' }}>
                                  <input
                                    type="text"
                                    pattern="\d*"
                                    maxLength="5"
                                    onKeyPress={(e) => {
                                      const pattern = /[0-9]/;
                                      if (!pattern.test(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '').substr(0, 5);
                                      this.setState({ inputNumber: value });
                                    }}
                                    style={{ textAlign: 'center', border: 'none', outline: 'none', backgroundColor: 'transparent' }}
                                    placeholder='1'
                                  />
                                  <span style={{ marginLeft: '5px', position: 'absolute', right: '40px' }}>JDM</span>
                                </div>
                              </h4>
                              <h6 className='text-left'>PRICE</h6>
                              <h4 className='text-right'><h4 className='card mb-4'>{this.state.tokenPrice} &nbsp;&nbsp;&nbsp;&nbsp; BNB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4></h4>
                              <h6 className='text-left'>TOTAL</h6>
                              <h4 className='text-right'>
                                <h4 className='card mb-4'>
                                  {Number((this.state.inputNumber * this.state.tokenPrice).toFixed(5)).toString().slice(0, 5)} &nbsp;&nbsp;&nbsp;&nbsp; BNB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </h4>
                              </h4>
                            </Col>
                          </Row>
                        </Container>
                        <Container>
                          <Row>
                            <Col>
                              <img src={logo9} onClick={() => this._buyTokens(this.state.inputNumber)} alt="Imagen" width="100%" height="100%" />
                            </Col>
                            <Col>
                              <img src={logo10} onClick={() => this._sellTokens(this.state.inputNumber)} alt="Imagen" width="100%" height="100%" />
                            </Col>
                          </Row>
                        </Container>
                      </div>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      {/* <form onSubmit={(event) => {
                        event.preventDefault()
                        const _amount = this._numTokens2.value
                        this._sendEthers(_amount)
                      }} >

                        <input type="number"
                          className='form-control mb-1'
                          placeholder='Amount of ethers to send to'
                          ref={(input) => this._numTokens2 = input} />

                        <input type="submit"
                          className='bbtn btn-block btn-success btn-sm'
                          value="SEND ETHERS" />
                      </form> */}
                      <Col><h1>&nbsp;</h1></Col>
                    </Col>
                    <Col></Col>
                  </div>
                </Row>
              </Container>
              <Col><h1>&nbsp;</h1></Col>
              <Col><h1>&nbsp;</h1></Col>
              <Col>&nbsp;</Col>
              {/* <form onSubmit={(event) => {
                event.preventDefault()
                const _amount = this._numTok.value
                this._withdraw(_amount)
              }} >

                <input type="number"
                  className='form-control mb-1'
                  placeholder='Amount of ethers to send to'
                  ref={(input) => this._numTok = input} />

                <input type="submit"
                  className='bbtn btn-block btn-success btn-sm'
                  value="WITHDRAW ETHERS" />
              </form> */}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default BuySellTokens;
