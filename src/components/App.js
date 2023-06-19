import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './Footer';
import BuySellTokens from './BuySellTokens';
import Dice from './Dice';
import SmartContractInfo from './SmartContractInfo';
import Contact from './Contact';
import HowWorks from './HowWorks';




class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div>
                        <Routes>
                            <Route path="/" element={<HowWorks/>} />
                            <Route path="/buy&selltokens" element={<BuySellTokens />} />
                            <Route path="/dice" element={<Dice />} />
                            <Route path="/smartcontractinfo" element={<SmartContractInfo />} />
                            <Route path="/contact" element={<Contact />} />
                            
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }

}

export default App;