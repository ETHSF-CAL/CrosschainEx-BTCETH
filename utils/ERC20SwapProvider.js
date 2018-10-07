// import ERC20Swap from "../contracts/ERC20Swap.json";
var ERC20Swap = require("../build/contracts/ERC20Swap.json");
var ExampleCoin = require("../build/contracts/ExampleCoin.json");
// import ExampleCoin from "../contracts/ExampleCoin.json";
var truffleContract = require("truffle-contract");
// import truffleContract from "truffle-contract";

// var artifacts = requirez("../build/contract");


class ERC20SwapProvider {
  constructor (tokenAddress, web3) {
    this._tokenAddress = tokenAddress;
    this._web3 = web3
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    const web3 = this._web3;

    const accounts = await web3.eth.getAccounts();

    const ExampleCoinContract = truffleContract(ExampleCoin);
    ExampleCoinContract.setProvider(web3.currentProvider);
    ExampleCoinContract.defaults({
      from: accounts[0],
      gas: 4712388,
      gasPrice: 100000000000
    })
    // dirty hack
    if (typeof ExampleCoinContract.currentProvider.sendAsync !== "function") {
      ExampleCoinContract.currentProvider.sendAsync = function() {
        return ExampleCoinContract.currentProvider.send.apply(
          ExampleCoinContract.currentProvider, arguments
        );
      };
    }
    // end
    const ExampleCoinInstance = await ExampleCoinContract.deployed();

    await ExampleCoinInstance.approve(accounts[0], 9999999, { from: accounts[0] })

    const ERC20SwapContract = truffleContract(ERC20Swap);
    ERC20SwapContract.setProvider(web3.currentProvider);
    ERC20SwapContract.defaults({
      from: accounts[0],
      gas: 4712388,
      gasPrice: 100000000000
    })
    // dirty hack
    if (typeof ERC20SwapContract.currentProvider.sendAsync !== "function") {
      ERC20SwapContract.currentProvider.sendAsync = function() {
        return ERC20SwapContract.currentProvider.send.apply(
          ERC20SwapContract.currentProvider, arguments
        );
      };
    }
    // end
    const ERC20SwapInstance = await ERC20SwapContract.new(
      secretHash,
      expiration,
      `${recipientAddress}`,
      `${accounts[0]}`,
      { 
        from: accounts[0] 
      }
    )

    return ERC20SwapInstance.address
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    // Claim Swap
  }

  async getSwapTransaction (blockNumber, recipientAddress, refundAddress, secretHash, expiration) {
    // getSwapTransaction
  }

  async getSwapConfirmTransaction (blockNumber, initiationTxHash, secretHash) {
    // getSwapConfirmTransaction
  }

  async getSecret (claimTxHash) {
    // getSecret
  }

  setClient (client) {
    this.client = client
  }

  getMethod (method) {
    return this.client.getMethod(method, this).bind(this)
  }

}

exports["default"] = ERC20SwapProvider;
module.exports = exports["default"];