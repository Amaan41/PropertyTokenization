// Main App Entry Point
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize web3 helper
    const web3Helper = new Web3Helper();
    const initialized = await web3Helper.init();
    
    if (!initialized) {
        alert('Failed to initialize Web3. Please make sure MetaMask is installed and refresh the page.');
        return;
    }
    
    // Initialize UI handler
    const uiHandler = new UIHandler(web3Helper);
    uiHandler.init();
    
    // Check if already connected to MetaMask
    if (window.ethereum && window.ethereum.selectedAddress) {
        web3Helper.accounts = [window.ethereum.selectedAddress];
        uiHandler.updateUIState(true, window.ethereum.selectedAddress);
    }
    
    // Setup MetaMask account change listener
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                web3Helper.accounts = accounts;
                uiHandler.updateUIState(true, accounts[0]);
            } else {
                web3Helper.accounts = [];
                uiHandler.updateUIState(false);
            }
        });
    }
    
    console.log('PropertyToken DApp initialized');
});