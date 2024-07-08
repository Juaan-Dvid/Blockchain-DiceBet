import React, { Component } from 'react';
import smart_contract from '../abis/Dice.json';
import Web3 from 'web3';
import logo7 from '../logo7.png';
// import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
// import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';

class Contact extends Component {

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
            errorMessage: ""

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
                                <Col>
                                    <img src={logo7} alt="Imagen" width="50%" height="50%" />
                                </Col>
                                &nbsp;
                                <h3>Juan David Marín Sánchez</h3>
                                <h6 >Blockchain Developer</h6>
                                &nbsp; &nbsp;
                                <h4> &nbsp;</h4>
                                {/* <Container className="text-center">
                                    <Row >
                                        <Col></Col>
                                        <Col className="col-lg-9 text-left">
                                            <h5>&nbsp;</h5>
                                            <h5>DiceBet is a DApp created by the author</h5>
                                            <h5>Do you need a development based on blockchain? contact me on
                                                <a href='https://linkedin.com/in/juan-david-marin-sanchez-102a92b9' className='text-right'>
                                                    &nbsp;LinkedIn
                                                </a>
                                            </h5>
                                            <h5>Email: jdmarin123@hotmail.com</h5>
                                        </Col>
                                    </Row>
                                </Container> */}

                                <Container className="text-center">
                                    <Row>
                                        <Col>
                                            <h5>DiceBet is a DApp created by the author</h5>
                                            <h5>Do you need a development based on blockchain? contact me on&nbsp;
                                                <a href='https://linkedin.com/in/juan-david-marin-sanchez-102a92b9'>LinkedIn</a>
                                            </h5>
                                            <h5>Email: juandavidmarin567@gmail.com</h5>
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

export default Contact;
