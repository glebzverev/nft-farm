// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFTCollection contract
/// @author FormalCrypto
/// @dev Extends ERC721 Non-Fungible Token Standard basic implementation
contract NFTCollection is ERC721, Ownable {

    uint256 public startingIndexBlock;

    uint256 public startingIndex;

    uint256 public maxNfts;

    bool public saleIsActive = false;

    uint256 public revealTimestamp;

    string[] public properties;

    uint256 public totalSupply; 

    mapping (uint256 => address) public referals;

    uint256 public constant FEE_DECIMALS = 10**6; 

    uint256 public referalFee;

    string private _baseUri;

    constructor(string memory name, string memory symbol, uint256 maxNftSupply, uint256 saleStart, string[] memory _properties, uint256 _referalFee) ERC721(name, symbol) {
        require(_properties.length <= 10, "Wrong number of propirties");
        require(_referalFee < FEE_DECIMALS, "Wrong referalFee");
        referalFee = _referalFee;
        properties = _properties;
        maxNfts = maxNftSupply;
        revealTimestamp = saleStart + (86400 * 9);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    /// @notice Withdraw all ether from contract to owner
    /// @dev Only owner can call this function
    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
    
    /// @notice Set some NFTs aside
    /// @dev Only owner can call this function
    /// @param reserveAmount Reserve NFTs amount for presale 
    function reserveNFTs(uint256 reserveAmount) public onlyOwner {        
        uint256 supply = totalSupply;
        for (uint256 i = 0; i < reserveAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    function setRevealTimestamp(uint256 _revealTimeStamp) public onlyOwner {
        revealTimestamp = _revealTimeStamp;
    } 

    /// @notice Set base URI for NFTs
    /// @dev Only owner can call this function
    /// @param baseURI Base URI that will setted for NFTs
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseUri = baseURI;
    }

    
    /// @notice Pause sale if active, make active if paused
    /// @dev Only owner can call this function
    function toggleSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    
    /// @notice Mints NFTs
    /// @param numberOfTokens Number of the minted NFTS
    /// @param ref Referral for minted NFTs
    function mintNFT(
        uint numberOfTokens, 
        address ref
    ) 
    public 
    payable 
    {
        require(saleIsActive, "Sale must be active to mint NFT");
        uint256 mintIndex = totalSupply;
        require(mintIndex + numberOfTokens <= maxNfts, "Purchase would exceed max supply of NFTs");
        require(numberOfTokens + mintIndex <= maxNfts, "Max NFTs limitation");
        
        for(uint i = 0; i < numberOfTokens; i++) {
            referals[mintIndex] = ref;
            _safeMint(msg.sender, mintIndex+i);
        }

        totalSupply += numberOfTokens;
        // If we haven't set the starting index and this is either 1) the last saleable token or 2) the first token to be sold after
        // the end of pre-sale, set the starting index block
        if (startingIndexBlock == 0 && (totalSupply == maxNfts || block.timestamp >= revealTimestamp)) {
            startingIndexBlock = block.number;
        }

    }

    /// @notice Set the starting index for the collection
    function setStartingIndex() public {
        require(startingIndex == 0, "Starting index is already set");
        require(startingIndexBlock != 0, "Starting index block must be set");
        
        startingIndex = uint(blockhash(startingIndexBlock)) % maxNfts;
        // Just a sanity case in the worst case if this function is called late (EVM only stores last 256 block hashes)
        if (block.number - startingIndexBlock > 255) {
            startingIndex = uint(blockhash(block.number - 1)) % maxNfts;
        }
        // Prevent default sequence
        if (startingIndex == 0) {
            startingIndex += 1;
        }
    }

    /// @notice Set the starting index block for the collection, 
    /// essentially unblocking setting starting index
    /// @dev Only owner can call this function
    function emergencySetStartingIndexBlock() public onlyOwner {
        require(startingIndex == 0, "Starting index is already set");
        
        startingIndexBlock = block.number;
    }

    /// @notice Destroys contract of the collection
    /// @dev Only owner can call this function
    function destroy() external onlyOwner{
        selfdestruct(payable(address(this)));
    }

    /// @notice Update max NFT supply
    /// @dev Only owner can call this function
    /// @param newMaxSupply New NFT max supply
    function updateMaxSupply(uint256 newMaxSupply) public onlyOwner {
        maxNfts = newMaxSupply;
    }

    /// @notice Returns properties of the collection
    /// @return properties List of the properties of the collection
    function getProperties() public view returns(string[] memory){
        return(properties);
    }
}