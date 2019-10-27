window.addEventListener('load', () => setTimeout(load, 1000));

async function load() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.accounts = await window.ethereum.enable();
        window.myContract = new window.web3.eth.Contract(contractData.abi, contractData.address);
        window.oracle = new window.web3.eth.Contract(oracleContractData.abi, oracleContractData.address);

    }

    document.getElementById('loading').innerText = '';

    document.getElementById('generate-form').addEventListener('submit', (event) => {
        (async () => {
            const len = await myContract.methods.getTradeLen(accounts[0]).call();
            const a = await myContract.methods.signals(accounts[0], len - 2).call();
            const b = await myContract.methods.signals(accounts[0], len - 1).call();
            const price_a = (await oracle.methods.currentAnswer().call(a.blockNumber)) / Math.pow(10, 8);
            const price_b = (await oracle.methods.currentAnswer().call(b.blockNumber)) / Math.pow(10, 8);
            const currentBlock = await web3.eth.getBlockNumber();
            const price_now = (await oracle.methods.currentAnswer().call(currentBlock)) / Math.pow(10, 8);
            // const price_a = 100;
            // const price_b = 200;
            // const price_now = 300;

            const amount_1 = document.getElementById('period-amount-1').value;
            const nonce_1 = document.getElementById('period-nonce-1').value;
            const types_1 = document.getElementsByName('period-trade-1');
            let type_1;
            for (let i = 0; i < types_1.length; i++) {
                if (types_1[i].checked) {
                    type_1 = types_1[i].value;
                    break;
                }
            }

            const amount_2 = document.getElementById('period-amount-2').value;
            const nonce_2 = document.getElementById('period-nonce-2').value;
            const types_2 = document.getElementsByName('period-trade-2');
            let type_2;
            for (let i = 0; i < types_2.length; i++) {
                if (types_2[i].checked) {
                    type_2 = types_2[i].value;
                    break;
                }
            }

            const balanceUSD = document.getElementById('generate-balance-usd').value;
            const balanceETH = document.getElementById('generate-balance-eth').value;

            const proofLen = parseInt(await myContract.methods.getProofLen(accounts[0]).call());
            let previousBalanceHash;
            if (proofLen === 0) {
                previousBalanceHash = '15908070228732390218204169968729456547298033751842088798219911969030545051409';
            } else {
                previousBalanceHash = (await myContract.methods.periodProofs(accounts[0], proofLen - 1).call()).newBalanceHash;
            }

            let input = {
                "type": [parseInt(type_1), parseInt(type_2)],
                "value": [parseInt(amount_1), parseInt(amount_2)],
                "salt": [parseInt(nonce_1), parseInt(nonce_2)],
                "previousBalance": [Math.round(balanceUSD), Math.round(balanceETH)],
                "previousBalanceHash": previousBalanceHash,
                "hash": [a.hash, b.hash],
                "price": [Math.round(price_a), Math.round(price_b), Math.round(price_now)]
            };
            const proof = await window.witness(input);
            let newVar = {
                pi_a: [web3.eth.abi.encodeParameter('uint256', proof.pi_a[0]), web3.eth.abi.encodeParameter('uint256', proof.pi_a[1])],
                pi_b: [[
                    web3.eth.abi.encodeParameter('uint256', proof.pi_b[0][0]), web3.eth.abi.encodeParameter('uint256', proof.pi_b[0][1])
                ], [
                    web3.eth.abi.encodeParameter('uint256', proof.pi_b[1][0]), web3.eth.abi.encodeParameter('uint256', proof.pi_b[1][1])
                ]],
                pi_c: [web3.eth.abi.encodeParameter('uint256', proof.pi_c[0]), web3.eth.abi.encodeParameter('uint256', proof.pi_c[1])]
            };
            let number = parseInt(proof.publicSignals[1]);
            let number1 = parseInt(currentBlock);
            window.myContract.methods.addPeriodProof(number, newVar, proof.publicSignals[0], number1).send({
                from: accounts[0],
            });
        })();
        event.preventDefault();
    }, false);

    document.getElementById('account-form').addEventListener('submit', (event) => {
        document.getElementById('account-error').innerText = '';
        const email = document.getElementById('account-email').value;
        if (email === "") {
            document.getElementById('account-error').innerText = 'Email is empty';
        } else {
            window.account = email;
            window.myContract.methods.newTrader(email).send({
                from: accounts[0],
            });
        }
        event.preventDefault();
    }, false);

    document.getElementById('signal-buy').addEventListener('click', (event) => {
        document.getElementById('signal-error').innerText = '';
        const signalCurrency = document.getElementById('signal-currency');
        const currency = signalCurrency.options[signalCurrency.selectedIndex].value;
        const amount = document.getElementById('signal-amount').value;
        const nonce = document.getElementById('signal-nonce').value;

        if (amount == "") {
            document.getElementById('signal-error').innerText = 'Amount is empty';
        } else if (nonce == "") {
            document.getElementById('signal-error').innerText = 'Nonce is empty';
        } else {
            window.myContract.methods.addSignal(window.signalHash(1, amount, nonce)).send({
                from: accounts[0],
            });
        }
        event.preventDefault();
    }, false);

    document.getElementById('signal-sell').addEventListener('click', (event) => {
        document.getElementById('signal-error').innerText = '';
        const signalCurrency = document.getElementById('signal-currency');
        const currency = signalCurrency.options[signalCurrency.selectedIndex].value;
        const amount = document.getElementById('signal-amount').value;
        const nonce = document.getElementById('signal-nonce').value;

        if (amount == "") {
            document.getElementById('signal-error').innerText = 'Amount is empty';
        } else if (nonce == "") {
            document.getElementById('signal-error').innerText = 'Nonce is empty';
        } else {
            let signalHash = window.signalHash(0, amount, nonce);
            console.log(signalCurrency);
            window.myContract.methods.addSignal(signalHash).send({
                from: accounts[0],
            });
        }
        event.preventDefault();
    }, false);

}