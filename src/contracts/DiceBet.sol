// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dice is ERC20, Ownable {
    // Constructor
    constructor() ERC20("Dice", "JDM") {
        _mint(address(this), 101);        
    }

    
    // En este campo, el numero entero que se ingrese, será divido entre 1000, generando un numero decimal.
    uint256 private pricePerEachToken = 3 ether;

    mapping(address => uint256) public id_userNumber;

    // Relaciona usuario con el numero random
    mapping(address => uint256) public idPersona_randomNumber;

    // Esta funcion permite cambiar el precio por cada token JDM
    function changePrice(uint256 _price) public onlyOwner returns (bool) {
        pricePerEachToken = _price * 1 ether;
        return true;
    }

    // Precio de los tokens ERC-20
    function tokenPrice(uint256 _numTokens) public view returns (uint256) {        
        return _numTokens * pricePerEachToken / 1000;
    }

    // Visualizacion del balance de tokens ERC-20 de un usuario
    function balanceTokens(address _account) public view returns (uint256) {
        return balanceOf(_account);
    }
    
    // Visualizacion del balance de tokens ERC-20 del Smart Contract
    function balanceTokensSC() public view returns (uint256) {
        return balanceOf(address(this));
    }

    // Generacion de nuevos Tokens ERC-20
    function mint(uint256 _amount) public onlyOwner {
        _mint(address(this), _amount);
    }

    // Visualizacion del balance de ethers del Smart Contract
    function balanceEthersSC() public view returns (uint256) {
        return address(this).balance / 10**15;                        
    }
        
    // Compra de tokens ERC-20
    function buyTokens(uint256 _numTokens) public payable {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_numTokens * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc 
        //uint256 balanceEthersContract = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles. Se le resta msg.value
        // porque lo primero que hace el codigo es que incrementa el balanceEthersSC() con 
        // la compra que estamos haciendo.
        //require(balanceEthersContract - msg.value >= _tokenPrice, "El smart contract no tiene Ethers disponibles para entregar recompensa. Compra menos");
        // Establecimiento del cost de los tokens a comprar
        uint256 cost = tokenPrice(_numTokens);
        // Evaluacion del dinero que el cliente paga por los tokens
        require(msg.value >= cost,"Compra menos tokens o paga con mas ethers");
        // Obtencion del numero de tokens ERC-20 disponibles en el smart contract
        uint256 balance = balanceTokensSC();
        require(_numTokens <= balance, "Compra un numero menor de tokens");
        // Devolucion del dinero sobrante
        uint256 returnValue = msg.value - cost;
        // El Smart Contract devuelve la cantidad restante
        payable(msg.sender).transfer(returnValue);
        // Envio de los tokens al cliente/usuario
        _transfer(address(this), msg.sender, _numTokens);
    }

    // Venta de tokens al Smart Contract
    function sellTokens(uint256 _numTokens) public payable {
        // El numero de tokens debe ser mayor a 0
        require(_numTokens > 0, "Necesitas vender un numero de tokens mayor a 0");
        // El usuario debe acreditar tener los tokens que quiere devolver
        require(_numTokens <= balanceTokens(msg.sender), "No tienes los tokens que deseas devolver");
        // El usuario transfiere los tokens al Smart Contract
        _transfer(msg.sender, address(this), _numTokens);
        // El Smart Contract envia los ethers al usuario
        payable(msg.sender).transfer(tokenPrice(_numTokens));
    }

    function sendEthers() public payable onlyOwner returns(bool) {
        return true;
    }

    function withdraw(uint _amount) public payable onlyOwner returns (bool) {
        payable(owner()).transfer(_amount*10**18);
        return true;
    }        
    
    // Apuesta al 1
    function bet1(uint256 _amountBet) public {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_amountBet * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc.
        //uint256 balanceEthersContractBet = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles.
        //require(balanceEthersContractBet >= _tokenPrice, "El smart contract no tiene Ethers disponibles. Contacta al owner para que envie ethers");              
        // Verifica que el usuario tenga los tokens que va apostar
        require(_amountBet <= balanceTokens(msg.sender), "No tienes tokens suficientes");
        // Verifica que el smart contract tenga tokens disponibles
        require(_amountBet * 2 <= balanceTokensSC(), "El smart contract no tiene suficientes tokens para dar");
        // Guardamos en un mapping el numero seleccionado.
        id_userNumber[msg.sender] = 1;
        // Se genera el numero aleatorio
        generateNumber();
        if(randomNumber() == selectedNumber()) {
            _transfer(address(this), msg.sender, _amountBet*2);
        } else {
            _transfer(msg.sender, address(this), _amountBet);
        }        
    }
    
    // Apuesta al 2
    function bet2(uint256 _amountBet) public {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_amountBet * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc.
        //uint256 balanceEthersContractBet = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles.
        //require(balanceEthersContractBet >= _tokenPrice, "El smart contract no tiene Ethers disponibles. Contacta al owner para que envie ethers");       
        // Verifica que el usuario tenga los tokens que va apostar
        require(_amountBet <= balanceTokens(msg.sender), "No tienes tokens suficientes");
        // Verifica que el smart contract tenga tokens disponibles
        require(_amountBet * 2 <= balanceTokensSC(), "El smart contract no tiene suficientes tokens para dar");
        // Guardamos en un mapping el numero seleccionado.
        id_userNumber[msg.sender] = 2;
        // Se genera el numero aleatorio
        generateNumber();
        if(randomNumber() == selectedNumber()) {
            _transfer(address(this), msg.sender, _amountBet*2);
        } else {
            _transfer(msg.sender, address(this), _amountBet);
        }        
    }

     // Apuesta al 3
    function bet3(uint256 _amountBet) public {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_amountBet * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc.
        //uint256 balanceEthersContractBet = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles.
        //require(balanceEthersContractBet >= _tokenPrice, "El smart contract no tiene Ethers disponibles. Contacta al owner para que envie ethers");
        // Verifica que el usuario tenga los tokens que va apostar
        require(_amountBet <= balanceTokens(msg.sender), "No tienes tokens suficientes");
        // Verifica que el smart contract tenga tokens disponibles
        require(_amountBet * 2 <= balanceTokensSC(), "El smart contract no tiene suficientes tokens para dar");
        // Guardamos en un mapping el numero seleccionado.
        id_userNumber[msg.sender] = 3;
        // Se genera el numero aleatorio
        generateNumber();
        if(randomNumber() == selectedNumber()) {
            _transfer(address(this), msg.sender, _amountBet*2);
        } else {
            _transfer(msg.sender, address(this), _amountBet);
        }        
    }

     // Apuesta al 4
    function bet4(uint256 _amountBet) public {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_amountBet * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc.
        //uint256 balanceEthersContractBet = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles.
        //require(balanceEthersContractBet >= _tokenPrice, "El smart contract no tiene Ethers disponibles. Contacta al owner para que envie ethers");
        // Verifica que el usuario tenga los tokens que va apostar
        require(_amountBet <= balanceTokens(msg.sender), "No tienes tokens suficientes");
        // Verifica que el smart contract tenga tokens disponibles
        require(_amountBet * 2 <= balanceTokensSC(), "El smart contract no tiene suficientes tokens para dar");
        // Guardamos en un mapping el numero seleccionado.
        id_userNumber[msg.sender] = 4;
        // Se genera el numero aleatorio
        generateNumber();
        if(randomNumber() == selectedNumber()) {
            _transfer(address(this), msg.sender, _amountBet*2);
        } else {
            _transfer(msg.sender, address(this), _amountBet);
        }        
    }

     // Apuesta al 5
    function bet5(uint256 _amountBet) public {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_amountBet * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc.
        //uint256 balanceEthersContractBet = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles.
        //require(balanceEthersContractBet >= _tokenPrice, "El smart contract no tiene Ethers disponibles. Contacta al owner para que envie ethers");
        // Verifica que el usuario tenga los tokens que va apostar
        require(_amountBet <= balanceTokens(msg.sender), "No tienes tokens suficientes");
        // Verifica que el smart contract tenga tokens disponibles
        require(_amountBet * 2 <= balanceTokensSC(), "El smart contract no tiene suficientes tokens para dar");
        // Guardamos en un mapping el numero seleccionado.
        id_userNumber[msg.sender] = 5;
        // Se genera el numero aleatorio
        generateNumber();
        if(randomNumber() == selectedNumber()) {
            _transfer(address(this), msg.sender, _amountBet*2);
        } else {
            _transfer(msg.sender, address(this), _amountBet);
        }        
    }

     // Apuesta al 6
    function bet6(uint256 _amountBet) public {
        // Guarda el total de ethers que podria ganar
        //uint256 _tokenPrice = tokenPrice(_amountBet * 2);
        // Guarda la cantidad de ethers expresado en weis que tiene el sc.
        //uint256 balanceEthersContractBet = address(this).balance;        
        // Verifica que el smart contract tenga ethers disponibles.
        //require(balanceEthersContractBet >= _tokenPrice, "El smart contract no tiene Ethers disponibles. Contacta al owner para que envie ethers");
        // Verifica que el usuario tenga los tokens que va apostar
        require(_amountBet <= balanceTokens(msg.sender), "No tienes tokens suficientes");
        // Verifica que el smart contract tenga tokens disponibles
        require(_amountBet * 2 <= balanceTokensSC(), "El smart contract no tiene suficientes tokens para dar");
        // Guardamos en un mapping el numero seleccionado.
        id_userNumber[msg.sender] = 6;
       // Se genera el numero aleatorio
        generateNumber();
        if(randomNumber() == selectedNumber()) {
            _transfer(address(this), msg.sender, _amountBet*2);
        } else {
            _transfer(msg.sender, address(this), _amountBet);
        }        
    }

    function selectedNumber() private view returns (uint256) {
        return id_userNumber[msg.sender];        
    }
    
    function randomNumber() private view returns (uint256) {
        return idPersona_randomNumber[msg.sender];
    }  

    uint256 private randNonce = 0;

    // Generacion del numero Random
    function generateNumber() private {
        randNonce++;
        // Eleccion aleatoria de un numero entre: [0-6]
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender, randNonce))) % 7;
        
        while (random == 0) {
            randNonce++;
            random = uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender, randNonce))) % 7;
        }
        // Se ingresa en el mapping el numero random perteneciente al usuario
        idPersona_randomNumber[msg.sender] = random;
    }
   
          
}
