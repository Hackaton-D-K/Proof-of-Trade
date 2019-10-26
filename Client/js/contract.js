(async (window, document) => {
    const verificationKeyRequest = await fetch('../SNARK/build/circuits/income_verification_key.json');
    window.verificationKey = await verificationKeyRequest.json();
})(window, document);

window.oracleContractData = {
    address: '0x0Be00A19538Fac4BE07AC360C69378B870c412BF',
    abi: [
        {
            "constant": true,
            "inputs": [],
            "name": "currentAnswer",
            "outputs": [{"name": "", "type": "int256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
    ]
};

window.contractData = {
    address: '0x2321a7cffc90753ceaaa4646a3bf0215f42ec792',
    abi: [
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "yield",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "internalType": "uint256[2]",
                            "name": "a",
                            "type": "uint256[2]"
                        },
                        {
                            "internalType": "uint256[2][2]",
                            "name": "b",
                            "type": "uint256[2][2]"
                        },
                        {
                            "internalType": "uint256[2]",
                            "name": "c",
                            "type": "uint256[2]"
                        }
                    ],
                    "internalType": "struct TradeStorage.Proof",
                    "name": "proof",
                    "type": "tuple"
                },
                {
                    "internalType": "string",
                    "name": "balanceHash",
                    "type": "string"
                }
            ],
            "name": "addPeriodProof",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "newSinal",
                    "type": "string"
                }
            ],
            "name": "addSignal",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                }
            ],
            "name": "newTrader",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balanceHashes",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "emails",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "trader",
                    "type": "address"
                }
            ],
            "name": "getProofLen",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "trader",
                    "type": "address"
                }
            ],
            "name": "getTradeLen",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "lastProofBlock",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "periodProofs",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "blockNumber",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "y",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "internalType": "uint256[2]",
                            "name": "a",
                            "type": "uint256[2]"
                        },
                        {
                            "internalType": "uint256[2][2]",
                            "name": "b",
                            "type": "uint256[2][2]"
                        },
                        {
                            "internalType": "uint256[2]",
                            "name": "c",
                            "type": "uint256[2]"
                        }
                    ],
                    "internalType": "struct TradeStorage.Proof",
                    "name": "proof",
                    "type": "tuple"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "signals",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "blockNumber",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
};