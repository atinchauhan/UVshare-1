pragma solidity ^0.4.23;

contract SimpleStorage {
  //string public ipfsHash='hi i am mehul';
  string ipfsHash="";
   function set(string memory x) public {
    ipfsHash= x;
  }

  function get() public view returns (string memory) {
    return ipfsHash;
  }
}
