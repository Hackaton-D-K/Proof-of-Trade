const contractData = {
    address: '0x7de3a127737827d6ffef07e0125914d0a9eab3cf',
    abi: [
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
            "stateMutability": "pure",
            "type": "function"
        }
    ]
};

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();

            var MyContract = new window.web3.eth.Contract(contractData.abi, contractData.address);
            MyContract.methods.priceBTC().call().then((result) => {
                updateBanner(result);
            });
        } catch (error) {
            console.error('User denied account access...' + error);
            updateBanner('User denied account access...');
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        updateBanner('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

function updateBanner(text) {
    document.getElementById("banner").innerText = text;
}
