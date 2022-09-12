pragma solidity ^0.7.5;

import "./NFTCollection.sol";

contract Factory{

    address public _owner;
    mapping(string => address) public Collection_creator;
    mapping(string => address) public Collection;

    modifier onlyOwner(address _addr){
        require(msg.sender == _owner, "You are not owner");
        _;
    }

    constructor(){
        _owner = msg.sender;
    }

    function flipSaleState(string memory name) public{
        require(Collection_creator[name] == msg.sender, "It's not your collection");
        NFTCollection(Collection[name]).flipSaleState();
    }

    function makeCollection(string memory name, string memory symbol, uint256 maxNftSupply, uint256 saleStart) external{
        NFTCollection collection = new NFTCollection(name, symbol, maxNftSupply, saleStart);
        Collection_creator[name] = msg.sender;
        Collection[name] = address(collection);
        NFTCollection(address(collection)).flipSaleState();
    }
}