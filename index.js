var Client = require('@liquality/chainabstractionlayer').Client;
var providers = require('@liquality/chainabstractionlayer').providers;
// const EthereumRPCProvider = providers.ethereum.EthereumRPCProvider;
var ERC20SwapProvider = require("./utils/ERC20SwapProvider");

// var getWeb3 = require("./utils/getWeb3")
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// //dirty hack
// let contract = ERC20SwapProvider(artifacts);
// if (typeof contract.currentProvider.sendAsync !== "function") {
//   contract.currentProvider.sendAsync = function() {
//     return contract.currentProvider.send.apply(
//       contract.currentProvider, arguments
//     );
//   };
// }
// var ExampleCoin = require("build/contract/ExampleCoin.json");
var sha256 = require("js-sha256")

const ETH = Math.pow(10, 18);

const ethereum = new Client()
// ethereum.addProvider(new EthereumRPCProvider('http://localhost:8545'))


;(async function(){
  // console.log(await ethereum.getAddresses())

  // var web3 = await getWeb3();
  var exampleTokenAddr = "0x9bc46fd6fa4a9e2bfd061dbd4403a6273729e2e6";
  ethereum.addProvider(new ERC20SwapProvider(exampleTokenAddr, web3))
  
  var addrs = await web3.eth.getAccounts();
  var value = 0.01*ETH;
  var recipientAddress = addrs[1];
  var refundAddress = addrs[0];
  var expiration = 1231241; //random

  var secret = "123"; // u decide :D
  var secretHash = sha256(secret);

  var initiationTxHash = await ethereum.initiateSwap(value, recipientAddress, refundAddress, secretHash, expiration);
  console.log(initiationTxHash);

  var tnx_hash = await ethereum.claimSwap(initiationTxHash, recipientAddress, refundAddress, secret, expiration);
  console.log(tnx_hash);

  
})();