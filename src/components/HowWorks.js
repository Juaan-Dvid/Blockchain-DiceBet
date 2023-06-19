import React, { Component } from 'react';
import smart_contract from '../abis/Dice.json';
import Web3 from 'web3';

// import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
// import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';
import img1 from '../img/1.png';

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
                <img
                            className="d-block w-100"
                            src={img1}
                            alt=''
                        />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto w-75">

                                <h2>DiceBet is a game build on blockchain</h2>
                                &nbsp;
                                <h2>How does it work?</h2>
                                &nbsp;
                                <Container>
                                    <Row>
                                        <h7 className="text-left">1. First connect your Metamask Wallet with this DApp, then you need to get BNB tokens in this free
                                            <a href={`https://testnet.bnbchain.org/faucet-smart`}>&nbsp;link</a> .
                                            Take into account that the Metamask Wallet is a requirement to play Dice.
                                        </h7>
                                    </Row>
                                    &nbsp;
                                    <Row>
                                        <h7 className="text-left">2. Go to the Buy & Sell tokens tab and buy JDM tokens to play
                                        </h7>
                                    </Row>
                                    &nbsp;
                                    <Row>
                                        <h7 className="text-left">3. Then enter the Dice tab and place the JDM amount you want to bet and then select a number from 1 to 6.
                                            The system will then generate a random number from 1 to 6. If the number you chose and the ramdom number selected by system
                                            are the same, you will win double the amount bet.
                                        </h7>
                                    </Row>
                                    &nbsp;
                                    <Row>
                                        <h7 className="text-left">4. All transactions will be registered on the Binance Blockchain Testnet, so each time you do anything like buy, sell or bet tokens,
                                            you must approve that transaction in your Metamask Wallet to continue playing.
                                        </h7>
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