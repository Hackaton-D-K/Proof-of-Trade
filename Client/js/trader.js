window.addEventListener('load', () => setTimeout(load, 1000));

async function load() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.accounts = await window.ethereum.enable();
        window.myContract = new window.web3.eth.Contract(contractData.abi, contractData.address);
        window.oracle = new window.web3.eth.Contract(oracleContractData.abi, oracleContractData.address);

    }

    document.getElementById('loading').innerText = '';

    document.getElementById('generate-form').addEventListener('submit',  (event) => {
        (async () => {
            const price = await oracle.methods.currentAnswer().call();
            const len = await myContract.methods.getTradeLen(accounts[0]).call();
            const a = await myContract.methods.signals(accounts[0], len - 1).call();
            const b = await myContract.methods.signals(accounts[0], len - 2).call();

            const amount_1 = document.getElementById('period-amount-1').value;
            const nonce_1 = document.getElementById('period-nonce-1').value;
            const types_1 = document.getElementsByName('period-trade-1');
            let type_1;
            for (let i = 0; i < types_1.length; i++) {
                if (types_1[i].checked)
                {
                    type_1 = types_1[i].value;
                    break;
                }
            }

            const amount_2 = document.getElementById('period-amount-2').value;
            const nonce_2 = document.getElementById('period-nonce-2').value;
            const types_2 = document.getElementsByName('period-trade-2');
            let type_2;
            for (let i = 0; i < types_2.length; i++) {
                if (types_2[i].checked)
                {
                    type_1 = types_2[i].value;
                    break;
                }
            }

            const balance = document.getElementById('generate-balance').value;

            const proof = await window.witness({
                "type": [1, 0],
                "value": [2, 1],
                "salt": [11, 22],
                "previousBalance": [200, 0],
                "previousBalanceHash": "15908070228732390218204169968729456547298033751842088798219911969030545051409",
                "hash": ["1642007188384874626844607717200885045131494880922299681771429043555167555148",
                    "17823975453993386318921224321352724800265319135009016425352400193970644780819"],
                "price": [100, 200, 300]
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
            window.myContract.methods.addSignal(window.signalHash(0, amount, nonce)).send({
                from: accounts[0],
            });
        }
        event.preventDefault();
    }, false);

}