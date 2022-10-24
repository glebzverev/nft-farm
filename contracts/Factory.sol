pragma solidity ^0.7.5;
pragma abicoder v2;

import "./NFTCollection.sol";

contract Factory {
    address private _owner;
    mapping(string => address) private Collection_creator;
    mapping(string => address) private Collection;
    mapping(address => bool) private whitelist;

    function getCollection_creator(string memory collection) external view returns(address){
        return Collection_creator[collection];
    }

    function getCollection(string memory collection) external view returns(address){
        return Collection[collection];
    }

    function getWhitelist(address user) external view returns(bool){
        return whitelist[user];
    }

    function getOwner() external view returns(address){
        return _owner;
    }

    modifier onlyOwner(){
        require(msg.sender == _owner, "You are not owner");
        _;
    }

    modifier onlyWhitelist(){
        require(whitelist[msg.sender], "You are not whitelisted user");
        _;
    }

    constructor(){
        _owner = msg.sender;
    }


    function addWhitelist(address _user) external onlyOwner{
        whitelist[_user] = true;
    }

    function removeWhitelist(address _user) external onlyOwner{
        whitelist[_user] = false;
    }

    function flipSaleState(string memory name) public{
        require(Collection_creator[name] == msg.sender, "It's not your collection");
        NFTCollection(Collection[name]).flipSaleState();
    }

    function baseURI(string memory name, string memory _baseURI) public {
        require(Collection_creator[name] == msg.sender, "It's not your collection");
        NFTCollection(Collection[name]).setBaseURI(_baseURI);
    }

    function destroyCollection(string memory name) external{
        require(Collection_creator[name] == msg.sender, "It's not your collection");
        NFTCollection(Collection[name]).destroy();  
        Collection[name] = address(0); 
        Collection_creator[name] = address(0); 
    } 

    function makeCollection(string memory name, string memory symbol, uint256 maxNftSupply, uint256 saleStart, string[] memory properties) 
        external onlyWhitelist{
        require(Collection[name] == address(0), "Collection with that name already exist");
        NFTCollection collection = new NFTCollection(name, symbol, maxNftSupply, saleStart, properties);
        Collection_creator[name] = msg.sender;
        Collection[name] = address(collection);
        NFTCollection(address(collection)).flipSaleState();
    }
}