// UI Handler Functions
class UIHandler {
    constructor(web3Helper) {
        this.web3Helper = web3Helper;
        this.txModal = new bootstrap.Modal(document.getElementById('txModal'));
        this.errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    }

    // Initialize UI elements and event listeners
    init() {
        this.initializeEventListeners();
        this.updateUIState(false);
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Connect wallet button
        document.getElementById('connect-wallet').addEventListener('click', () => this.connectWallet());
        
        // Register property form
        document.getElementById('register-property-form').addEventListener('submit', (e) => this.handleRegisterProperty(e));
        
        // Tokenize property form
        document.getElementById('tokenize-property-form').addEventListener('submit', (e) => this.handleTokenizeProperty(e));
        
        // List tokens form
        document.getElementById('list-tokens-form').addEventListener('submit', (e) => this.handleListTokens(e));
        
        // Buy tokens form
        document.getElementById('buy-tokens-form').addEventListener('submit', (e) => this.handleBuyTokens(e));
        
        // Load property details button
        document.getElementById('load-property-details').addEventListener('click', () => this.loadPropertyDetails());
        
        // Token amount input for calculating cost
        document.getElementById('buy-token-amount').addEventListener('input', () => this.calculateTotalCost());
        document.getElementById('buy-property-id').addEventListener('change', () => this.resetBuyForm());
        
        // Load my properties button
        document.getElementById('load-my-properties').addEventListener('click', () => this.loadMyProperties());
        
        // Update token price form
        document.getElementById('update-price-form').addEventListener('submit', (e) => this.handleUpdatePrice(e));
        
        // Fund buybacks form
        document.getElementById('fund-buybacks-form').addEventListener('submit', (e) => this.handleFundBuybacks(e));
        
        // Agent management buttons
        document.getElementById('check-agent').addEventListener('click', () => this.checkAgentStatus());
        document.getElementById('authorize-agent').addEventListener('click', () => this.handleAuthorizeAgent());
        document.getElementById('revoke-agent').addEventListener('click', () => this.handleRevokeAgent());
    }

    // Update UI state based on wallet connection
    updateUIState(isConnected, account = '') {
        const connectButton = document.getElementById('connect-wallet');
        const walletStatus = document.getElementById('wallet-status');
        
        if (isConnected) {
            connectButton.textContent = 'Connected';
            connectButton.disabled = true;
            connectButton.classList.remove('btn-outline-light');
            connectButton.classList.add('btn-success');
            
            walletStatus.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            walletStatus.classList.add('connected');
            
            this.updateBalances();
        } else {
            connectButton.textContent = 'Connect Wallet';
            connectButton.disabled = false;
            connectButton.classList.add('btn-outline-light');
            connectButton.classList.remove('btn-success');
            
            walletStatus.textContent = 'Not connected';
            walletStatus.classList.remove('connected');
        }
    }

    // Update token and contract balances
    async updateBalances() {
        try {
            const tokenBalance = await this.web3Helper.getTokenBalance();
            const contractBalance = await this.web3Helper.getContractBalance();
            
            document.getElementById('token-balance').textContent = tokenBalance;
            document.getElementById('contract-balance').textContent = contractBalance;
        } catch (error) {
            console.error("Error updating balances:", error);
        }
    }

    // Connect wallet handler
    async connectWallet() {
        try {
            const account = await this.web3Helper.connectWallet();
            this.updateUIState(true, account);
        } catch (error) {
            this.showError("Failed to connect wallet: " + error.message);
        }
    }

    // Handle register property form submission
    async handleRegisterProperty(e) {
        e.preventDefault();
        
        const address = document.getElementById('property-address').value;
        const details = document.getElementById('property-details').value;
        const value = document.getElementById('property-value').value;
        
        this.showTransactionModal("Registering property...");
        
        try {
            const result = await this.web3Helper.registerProperty(address, details, value);
            result.propertyId = 1;
            this.updateTransactionStatus(
                "Property registered successfully!",
                `Transaction hash: ${result.transactionHash}<br>Property ID: ${result.propertyId}`
            );
            result.propertyId+=1;
            document.getElementById('register-property-form').reset();
            this.updateBalances();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to register property: " + error.message);
        }
    }

    // Handle tokenize property form submission
    async handleTokenizeProperty(e) {
        e.preventDefault();
        
        const propertyId = document.getElementById('tokenize-property-id').value;
        const tokenSupply = document.getElementById('token-supply').value;
        const tokenPrice = document.getElementById('token-price').value;
        
        this.showTransactionModal("Tokenizing property...");
        
        try {
            const result = await this.web3Helper.tokenizeProperty(propertyId, tokenSupply, tokenPrice);
            this.updateTransactionStatus(
                "Property tokenized successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            document.getElementById('tokenize-property-form').reset();
            this.updateBalances();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to tokenize property: " + error.message);
        }
    }

    // Handle list tokens form submission
    async handleListTokens(e) {
        e.preventDefault();
        
        const propertyId = document.getElementById('list-property-id').value;
        const tokenAmount = document.getElementById('list-token-amount').value;
        
        this.showTransactionModal("Listing tokens for sale...");
        
        try {
            const result = await this.web3Helper.listTokensForSale(propertyId, tokenAmount);
            this.updateTransactionStatus(
                "Tokens listed for sale successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            document.getElementById('list-tokens-form').reset();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to list tokens: " + error.message);
        }
    }

    // Load property details
    async loadPropertyDetails() {
        const propertyId = document.getElementById('buy-property-id').value;
        if (!propertyId) {
            this.showError("Please enter a property ID");
            return;
        }
        
        try {
            const details = await this.web3Helper.getPropertyDetails(propertyId);
            
            document.getElementById('detail-property-address').textContent = details.propertyAddress;
            document.getElementById('detail-property-details').textContent = details.propertyDetails;
            document.getElementById('detail-property-value').textContent = details.propertyValue;
            document.getElementById('detail-is-tokenized').textContent = details.isTokenized ? 'Yes' : 'No';
            document.getElementById('detail-tokens-issued').textContent = details.tokensIssued;
            document.getElementById('detail-token-price').textContent = details.tokenPrice;
            document.getElementById('detail-tokens-for-sale').textContent = details.tokensForSale;
            document.getElementById('detail-owner').textContent = 
                `${details.owner.substring(0, 6)}...${details.owner.substring(details.owner.length - 4)}`;
            
            const detailsContainer = document.getElementById('property-details-container');
            detailsContainer.classList.remove('d-none');
            setTimeout(() => detailsContainer.classList.add('show'), 10);
            
            // Store the token price for calculations
            document.getElementById('buy-token-amount').dataset.price = details.tokenPrice;
            this.calculateTotalCost();
            
        } catch (error) {
            this.showError("Error loading property details: " + error.message);
        }
    }

    // Reset buy form when property ID changes
    resetBuyForm() {
        const detailsContainer = document.getElementById('property-details-container');
        detailsContainer.classList.remove('show');
        setTimeout(() => detailsContainer.classList.add('d-none'), 300);
        
        document.getElementById('buy-token-amount').value = '';
        document.getElementById('total-eth-cost').value = '';
    }

    // Calculate total cost when buying tokens
    calculateTotalCost() {
        const tokenAmount = document.getElementById('buy-token-amount').value;
        const tokenPrice = document.getElementById('buy-token-amount').dataset.price;
        
        if (tokenAmount && tokenPrice) {
            const totalCost = (parseFloat(tokenAmount) * parseFloat(tokenPrice)).toFixed(8);
            document.getElementById('total-eth-cost').value = totalCost;
        } else {
            document.getElementById('total-eth-cost').value = '';
        }
    }

    // Handle buy tokens form submission
    async handleBuyTokens(e) {
        e.preventDefault();
        
        const propertyId = document.getElementById('buy-property-id').value;
        const tokenAmount = document.getElementById('buy-token-amount').value;
        const totalCost = document.getElementById('total-eth-cost').value;
        
        if (!propertyId || !tokenAmount || !totalCost) {
            this.showError("Please fill all fields and load property details first");
            return;
        }
        
        this.showTransactionModal("Purchasing tokens...");
        
        try {
            const result = await this.web3Helper.purchaseTokens(propertyId, tokenAmount, totalCost);
            this.updateTransactionStatus(
                "Tokens purchased successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            document.getElementById('buy-tokens-form').reset();
            this.resetBuyForm();
            this.updateBalances();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to purchase tokens: " + error.message);
        }
    }

    // Load properties owned by current user
    async loadMyProperties() {
        try {
            const properties = await this.web3Helper.findMyProperties();
            const tableBody = document.getElementById('my-properties-table');
            
            // Clear existing rows
            tableBody.innerHTML = '';
            
            if (properties.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 6;
                cell.textContent = "You don't own any properties yet";
                cell.classList.add('text-center');
                return;
            }
            
            // Add rows for each property
            properties.forEach(property => {
                const row = tableBody.insertRow();
                
                // Property ID
                const idCell = row.insertCell();
                idCell.textContent = property.id;
                
                // Property Address
                const addressCell = row.insertCell();
                addressCell.textContent = property.address;
                
                // Property Value
                const valueCell = row.insertCell();
                valueCell.textContent = property.value + ' ETH';
                
                // Tokenized Status
                const tokenizedCell = row.insertCell();
                tokenizedCell.textContent = property.isTokenized ? 'Yes' : 'No';
                
                // Tokens For Sale
                const tokensCell = row.insertCell();
                tokensCell.textContent = property.tokensForSale;
                
                // Actions
                const actionsCell = row.insertCell();
                if (property.isTokenized) {
                    const priceText = document.createElement('small');
                    priceText.textContent = `Token Price: ${property.tokenPrice} ETH`;
                    priceText.classList.add('d-block', 'mb-1');
                    actionsCell.appendChild(priceText);
                    
                    const updateBtn = document.createElement('button');
                    updateBtn.textContent = 'Update Price';
                    updateBtn.classList.add('btn', 'btn-sm', 'btn-outline-primary', 'me-1');
                    updateBtn.addEventListener('click', () => {
                        document.getElementById('update-property-id').value = property.id;
                        document.getElementById('new-token-price').value = property.tokenPrice;
                        document.querySelector('#propertyTabs button[data-bs-target="#manage"]').click();
                        document.getElementById('new-token-price').focus();
                    });
                    actionsCell.appendChild(updateBtn);
                } else {
                    const tokenizeBtn = document.createElement('button');
                    tokenizeBtn.textContent = 'Tokenize';
                    tokenizeBtn.classList.add('btn', 'btn-sm', 'btn-outline-success');
                    tokenizeBtn.addEventListener('click', () => {
                        document.getElementById('tokenize-property-id').value = property.id;
                        document.querySelector('#propertyTabs button[data-bs-target="#tokenize"]').click();
                        document.getElementById('token-supply').focus();
                    });
                    actionsCell.appendChild(tokenizeBtn);
                }
            });
            
        } catch (error) {
            this.showError("Error loading your properties: " + error.message);
        }
    }

    // Handle update token price form submission
    async handleUpdatePrice(e) {
        e.preventDefault();
        
        const propertyId = document.getElementById('update-property-id').value;
        const newPrice = document.getElementById('new-token-price').value;
        
        this.showTransactionModal("Updating token price...");
        
        try {
            const result = await this.web3Helper.updateTokenPrice(propertyId, newPrice);
            this.updateTransactionStatus(
                "Token price updated successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            document.getElementById('update-price-form').reset();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to update token price: " + error.message);
        }
    }

    // Handle fund buybacks form submission
    async handleFundBuybacks(e) {
        e.preventDefault();
        
        const propertyId = document.getElementById('fund-property-id').value;
        const amount = document.getElementById('fund-amount').value;
        
        this.showTransactionModal("Funding buybacks...");
        
        try {
            const result = await this.web3Helper.fundBuybacks(propertyId, amount);
            this.updateTransactionStatus(
                "Buybacks funded successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            document.getElementById('fund-buybacks-form').reset();
            this.updateBalances();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to fund buybacks: " + error.message);
        }
    }

    // Check agent authorization status
    async checkAgentStatus() {
        const propertyId = document.getElementById('agent-property-id').value;
        const agentAddress = document.getElementById('agent-address').value;
        
        if (!propertyId || !agentAddress) {
            this.showError("Please enter property ID and agent address");
            return;
        }
        
        try {
            const isAuthorized = await this.web3Helper.isAuthorizedAgent(propertyId, agentAddress);
            const statusDisplay = document.getElementById('agent-status-display');
            
            if (isAuthorized) {
                statusDisplay.textContent = 'Authorized';
                statusDisplay.className = 'badge bg-success';
            } else {
                statusDisplay.textContent = 'Not Authorized';
                statusDisplay.className = 'badge bg-danger';
            }
        } catch (error) {
            this.showError("Error checking agent status: " + error.message);
        }
    }

    // Handle authorize agent button click
    async handleAuthorizeAgent() {
        const propertyId = document.getElementById('agent-property-id').value;
        const agentAddress = document.getElementById('agent-address').value;
        
        if (!propertyId || !agentAddress) {
            this.showError("Please enter property ID and agent address");
            return;
        }
        
        this.showTransactionModal("Authorizing agent...");
        
        try {
            const result = await this.web3Helper.authorizeAgent(propertyId, agentAddress);
            this.updateTransactionStatus(
                "Agent authorized successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            await this.checkAgentStatus();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to authorize agent: " + error.message);
        }
    }

    // Handle revoke agent button click
    async handleRevokeAgent() {
        const propertyId = document.getElementById('agent-property-id').value;
        const agentAddress = document.getElementById('agent-address').value;
        
        if (!propertyId || !agentAddress) {
            this.showError("Please enter property ID and agent address");
            return;
        }
        
        this.showTransactionModal("Revoking agent...");
        
        try {
            const result = await this.web3Helper.revokeAgent(propertyId, agentAddress);
            this.updateTransactionStatus(
                "Agent revoked successfully!",
                `Transaction hash: ${result.transactionHash}`
            );
            await this.checkAgentStatus();
        } catch (error) {
            this.hideTransactionModal();
            this.showError("Failed to revoke agent: " + error.message);
        }
    }

    // Show transaction processing modal
    showTransactionModal(message = "Processing transaction...") {
        document.querySelector('#tx-status p').textContent = message;
        document.querySelector('#tx-details').innerHTML = '';
        document.querySelector('#tx-status .spinner-border').style.display = 'inline-block';
        this.txModal.show();
    }

    // Update transaction status in modal
    updateTransactionStatus(message, details = '') {
        document.querySelector('#tx-status p').textContent = message;
        document.querySelector('#tx-details').innerHTML = details;
        document.querySelector('#tx-status .spinner-border').style.display = 'none';
    }

    // Hide transaction modal
    hideTransactionModal() {
        this.txModal.hide();
    }

    // Show error modal
    showError(message) {
        document.getElementById('error-message').textContent = message;
        this.errorModal.show();
    }
}