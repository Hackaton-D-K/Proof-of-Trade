'use strict';

((window, document) => {

    const contractData = {
        address: '0x2728102d66986f904fb40c1e986624f305785586',
        abi: [
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "new_price",
                        "type": "uint256"
                    }
                ],
                "name": "newPrice",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "priceBTC",
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
            }
        ]
    };
    const realContractData = {
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

    window.addEventListener('load', () => setTimeout(async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                // Request account access if needed
                const accounts = await window.ethereum.enable();

                fetch("proving_key.bin").then((response) => {
                    return response.arrayBuffer();
                }).then((b) => {
                    window.provingKey = b;
                    fetch("witness.json").then((response) => {
                        return response.json();
                    }).then(async (b) => {
                        window.witness = b;
                        window.proof = await genProof(binWitness(b), window.provingKey);

                        fetch("verification_key.json").then((response) => {
                            return response.json();
                        }).then((b) => {
                            window.verificationKey = b;

                            fetch("public.json").then((response) => {
                                return response.json();
                            }).then((b) => {
                                verify(window.verificationKey, b, window.proof);
                            });
                        });
                    });

                }).catch((err) => {
                    updateBanner(err);
                    throw err;
                });

                // const cir = new Circuit(cirDef);
                // const witness = cir.calculateWitness({"a": "33", "b": "34"});

                // const myRealContract = new window.web3.eth.Contract(realContractData.abi, realContractData.address);
                // myRealContract.methods.currentAnswer().call(6643503-3000000).then((result) => {
                //     updateBanner(result);
                // });

                const MyContract = new window.web3.eth.Contract(contractData.abi, contractData.address);
                MyContract.methods.priceBTC().call().then((result) => {
                    updateBanner(result);
                });
                // MyContract.methods.newPrice(256).send({
                //     from: accounts[0],
                //     // value: '0x00'
                // });

            } catch (error) {
                updateBanner(`User denied account access... ${error}`);
            }
        } else {
            updateBanner('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }


    }, 1000));

    function updateBanner(text) {
        console.log(text);
        document.getElementById("banner").innerText = text;
    }

    function genProof(witness, provingKey) {
        return new Promise(((resolve) => {
            const start = new Date().getTime();
            document.getElementById("time").innerHTML = "processing....";
            document.getElementById("proof").innerHTML = "";
            window.groth16GenProof(witness, provingKey).then((p) => {
                const end = new Date().getTime();
                const time = end - start;
                document.getElementById("time").innerHTML = `Time to compute: ${time}ms`;
                document.getElementById("proof").innerHTML = JSON.stringify(p, null, 1);
                resolve(p);
            });
        }));
    }

    function verify(verificationKey, publicSignals, proof) {
        const start = new Date().getTime();
        document.getElementById("time").innerHTML = "processing....";
        window.groth16Verify(verificationKey, publicSignals, proof).then((res) => {
            const end = new Date().getTime();
            const time = end - start;
            document.getElementById("time").innerHTML = `Time to compute: ${time}ms`;
            document.getElementById("verify").innerHTML = (res === true) ? "GOOD" : "Verification failed";
        });
    }

    function binWitness(rawWitness) {
        const witness = unstringifyBigInts(rawWitness);
        const buffLen = calculateBuffLen(witness);
        const buff = new ArrayBuffer(buffLen);
        const h = {
            dataView: new DataView(buff),
            offset: 0
        };

        for (let i = 0; i < witness.length; i++) {
            writeBigInt(h, witness[i]);
        }

        function writeUint32(h, val) {
            h.dataView.setUint32(h.offset, val, true);
            h.offset += 4;
        }

        function writeBigInt(h, bi) {
            for (let i = 0; i < 8; i++) {
                const v = bi.shiftRight(i * 32).and(0xFFFFFFFF).toJSNumber();
                writeUint32(h, v);
            }
        }

        function calculateBuffLen(witness) {
            let size = 0;
            // beta2, delta2
            size += witness.length * 32;
            return size;
        }

        return buff;
    }

    function stringifyBigInts(o) {
        if ((typeof (o) == "bigint") || (o instanceof bigInt)) {
            return o.toString(10);
        } else if (Array.isArray(o)) {
            return o.map(stringifyBigInts);
        } else if (typeof o == "object") {
            const res = {};
            for (let k in o) {
                res[k] = stringifyBigInts(o[k]);
            }
            return res;
        } else {
            return o;
        }
    }

    function unstringifyBigInts(o) {
        if ((typeof (o) == "string") && (/^[0-9]+$/.test(o))) {
            return bigInt(o);
        } else if (Array.isArray(o)) {
            return o.map(unstringifyBigInts);
        } else if (typeof o == "object") {
            const res = {};
            for (let k in o) {
                res[k] = unstringifyBigInts(o[k]);
            }
            return res;
        } else {
            return o;
        }
    }

})(window, document);