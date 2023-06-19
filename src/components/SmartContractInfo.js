import React, { Component } from 'react';
import smart_contract from '../abis/Dice.json';
import Web3 from 'web3';
// import logo from '../logo.png';
// import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
// import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';

class Smart_contract_info extends Component {

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
            this.setState({ contractAddress: address })
            const _ownerAddress = await contract.methods.owner().call()
            this.setState({ ownerAddress: _ownerAddress })
            const _totalSupply = await contract.methods.totalSupply().call()
            this.setState({ totalSupply: _totalSupply })
            const _balanceEthersSC = await contract.methods.balanceEthersSC().call()
            this.setState({ balanceETH: _balanceEthersSC.toString() })
            const _symbol = await contract.methods.symbol().call()
            this.setState({ symbol: _symbol })
            const _balanceTokensSC = await contract.methods.balanceTokensSC().call()
            this.setState({ balanceTokensSC: _balanceTokensSC })
        } else {
            window.alert('Connect your Metamask Wallet to the Binance network!')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            loading: true,
            contract: null,
            errorMessage: "",
            contractAddress: '0x0',
            ownerAddress: '0x0',
            totalSupply: '0',
            balanceETH: '0',
            symbol: '0',
            balanceTokensSC: '0'

        }
    }


    render() {
        return (
            <div>
                <Navigation account={this.state.account} />
                {/* <MyCarousel /> */}
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto w-75">
                                <h2>Smart contract information</h2>
                                <h1>&nbsp;</h1>
                                &nbsp;
                                <Container>
                                    <Row>
                                        <Col lg={10}>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Connected from Metamask address:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                   <h4> {this.state.account}</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Blockchain deployed:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Binance Smart Chain Testnet</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Contract address:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>{this.state.contractAddress}</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Owner address:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>{this.state.ownerAddress}</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Total tokens supply:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>{this.state.totalSupply}</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Tokens available:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>{this.state.balanceTokensSC}</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>BNB available for rewards:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>{this.state.balanceETH / 1000} BNB</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>Symbol token:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>{this.state.symbol}</h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6} className="d-flex text-left">
                                                    <h4>See this smart contract:</h4>
                                                </Col>
                                                <Col lg={6} className="d-flex text-left">
                                                    <a href={`https://testnet.bscscan.com/address/${this.state.contract}`}>
                                                        <h4>https://testnet.BscScan.com</h4>
                                                    </a>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default Smart_contract_info;
