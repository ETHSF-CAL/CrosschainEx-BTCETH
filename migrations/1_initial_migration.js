var Migrations = artifacts.require("./Migrations.sol");
var ExampleCoin = artifacts.require("./ExampleCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ExampleCoin)

    // Console log the address:
    .then(() => console.log(">>>>>> Example Coin address:", ExampleCoin.address))

    // // Option 3) Retrieve the contract instance and get the address from that:
    // .then(() => SimpleStorage.deployed())
    // .then(_instance => console.log(_instance.address));
};
