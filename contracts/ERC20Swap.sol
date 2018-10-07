import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

pragma solidity ^0.4.21;

contract ERC20Swap {
  bytes32 keyHash;
  uint expiration;
  address deployer;
  address recipient;
  address tokenAddress;

  constructor (bytes32 _keyHash, uint _expiration, address _recipient, address _tokenAddress) public {
    keyHash = _keyHash;
    recipient = _recipient;
    expiration = _expiration;
    tokenAddress = _tokenAddress;
    deployer = msg.sender;
  }

  function claim (bytes32 preHash) public {
    if (sha256(preHash) == keyHash && msg.sender == recipient) {
      ERC20 token = ERC20(tokenAddress);
      uint256 b = token.balanceOf(address(this));
      token.transfer(msg.sender, b);
    }
  }

  function expire () public {
    if (now > expiration) {
      ERC20 token = ERC20(tokenAddress);
      uint256 b = token.balanceOf(address(this));
      token.transfer(deployer, b);
    }
  }
}