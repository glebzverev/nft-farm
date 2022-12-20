// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Factory contract
/// @author FormalCrypto
/// @notice The contract is used to create, manage, and destroy a NFT collection
contract Factory is Ownable {
    // Owner of the Factory contract
    address private _owner;
    
    // List of creators of a NFT collections
    mapping(string => address) private collectionCreator;
    // List of the collections
    mapping(string => address) private collection;
    // List of whitelisted users
    mapping(address => bool) private whitelist;

    /// @notice Returns address of the collection's creator
    /// @param _collection Name of the collection
    /// @return Address of the collecion's creator
    function getCollectionCreator(string calldata _collection) external view returns(address){
        return collectionCreator[_collection];
    }

    /// @notice Returns address of the collection
    /// @param _collection Collection name
    /// @return address of the collection
    function getCollection(string calldata _collection) external view returns(address){
        return collection[_collection];
    }

    /// @notice Сhecks whether the user is in whitelisted list
    /// @param user Address of the user
    /// @return 
    function getWhitelist(address user) external view returns(bool){
        return whitelist[user];
    }

    /// @notice Returns owner address
    /// @return Address of the owner
    function getOwner() external view returns(address){
        return _owner;
    }

    modifier onlyWhitelist(){
        require(whitelist[msg.sender], "You are not whitelisted user");
        _;
    }
    /// @dev Create contract and set msg.sender as owner of the contract
    constructor(){
        _owner = msg.sender;
    }

    /// @notice Add user to whitelisted list
    /// @dev Only owner of the contract can add user to whitelist
    /// @param _user Address of the user being added to whitelist
    function addToWhitelist(address _user) external onlyOwner{
        whitelist[_user] = true;
    }

    /// @notice Remove user from whitelist
    /// @dev Only owner of the contract can remove user from whitelist
    /// @param _user Address of the user being removed from thitelist
    function removeWhiteList(address _user) external onlyOwner{
        whitelist[_user] = false;
    }

    /// @notice Pause sale if active, make active if paused
    /// @dev Only collection's creator can call this function
    /// @param name Name of the collection
    function toggleSaleState(string calldata name) public{
        require(collectionCreator[name] == msg.sender, "It's not your collection");
        NFTCollection(collection[name]).toggleSaleState();
    }

    /// @notice Set base URI for NFT
    /// @dev Only collection's creator can call this function
    /// @param name Name of the collection
    /// @param _baseURI Base URI that will setted for NFTs
    function setCollectionBaseURI(string calldata name, string calldata _baseURI) public {
        require(collectionCreator[name] == msg.sender, "It's not your collection");
        NFTCollection(collection[name]).setBaseURI(_baseURI);
    }

    /// @notice Destroy the collection
    /// @dev Only collection's creator can call this function
    /// @param name Name of the collection
    function destroyCollection(string calldata name) external{
        require(collectionCreator[name] == msg.sender, "It's not your collection");
        collection[name] = address(0); 
        collectionCreator[name] = address(0); 
        NFTCollection(collection[name]).destroy();  
    } 

    /// @notice Create new collection
    /// @dev Only whitelisted user can create collection
    /// @param name Name of the collection
    /// @param symbol Symbol of the collection
    /// @param maxNftSupply Max supply NFT for collection
    /// @param saleStart Sales start time 
    /// @param properties Properties for NFTs
    /// @param referalFee Referal Fee  
    function makeCollection(
        string calldata name, 
        string calldata symbol, 
        uint256 maxNftSupply, 
        uint256 saleStart, 
        string[] calldata properties, 
        uint256 referalFee
    ) 
        external 
        onlyWhitelist
    {
        require(collection[name] == address(0), "Collection with that name already exist");
        NFTCollection Collection = new NFTCollection(name, symbol, maxNftSupply, saleStart, properties, referalFee);
        collectionCreator[name] = msg.sender;
        collection[name] = address(Collection);
        NFTCollection(address(Collection)).toggleSaleState();
    }
}