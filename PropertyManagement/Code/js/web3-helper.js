// Web3 Helper Functions
class Web3Helper {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.contractAddress = '0xF9732FB5755AB4E3FD00a5d137F96D0e5E2693f0';
        this.accounts = [];
        this.chainId = null;

        // Contract ABI - this is just a placeholder, you'll need to replace it with your actual ABI from Remix
        this.contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "agent",
                        "type": "address"
                    }
                ],
                "name": "authorizeAgent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "symbol",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "allowance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "needed",
                        "type": "uint256"
                    }
                ],
                "name": "ERC20InsufficientAllowance",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "balance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "needed",
                        "type": "uint256"
                    }
                ],
                "name": "ERC20InsufficientBalance",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "approver",
                        "type": "address"
                    }
                ],
                "name": "ERC20InvalidApprover",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    }
                ],
                "name": "ERC20InvalidReceiver",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "ERC20InvalidSender",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "ERC20InvalidSpender",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "OwnableInvalidOwner",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "OwnableUnauthorizedAccount",
                "type": "error"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "pricePerToken",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amountRequested",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "calculatedCost",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "msgValue",
                        "type": "uint256"
                    }
                ],
                "name": "DebugValues",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "EtherReceived",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    }
                ],
                "name": "fundBuybacks",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenAmount",
                        "type": "uint256"
                    }
                ],
                "name": "listTokensForSale",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "agent",
                        "type": "address"
                    }
                ],
                "name": "PropertyAgentAuthorized",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "agent",
                        "type": "address"
                    }
                ],
                "name": "PropertyAgentRevoked",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "propertyAddress",
                        "type": "string"
                    }
                ],
                "name": "PropertyRegistered",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "tokensIssued",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "tokenPrice",
                        "type": "uint256"
                    }
                ],
                "name": "PropertyTokenized",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenAmount",
                        "type": "uint256"
                    }
                ],
                "name": "purchaseTokens",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "propertyAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "propertyDetails",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "propertyValue",
                        "type": "uint256"
                    }
                ],
                "name": "registerProperty",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "agent",
                        "type": "address"
                    }
                ],
                "name": "revokeAgent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenSupply",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenPrice",
                        "type": "uint256"
                    }
                ],
                "name": "tokenizeProperty",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "tokenAmount",
                        "type": "uint256"
                    }
                ],
                "name": "TokensListed",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "TokensPurchased",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "TokensSold",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "newPrice",
                        "type": "uint256"
                    }
                ],
                "name": "updateTokenPrice",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getContractBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    }
                ],
                "name": "getPropertyDetails",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "propertyAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "propertyDetails",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "propertyValue",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isTokenized",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokensIssued",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    }
                ],
                "name": "getTokenPrice",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "propertyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "agent",
                        "type": "address"
                    }
                ],
                "name": "isAuthorizedAgent",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "tokensForSale",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    }

    // Initialize Web3
    async init() {
        if (window.ethereum) {
            try {
                this.web3 = new Web3(window.ethereum);
                this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
                this.chainId = await this.web3.eth.getChainId();
                return true;
            } catch (error) {
                console.error("Failed to initialize Web3:", error);
                return false;
            }
        } else {
            console.error("MetaMask is not installed");
            return false;
        }
    }

    // Connect to MetaMask
    async connectWallet() {
        if (!this.web3) {
            await this.init();
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.accounts = accounts;

            // Setup event listeners for account/chain changes
            window.ethereum.on('accountsChanged', (accounts) => {
                this.accounts = accounts;
                window.location.reload();
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            return accounts[0];
        } catch (error) {
            console.error("User denied account access", error);
            throw new Error("User denied account access");
        }
    }

    // Get current connected account
    getCurrentAccount() {
        return this.accounts.length > 0 ? this.accounts[0] : null;
    }

    // Convert ETH to Wei
    toWei(ethAmount) {
        return this.web3.utils.toWei(ethAmount.toString(), 'ether');
    }

    // Convert Wei to ETH
    toEth(weiAmount) {
        return this.web3.utils.fromWei(weiAmount.toString(), 'ether');
    }

    // Get user's token balance
    async getTokenBalance() {
        const account = this.getCurrentAccount();
        if (!account) return '0';

        try {
            const balance = await this.contract.methods.balanceOf(account).call();
            return balance;
        } catch (error) {
            console.error("Error getting token balance:", error);
            return '0';
        }
    }

    // Get contract ETH balance
    async getContractBalance() {
        try {
            const balance = await this.contract.methods.getContractBalance().call();
            return this.toEth(balance);
        } catch (error) {
            console.error("Error getting contract balance:", error);
            return '0';
        }
    }

    // Register a new property
    async registerProperty(address, details, valueInEth) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        const valueInWei = this.toWei(valueInEth);

        try {
            const tx = await this.contract.methods.registerProperty(address, details, valueInWei)
                .send({ from: account });

            // Extract property ID from the event logs
            const propertyId = 1;
            return {
                transactionHash: tx.transactionHash,
                propertyId: propertyId
            };
            propertyId=propertyId+1;
        } catch (error) {
            console.error("Error registering property:", error);
            throw error;
        }
    }

    // Helper to find property ID from event logs
    findPropertyIdFromLogs(logs) {
        // This is a simplified implementation - in production you'd use proper event decoding
        // For simplicity, we're just returning the transaction index + 1 as the property ID
        return logs && logs.length > 0
            ? parseInt(logs[0].topics[1], 16)
            : null;
    }

    // Tokenize a property
    async tokenizeProperty(propertyId, tokenSupply, priceInEth) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        const priceInWei = this.toWei(priceInEth);

        try {
            const tx = await this.contract.methods.tokenizeProperty(propertyId, tokenSupply, priceInWei)
                .send({ from: account });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error tokenizing property:", error);
            throw error;
        }
    }

    // List tokens for sale
    async listTokensForSale(propertyId, tokenAmount) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        try {
            const tx = await this.contract.methods.listTokensForSale(propertyId, tokenAmount)
                .send({ from: account });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error listing tokens for sale:", error);
            throw error;
        }
    }

    // Purchase tokens
    async purchaseTokens(propertyId, tokenAmount, totalCostInEth) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        const valueInWei = this.toWei(totalCostInEth);

        try {
            const tx = await this.contract.methods.purchaseTokens(propertyId, tokenAmount)
                .send({ from: account, value: valueInWei });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error purchasing tokens:", error);
            throw error;
        }
    }

    // Get property details
    async getPropertyDetails(propertyId) {
        try {
            const details = await this.contract.methods.getPropertyDetails(propertyId).call();
            const tokenPrice = await this.contract.methods.getTokenPrice(propertyId).call();
            const tokensForSale = await this.contract.methods.tokensForSale(propertyId).call();

            return {
                propertyAddress: details.propertyAddress,
                propertyDetails: details.propertyDetails,
                propertyValue: this.toEth(details.propertyValue),
                isTokenized: details.isTokenized,
                tokensIssued: details.tokensIssued,
                owner: details.owner,
                tokenPrice: this.toEth(tokenPrice),
                tokensForSale: tokensForSale
            };
        } catch (error) {
            console.error("Error getting property details:", error);
            throw error;
        }
    }

    // Update token price
    async updateTokenPrice(propertyId, newPriceInEth) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        const priceInWei = this.toWei(newPriceInEth);

        try {
            const tx = await this.contract.methods.updateTokenPrice(propertyId, priceInWei)
                .send({ from: account });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error updating token price:", error);
            throw error;
        }
    }

    // Fund buybacks
    async fundBuybacks(propertyId, amountInEth) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        const valueInWei = this.toWei(amountInEth);

        try {
            const tx = await this.contract.methods.fundBuybacks(propertyId)
                .send({ from: account, value: valueInWei });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error funding buybacks:", error);
            throw error;
        }
    }

    // Authorize agent
    async authorizeAgent(propertyId, agentAddress) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        try {
            const tx = await this.contract.methods.authorizeAgent(propertyId, agentAddress)
                .send({ from: account });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error authorizing agent:", error);
            throw error;
        }
    }

    // Revoke agent
    async revokeAgent(propertyId, agentAddress) {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        try {
            const tx = await this.contract.methods.revokeAgent(propertyId, agentAddress)
                .send({ from: account });

            return {
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            console.error("Error revoking agent:", error);
            throw error;
        }
    }

    // Check if address is authorized agent
    async isAuthorizedAgent(propertyId, agentAddress) {
        try {
            const isAuthorized = await this.contract.methods.isAuthorizedAgent(propertyId, agentAddress).call();
            return isAuthorized;
        } catch (error) {
            console.error("Error checking agent status:", error);
            throw error;
        }
    }

    // Find properties owned by current user
    async findMyProperties() {
        const account = this.getCurrentAccount();
        if (!account) throw new Error("No account connected");

        // This is a simplified approach - in a real-world scenario, you would have a server-side
        // component to index properties by owner or use contract events to build this list
        const properties = [];
        let propertyId = 1;
        let failCount = 0;

        // Try up to 100 property IDs (adjust based on expected number of properties)
        while (propertyId <= 100 && failCount < 5) {
            try {
                const details = await this.contract.methods.getPropertyDetails(propertyId).call();
                if (details.owner.toLowerCase() === account.toLowerCase()) {
                    const tokenPrice = await this.contract.methods.getTokenPrice(propertyId).call();
                    const tokensForSale = await this.contract.methods.tokensForSale(propertyId).call();

                    properties.push({
                        id: propertyId,
                        address: details.propertyAddress,
                        details: details.propertyDetails,
                        value: this.toEth(details.propertyValue),
                        isTokenized: details.isTokenized,
                        tokensIssued: details.tokensIssued,
                        tokenPrice: this.toEth(tokenPrice),
                        tokensForSale: tokensForSale
                    });
                }
                propertyId++;
                failCount = 0; // Reset fail count on success
            } catch (error) {
                failCount++;
                propertyId++;
                console.log(`Checking property ${propertyId} failed, continuing search...`);
            }
        }

        return properties;
    }
}
