const { GaiaApi } = require("@chainapsis/cosmosjs/gaia/api");
const { AccAddress } = require("@chainapsis/cosmosjs/common/address");
const { Coin } = require("@chainapsis/cosmosjs/common/coin");
const { MsgSend } = require("@chainapsis/cosmosjs/x/bank");

const {defaultBech32Config} = require("@chainapsis/cosmosjs/core/bech32Config");

window.onload = async () => {
    // Keplr extension injects the wallet provider that is compatible with chainapsis's cosmosJS.
    // You can get this wallet provider from `window.cosmosJSWalletProvider` after load event.
    // If `window.cosmosJSWalletProvider` is null, Keplr extension may be not installed on browser.
    if (!window.cosmosJSWalletProvider) {
        alert("Please install keplr extension");
    }

    // Initialize the gaia api with the wallet provider that is injected by Keplr extension.
    const cosmosJS = new GaiaApi({
        chainId: "secret-1",
        walletProvider: window.cosmosJSWalletProvider,
        rpc: "https://node-secret-1.keplr.app/rpc",
        rest: "https://node-secret-1.keplr.app/rest"
    }, {
        bech32Config: defaultBech32Config("secret")
    });

    // You should request Keplr to enable the wallet.
    // This method will ask the user whether or not to allow access if they haven't visited this website.
    // Also, it will request user to unlock the wallet if the wallet is locked.
    // If you don't request enabling before usage, there is no guarantee that other methods will work.
    await cosmosJS.enable();

    // You can get the address/public keys by `getKeys()` method.
    // It can return the array of address/public key.
    // But, currently, Keplr extension manages only one address/public key pair.
    document.getElementById("address").append((await cosmosJS.getKeys())[0].bech32Address);
};

document.sendForm.onsubmit = () => {
    let recipient = document.sendForm.recipient.value;
    let amount = document.sendForm.amount.value;

    try {
        // Parse bech32 address and validate it.
        recipient = AccAddress.fromBech32(recipient, "secret");
    } catch {
        alert("Invalid bech32 address");
        return false;
    }

    amount = parseFloat(amount);
    if (isNaN(amount)) {
        alert("Invalid amount");
        return false;
    }

    amount *= 1000000;
    amount = Math.floor(amount);

    (async () => {
        // See above.
        const cosmosJS = new GaiaApi({
            chainId: "secret-1",
            walletProvider: window.cosmosJSWalletProvider,
            rpc: "https://node-secret-1.keplr.app/rpc",
            rest: "https://node-secret-1.keplr.app/rest"
        }, {
            bech32Config: defaultBech32Config("secret")
        });

        // See above.
        await cosmosJS.enable();

        // Get the user's key.
        // And, parse bech32 address and validate it.
        const sender = AccAddress.fromBech32((await cosmosJS.getKeys())[0].bech32Address, "secret");

        // Make send message for bank module.
        const msg = new MsgSend(sender, recipient, [new Coin("uscrt", amount)]);

        // Request sending messages.
        // Fee will be set by the Keplr extension.
        // The gas adjustment has not been implemented yet, so please set the gas manually.
        const result = await cosmosJS.sendMsgs([msg], {
            gas: 100000,
            memo: "",
            fee: new Coin("uscrt", 1)
        }, "sync");

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log);
        }

        alert("Succeed to send tx");
    })();

    return false;
};
