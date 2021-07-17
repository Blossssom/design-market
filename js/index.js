import { ethers } from "./ethers.js";
import { patentMarketAddress, patentNFTAddress, saltCoinAddress } from "./contract.js";
import { patentMarketAbi, patentNFTAbi, saltCoinAbi } from "./contract.js";

var provider;
var signer;
var patentMarketContract;
var patentNFTContract;
var saltCoinContract;
var account = [];

const MetaMaskStatus = {
    NOT_INSTALLED: 0,
    NEED_CONNECT: 1,
    CONNECTED: 2
}

const SalesType = {
    SELL: 0,
    AUCTION: 1
};

const SalesStatus = {
    REGISTERED: 0,
    DELETED: 1,
    FINISHED:2
};

////////////////////////////////////////////////////////////////////////////////
function GetMetaMaskStatus() {
    if (!_IsMetaMaskInstalled()) {
        return MetaMaskStatus.NOT_INSTALLED;
    } else if (account.length === 0) {
        return MetaMaskStatus.NEED_CONNECT;
    } else {
        return MetaMaskStatus.CONNECTED;
    }
}

function GetCurrentAccount() {
    if(account.length === 0)
    return "";
    return account[0];
}

async function GetEthereumBalance(address) {
    let balance = await await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
}

async function GetSaltCoinBalance(address) {
    let balance = await saltCoinContract.balanceOf(address);
    return balance.toNumber();
}

async function GetPatentNFTBalance(address) {
    let balance = await patentNFTContract.balanceOf(address);
    return balance.toNumber();
}

async function RegisterPatent(number, type, price, deadline) {
    await patentMarketContract.registerPatent(number, type, price, deadline);
}

async function BuyPatent(patentId, amount) {
    await patentMarketContract.purchasePatent(patentId, amount);
}

async function DeletePatent(patentId) {
    await patentMarketContract.deletePatent(patentId);
}

async function FinalizePatent(patentId) {
    await patentMarketContract.finalizePatent(patentId);
}

async function GetPatentCount() {
    let count = await patentMarketContract.getPatentCount();
    return count.toNumber();
}

async function GetPatentInfo(patentId) {
    let patent = await patentMarketContract.getPatentById(patentId);
    return patent;
}

async function GetCurrentBid(patentId) {
    let bid = await patentMarketContract.getCurrentBid(patentId);
    return bid;
}
////////////////////////////////////////////////////////////////////////////////

function _IsMetaMaskInstalled() {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        return true;
    }
    else {
        return false;
    }
}

async function _GetAccount() {
    if(_IsMetaMaskInstalled()) {
        try {
            account = await ethereum.request({method: 'eth_requestAccounts'});
            _SetProviderAndContract();
        } catch (error) {
            console.error(error);
            account = [];
        }
    }
    else {
        account = [];
    }
}

function _SetProviderAndContract() {
    provider = new ethers.providers.Web3Provider(window.ethereum); // read-only
    signer = provider.getSigner(); // read-write
    patentMarketContract = new ethers.Contract(patentMarketAddress, patentMarketAbi, signer);
    patentNFTContract = new ethers.Contract(patentNFTAddress, patentNFTAbi, provider);
    saltCoinContract = new ethers.Contract(saltCoinAddress, saltCoinAbi, provider);
}

async function _UpdateElement() {
    // 업데이트 시 수행
    const metaMaskButton = document.getElementById('metaMaskButton');
    if (GetMetaMaskStatus() === MetaMaskStatus.NOT_INSTALLED) {
        metaMaskButton.innerText = 'MetaMask is not installed';
        metaMaskButton.disabled = true;
    } else if (GetMetaMaskStatus() === MetaMaskStatus.CONNECTED) {
        metaMaskButton.innerText = 'MetaMask Connected';
        metaMaskButton.disabled = true;
    } else {
        metaMaskButton.innerText = 'Connect to MetaMask';
        metaMaskButton.onclick = async () => {
            await _GetAccount();
            _UpdateElement();
        }
        metaMaskButton.disabled = false;
    }
    let address = GetCurrentAccount();
    document.getElementById('accountsDiv').innerHTML = address;
    document.getElementById('accountsETH').innerHTML = await GetEthereumBalance(address);
    document.getElementById('accountsSLT').innerHTML = await GetSaltCoinBalance(address);
    document.getElementById('accountsNFT').innerHTML = await GetPatentNFTBalance(address);

    //////////////////////////////////////////////////////////////////////////////////
    document.getElementById('registerButton').onclick = async () => {
        // regist 버튼 클릭시 행동
        let number = document.getElementById('patentNumber').value;
        // let type = document.getElementById('salesType').value;
        // focus button 선택
        // let type = document.getElementById('salesType').focus
        let price = document.getElementById('patentPrice').value;
        let deadline = document.getElementById('patentDeadline').value;
        await RegisterPatent(number, type, price, deadline);
        _UpdateElement();
    }

    //////////////////////////////////////////////////////////////////////////////////
    let patentId = document.getElementById('patentIndex').value;
    let patent = await GetPatentInfo(patentId);
    let lastBid = await GetCurrentBid(patentId);
    document.getElementById('patentTotal').innerHTML = await GetPatentCount();
    document.getElementById('searchButton').onclick = async () => {
        _UpdateElement();
    }
    document.getElementById('patentNumber2').innerHTML = patent[0];
    document.getElementById('salesType2').innerHTML = patent[3] + " (0:SELL, 1:AUCTION)";
    document.getElementById('patentPrice2').innerHTML = patent[4];
    document.getElementById('patentDeadline2').innerHTML = patent[5] + " (Time:" + (Math.round(Date.now() / 1000)).toString() + ")";
    document.getElementById('patentOwner').innerHTML = patent[1];
    console.log("here");
    document.getElementById('salesStatus').innerHTML = patent[2] + " (0:REGISTERED, 1:DELETED, 2:FINISHED)";
    document.getElementById('lastBuyer').innerHTML = lastBid[1];
    document.getElementById('lastPrice').innerHTML = lastBid[0];

    //////////////////////////////////////////////////////////////////////////////////
    document.getElementById('buyButton').onclick = async () => {
        let patentId = document.getElementById('patentIndex').value;
        let amount = document.getElementById('buyAmount').value;
        await BuyPatent(patentId, amount);
        _UpdateElement();
    }
    document.getElementById('balanceBuyer').innerHTML = (await GetSaltCoinBalance(GetCurrentAccount()))+" / "+GetCurrentAccount();
    document.getElementById('balanceOwner').innerHTML = (await GetSaltCoinBalance(patent[1]))+" / "+patent[1];
    document.getElementById('balanceMarket').innerHTML = (await GetSaltCoinBalance(patentMarketAddress))+" / "+patentMarketAddress;

    //////////////////////////////////////////////////////////////////////////////////
    document.getElementById('deleteButton').onclick = async () => {
        await DeletePatent(document.getElementById('patentIndex').value);
        _UpdateElement();
    }
    document.getElementById('finalizeButton').onclick = async () => {
        await FinalizePatent(document.getElementById('patentIndex').value);
        _UpdateElement();
    }
}

async function _UpdateAccountAndElement() {
    await _GetAccount();
    await _UpdateElement();
}

// 컨트랙트 완료시 event handle
function _HandleEvent() {
    ethereum.on('accountsChanged', _UpdateAccountAndElement);
    ethereum.on('disconnect', _UpdateAccountAndElement); // TODO Implement

    patentMarketContract.on("PatentRegistered", (from, patentId, event) => {
        document.getElementById('eventHistory').value += `PatentRegistered(${from},${patentId})\n`;
    });
    patentMarketContract.on("PatentDeleted", (from, patentId, event) => {
        document.getElementById('eventHistory').value += `PatentDeleted(${from},${patentId})\n`;
    });
    patentMarketContract.on("PatentPurchased", (from, patentId, event) => {
        document.getElementById('eventHistory').value += `PatentPurchased(${from},${patentId})\n`;
    });
    patentMarketContract.on("PatentFinalized", (from, patentId, event) => {
        document.getElementById('eventHistory').value += `PatentFinalized(${from},${patentId})\n`;
    });
}

async function initialize() {
    // metamask 실행함수
    await _GetAccount();
    await _UpdateElement();
    _HandleEvent();
}

window.addEventListener('DOMContentLoaded', initialize);
