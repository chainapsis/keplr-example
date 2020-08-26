const { SigningCosmosClient, GasPrice } = require("@cosmjs/launchpad");

window.onload = async () => {
    // Keplr extension injects the wallet provider that is compatible with cosmJS.
    // You can get this wallet provider from `window.getCosmJSOnlineSigner(chainId:string, apiUrl: string, broadcastMode: BroadcastMode = BroadcastMode.Block)` after load event.
    // And it also injects the helper function to `window.keplr`.
    // If `window.getCosmJSOnlineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
    if (!window.getCosmJSOnlineSigner || !window.keplr) {
        alert("Please install keplr extension");
    }

    const chainId = "cosmoshub-3";

    // You should request Keplr to enable the wallet.
    // This method will ask the user whether or not to allow access if they haven't visited this website.
    // Also, it will request user to unlock the wallet if the wallet is locked.
    // If you don't request enabling before usage, there is no guarantee that other methods will work.
    await window.keplr.enable(chainId);

    const onlineSigner = window.getCosmJSOnlineSigner(chainId, "https://node-cosmoshub-3.keplr.app/rest");

    // You can get the address/public keys by `getAccounts` method.
    // It can return the array of address/public key.
    // But, currently, Keplr extension manages only one address/public key pair.
    // XXX: This line is needed to set the sender address for SigningCosmosClient.
    const accounts = await onlineSigner.getAccounts();

    console.log(accounts);

    document.getElementById("address").append(accounts[0].address);
};

document.sendForm.onsubmit = () => {
    let recipient = document.sendForm.recipient.value;
    let amount = document.sendForm.amount.value;

    amount = parseFloat(amount);
    if (isNaN(amount)) {
        alert("Invalid amount");
        return false;
    }

    amount *= 1000000;
    amount = Math.floor(amount);

    (async () => {
        // See above.
        const chainId = "cosmoshub-3";
        await window.keplr.enable(chainId);
        const onlineSigner = window.getCosmJSOnlineSigner(chainId, "https://node-cosmoshub-3.keplr.app/rest");

        const accounts = await onlineSigner.getAccounts();

        // Initialize the gaia api with the wallet provider that is injected by Keplr extension.
        const cosmJS = new SigningCosmosClient(
            "https://node-cosmoshub-3.keplr.app/rest",
            accounts[0].address,
            onlineSigner,
        );

        const result = await cosmJS.sendTokens(recipient, [{
            denom: "uatom",
            amount: amount.toString(),
        }]);

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log);
        }

        alert("Succeed to send tx");
    })();

    return false;
};
