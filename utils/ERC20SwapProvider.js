var ERC20Swap = require("../build/contracts/ERC20Swap.json");
var ExampleCoin = require("../build/contracts/ExampleCoin.json");
var truffleContract = require("truffle-contract");


// Convert the JSON artifact to a Contract Object
async function jsonToContract(json, _web3, accounts) {
  const contract = truffleContract(json);
  contract.setProvider(_web3.currentProvider);
  contract.defaults({
    from: accounts[0],
    gas: 4712388,
    gasPrice: 100000000000
  })
  // dirty hack
  if (typeof contract.currentProvider.sendAsync !== "function") {
    contract.currentProvider.sendAsync = function() {
      return contract.currentProvider.send.apply(
        contract.currentProvider, arguments
      );
    };
  }
  return contract;
}


class ERC20SwapProvider {
  constructor (tokenAddress, web3) {
    this._tokenAddress = tokenAddress;
    this._web3 = web3
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    const web3 = this._web3;
    const accounts = await web3.eth.getAccounts();

    // Deploy ExampleCoinContract (ERC20 Token)
    const ExampleCoinContract = await jsonToContract(ExampleCoin, web3, accounts);
    const ExampleCoinInstance = await ExampleCoinContract.deployed();
    
    await ExampleCoinInstance.approve(accounts[0], 9999999, { from: accounts[0] })

    // Deploy ERC20SwapContract (Swapper to claim / expire)
    const ERC20SwapContract = await jsonToContract(ERC20Swap, web3, accounts);
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