var { ethers }  = require("ethers");
let provider;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined')
{
    provider = new ethers.BrowserProvider(window.ethereum);
    window.ethereum.request({ method: 'eth_requestAccounts' });
}

export default provider;