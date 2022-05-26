// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title MoonNFT a Project to mint and drop in opensea rinkeby
/// @author filipeVenancio  
/// @notice this was created for a job interview
/// @dev still under development
contract MoonNFT is ERC721, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost;
    uint256 public maxSupply;
    uint256[] private _allTokens;
    uint256 public maxMintAmount = 1;

    // Mapping owner address to token count
    mapping(address => uint256) private balances;

    /// @notice When the contract goes live the constructor will be the 1st to run
    /// It takes 2 fixed values: Name and Symbol 
    constructor(string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;

        setBaseURI(_initBaseURI);
    }    

    /// @notice _baseURI - The URL where the images will be stored
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    function balance(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    // public
    function mint(uint256 _mintAmount) public payable {
        require(balanceOf(msg.sender) == 0, "Only 1 mint per account");
        uint256 supply = totalSupply();
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        if (msg.sender != owner()) {
            require(msg.value >= cost * _mintAmount);
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
            balances[msg.sender] += 1;
            _allTokens.push(supply + i);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }
}
