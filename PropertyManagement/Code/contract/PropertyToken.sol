// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PropertyToken
 * @dev Contract for managing real estate property ownership and fractional investments
 */
contract PropertyToken is ERC20, Ownable, ReentrancyGuard {
    // Property struct to store property details
    struct Property {
        uint256 propertyId;
        string propertyAddress;
        string propertyDetails;
        uint256 propertyValue;
        bool isTokenized;
        uint256 tokensIssued;
        address owner;
        mapping(address => bool) authorizedAgents;
    }

    // Property ID counter
    uint256 private _propertyIdCounter;
    
    // Mapping from property ID to Property
    mapping(uint256 => Property) private _properties;
    
    // Mapping from property ID to token price per unit
    mapping(uint256 => uint256) private _tokenPrices;
    
    // Events
    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string propertyAddress);
    event PropertyTokenized(uint256 indexed propertyId, uint256 tokensIssued, uint256 tokenPrice);
    event TokensPurchased(address indexed buyer, uint256 indexed propertyId, uint256 amount);
    event TokensSold(address indexed seller, uint256 indexed propertyId, uint256 amount);
    event PropertyAgentAuthorized(uint256 indexed propertyId, address indexed agent);
    event PropertyAgentRevoked(uint256 indexed propertyId, address indexed agent);
    event EtherReceived(address indexed sender, uint256 amount);
    event TokensListed(uint256 indexed propertyId, uint256 tokenAmount);
    event DebugValues(uint256 pricePerToken, uint256 amountRequested, uint256 calculatedCost, uint256 msgValue);


    
    /**
     * @dev Constructor for PropertyToken
     * @param name Name of the token
     * @param symbol Symbol of the token
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        _propertyIdCounter = 1;
    }
    
    /**
     * @dev Receive function to allow contract to receive ETH
     */
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }
    
    /**
     * @dev Fallback function to allow contract to receive ETH when function signature doesn't match
     */
    fallback() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }
    
    /**
     * @dev Register a new property
     * @param propertyAddress Physical address of the property
     * @param propertyDetails Additional details of the property
     * @param propertyValue Value of the property in wei
     * @return ID of the registered property
     */
    function registerProperty(
        string memory propertyAddress,
        string memory propertyDetails,
        uint256 propertyValue
    ) public returns (uint256) {
        uint256 propertyId = _propertyIdCounter;
        
        Property storage newProperty = _properties[propertyId];
        newProperty.propertyId = propertyId;
        newProperty.propertyAddress = propertyAddress;
        newProperty.propertyDetails = propertyDetails;
        newProperty.propertyValue = propertyValue;
        newProperty.isTokenized = false;
        newProperty.tokensIssued = 0;
        newProperty.owner = msg.sender;
        
        _propertyIdCounter++;
        
        emit PropertyRegistered(propertyId, msg.sender, propertyAddress);
        
        return propertyId;
    }
    
    /**
     * @dev Tokenize a property to enable fractional ownership
     * @param propertyId ID of the property to tokenize
     * @param tokenSupply Number of tokens to issue for the property
     * @param tokenPrice Price per token in wei
     */
    function tokenizeProperty(
        uint256 propertyId,
        uint256 tokenSupply,
        uint256 tokenPrice
    ) public {
        require(_properties[propertyId].owner == msg.sender, "Only property owner can tokenize");
        require(!_properties[propertyId].isTokenized, "Property already tokenized");
        require(tokenSupply > 0, "Token supply must be greater than 0");
        require(tokenPrice > 0, "Token price must be greater than 0");
        
        Property storage property = _properties[propertyId];
        property.isTokenized = true;
        property.tokensIssued = tokenSupply;
        
        _tokenPrices[propertyId] = tokenPrice;
        
        // Mint tokens to the property owner
        _mint(msg.sender, tokenSupply);
        
        emit PropertyTokenized(propertyId, tokenSupply, tokenPrice);
    }
    
    /**
     * @dev Purchase tokens of a property
     * @param propertyId ID of the property
     * @param tokenAmount Number of tokens to purchase
     */

    function purchaseTokens(uint256 propertyId, uint256 tokenAmount) public payable nonReentrant {
    Property storage property = _properties[propertyId];
    require(property.isTokenized, "Property not tokenized");
    
    uint256 tokenPrice = _tokenPrices[propertyId];
    uint256 totalCost = tokenPrice * tokenAmount;
    emit DebugValues(tokenPrice, tokenAmount, totalCost, msg.value);

    require(msg.value >= totalCost, "Insufficient payment");
    require(tokensForSale[propertyId] >= tokenAmount, "Not enough tokens listed for sale");
    
    // Reduce the tokens listed
    tokensForSale[propertyId] -= tokenAmount;

    // Transfer tokens from owner to buyer
    _transfer(property.owner, msg.sender, tokenAmount);  // or from contract if escrowed

    // Transfer payment to owner
    (bool sent, ) = payable(property.owner).call{value: totalCost}("");
    require(sent, "Failed to send Ether to property owner");

    // Refund any excess payment
    if (msg.value > totalCost) {
        (bool refundSent, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
        require(refundSent, "Failed to refund excess Ether");
    }

    emit TokensPurchased(msg.sender, propertyId, tokenAmount);
}

    // propertyId => tokens available for sale
    mapping(uint256 => uint256) public tokensForSale;
    
    function listTokensForSale(uint256 propertyId, uint256 tokenAmount) public {
    Property storage property = _properties[propertyId];
    require(property.owner == msg.sender, "Only property owner can list tokens");
    require(balanceOf(msg.sender) >= tokenAmount, "Not enough tokens to list");

    tokensForSale[propertyId] += tokenAmount;

    emit TokensListed(propertyId, tokenAmount);
}


    
    /**
     * @dev Sell tokens back to the property owner
     * @param propertyId ID of the property
     * @param tokenAmount Number of tokens to sell
     */
    
    /**
     * @dev Allow property owners to fund the contract for token buybacks
     */
    function fundBuybacks(uint256 propertyId) public payable {
        require(_properties[propertyId].owner == msg.sender, "Only property owner can fund buybacks");
        require(msg.value > 0, "Must send some Ether");
        
        // No need to store funds separately, they go to the contract's balance
        emit EtherReceived(msg.sender, msg.value);
    }
    
    /**
     * @dev Authorize an agent for a property
     * @param propertyId ID of the property
     * @param agent Address of the agent
     */
    function authorizeAgent(uint256 propertyId, address agent) public {
        require(_properties[propertyId].owner == msg.sender, "Only property owner can authorize agents");
        require(agent != address(0), "Invalid agent address");
        
        _properties[propertyId].authorizedAgents[agent] = true;
        
        emit PropertyAgentAuthorized(propertyId, agent);
    }
    
    /**
     * @dev Revoke authorization for an agent
     * @param propertyId ID of the property
     * @param agent Address of the agent
     */
    function revokeAgent(uint256 propertyId, address agent) public {
        require(_properties[propertyId].owner == msg.sender, "Only property owner can revoke agents");
        
        _properties[propertyId].authorizedAgents[agent] = false;
        
        emit PropertyAgentRevoked(propertyId, agent);
    }
    
    /**
     * @dev Check if an address is authorized for a property
     * @param propertyId ID of the property
     * @param agent Address to check
     * @return true if the address is an authorized agent
     */
    function isAuthorizedAgent(uint256 propertyId, address agent) public view returns (bool) {
        return _properties[propertyId].authorizedAgents[agent];
    }
    
    /**
     * @dev Get property details
     * @param propertyId ID of the property
     * @return propertyAddress Address of the property
     * @return propertyDetails Details of the property
     * @return propertyValue Value of the property
     * @return isTokenized Whether the property is tokenized
     * @return tokensIssued Number of tokens issued for the property
     * @return owner Owner of the property
     */
    function getPropertyDetails(uint256 propertyId) public view returns (
        string memory propertyAddress,
        string memory propertyDetails,
        uint256 propertyValue,
        bool isTokenized,
        uint256 tokensIssued,
        address owner
    ) {
        Property storage property = _properties[propertyId];
        return (
            property.propertyAddress,
            property.propertyDetails,
            property.propertyValue,
            property.isTokenized,
            property.tokensIssued,
            property.owner
        );
    }
    
    /**
     * @dev Get token price for a property
     * @param propertyId ID of the property
     * @return Price per token in wei
     */
    function getTokenPrice(uint256 propertyId) public view returns (uint256) {
        return _tokenPrices[propertyId];
    }
    
    /**
     * @dev Update token price for a property
     * @param propertyId ID of the property
     * @param newPrice New price per token in wei
     */
    function updateTokenPrice(uint256 propertyId, uint256 newPrice) public {
        require(_properties[propertyId].owner == msg.sender, "Only property owner can update price");
        require(newPrice > 0, "Token price must be greater than 0");
        
        _tokenPrices[propertyId] = newPrice;
    }
    
    /**
     * @dev Get contract balance
     * @return Contract balance in wei
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}