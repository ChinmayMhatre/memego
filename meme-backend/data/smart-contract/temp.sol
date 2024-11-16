// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeCoinDistributor is Ownable {
    struct MemeCoin {
        address tokenAddress;
        uint256 totalSupply;
    }

    constructor() Ownable(msg.sender) {
        // Initialize the contract with the deployer as the owner
    }

    MemeCoin[] public memeCoins;
    mapping(address => bool) public isMemeCoinAdded;
    mapping(address => uint256) public memeCoinIndexes;

    event MemeCoinAdded(address indexed tokenAddress, uint256 totalSupply);
    event MemeCoinDistributed(
        address indexed tokenAddress,
        address indexed recipient,
        uint256 amount
    );

    // Debug events
    event Debug(string message, address token, uint256 value);
    event Debug(string message, uint256 value1, uint256 value2);
    event DebugAddress(string message, address addr);
    event DebugString(string message);

    // Add a new meme coin to the system
    function addMemeCoin(
        address tokenAddress,
        uint256 initialSupply
    ) external onlyOwner {
        emit DebugString("Starting addMemeCoin");
        emit Debug("Token and Supply", tokenAddress, initialSupply);

        require(!isMemeCoinAdded[tokenAddress], "Meme coin already added");
        require(tokenAddress != address(0), "Invalid token address");
        
        // Check and transfer tokens first
        ERC20 token = ERC20(tokenAddress);
        
        uint256 senderBalance = token.balanceOf(msg.sender);
        emit Debug("Sender balance", tokenAddress, senderBalance);
        
        uint256 currentAllowance = token.allowance(msg.sender, address(this));
        emit Debug("Current allowance", tokenAddress, currentAllowance);
        
        require(
            senderBalance >= initialSupply,
            "Insufficient token balance"
        );
        require(
            currentAllowance >= initialSupply,
            "Insufficient allowance"
        );
        
        emit DebugString("Starting token transfer");
        // Transfer tokens to this contract
        bool transferSuccess = token.transferFrom(msg.sender, address(this), initialSupply);
        require(transferSuccess, "Token transfer failed");
        
        emit DebugString("Token transfer successful");

        // Add meme coin to tracking
        memeCoinIndexes[tokenAddress] = memeCoins.length;
        memeCoins.push(MemeCoin({
            tokenAddress: tokenAddress,
            totalSupply: initialSupply
        }));
        isMemeCoinAdded[tokenAddress] = true;

        emit DebugString("Meme coin added successfully");
        emit MemeCoinAdded(tokenAddress, initialSupply);
    }

    // Distribute specific meme coins to a user
    function distributeMemeCoin(
        address tokenAddress,
        address recipient,
        uint256 amount
    ) external onlyOwner {
        emit DebugString("Starting distributeMemeCoin");
        emit Debug("Distribution details", tokenAddress, amount);
        emit DebugAddress("Recipient", recipient);

        require(isMemeCoinAdded[tokenAddress], "Meme coin not found");
        require(recipient != address(0), "Invalid recipient address");

        uint256 coinIndex = memeCoinIndexes[tokenAddress];
        emit Debug("Coin index", tokenAddress, coinIndex);

        MemeCoin storage selectedMemeCoin = memeCoins[coinIndex];
        emit Debug("Current total supply", tokenAddress, selectedMemeCoin.totalSupply);

        require(
            selectedMemeCoin.totalSupply >= amount,
            "Insufficient meme coin supply"
        );

        // Check contract's actual token balance
        ERC20 token = ERC20(selectedMemeCoin.tokenAddress);
        uint256 contractBalance = token.balanceOf(address(this));
        emit Debug("Contract balance", tokenAddress, contractBalance);

        require(
            contractBalance >= amount,
            "Insufficient contract balance"
        );

        emit DebugString("Starting token transfer to recipient");
        // Transfer the coins and check for success
        bool success = token.transfer(recipient, amount);
        require(success, "Token transfer failed");

        selectedMemeCoin.totalSupply -= amount;
        emit DebugString("Distribution completed successfully");

        emit MemeCoinDistributed(
            selectedMemeCoin.tokenAddress,
            recipient,
            amount
        );
    }

    // View functions cannot emit events, so we'll remove the events
    function getMemeCoins() external view returns (MemeCoin[] memory) {
        return memeCoins;
    }

    function getMemeCoin(
        address tokenAddress
    ) external view returns (MemeCoin memory) {
        require(isMemeCoinAdded[tokenAddress], "Meme coin not found");
        uint256 coinIndex = memeCoinIndexes[tokenAddress];
        return memeCoins[coinIndex];
    }

    // Add a non-view version for debugging if needed
    function getMemeCoinWithLogs(
        address tokenAddress
    ) external returns (MemeCoin memory) {
        emit Debug("Getting meme coin details", tokenAddress, 0);
        require(isMemeCoinAdded[tokenAddress], "Meme coin not found");
        
        uint256 coinIndex = memeCoinIndexes[tokenAddress];
        emit Debug("Coin index", tokenAddress, coinIndex);
        
        return memeCoins[coinIndex];
    }

    // Other view helper functions
    function getContractBalance(
        address tokenAddress
    ) external view returns (uint256) {
        require(isMemeCoinAdded[tokenAddress], "Meme coin not found");
        ERC20 token = ERC20(tokenAddress);
        return token.balanceOf(address(this));
    }

    function getOwnerBalance(
        address tokenAddress
    ) external view returns (uint256) {
        ERC20 token = ERC20(tokenAddress);
        return token.balanceOf(msg.sender);
    }

    function getAllowance(
        address tokenAddress
    ) external view returns (uint256) {
        ERC20 token = ERC20(tokenAddress);
        return token.allowance(msg.sender, address(this));
    }

    // Emergency view functions
    function getContractAddress() external view returns (address) {
        return address(this);
    }

    function getCurrentBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }
}
