const { GaiaApi } = require("@chainapsis/cosmosjs/gaia/api");
const { AccAddress } = require("@chainapsis/cosmosjs/common/address");
const { Coin } = require("@chainapsis/cosmosjs/common/coin");
const { MsgSend } = require("@chainapsis/cosmosjs/x/bank");

const { defaultBech32Config } = require("@chainapsis/cosmosjs/core/bech32Config");

const { SigningCosmWasmClient, encodeSecp256k1Signature } = require("secretjs");

function singleAmount(amount, denom) {
    return [{ amount: amount.toString(), denom: denom }];
}

let senderAddress;
let senderPubKey;

window.onload = async () => {
    // Keplr extension injects the wallet provider that is compatible with chainapsis's cosmosJS.
    // You can get this wallet provider from `window.cosmosJSWalletProvider` after load event.
    // If `window.cosmosJSWalletProvider` is null, Keplr extension may be not installed on browser.
    if (!window.cosmosJSWalletProvider) {
        alert("Please install keplr extension");
    }

    if (!window.getEnigmaUtils) {
        alert("Please use latest version of Keplr extension")
    }

    // Initialize the gaia api with the wallet provider that is injected by Keplr extension.
    const cosmosJS = new GaiaApi({
        chainId: "holodeck",
        walletProvider: window.cosmosJSWalletProvider,
        rpc: "http://bootstrap.secrettestnet.io:26657",
        rest: "https://bootstrap.secrettestnet.io"
    },{
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
    senderAddress = (await cosmosJS.getKeys())[0].bech32Address;
    senderPubKey = (await cosmosJS.getKeys())[0].pubKey;
    document.getElementById("address").append(senderAddress);
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
        const secretJS = new SigningCosmWasmClient(
            "https://bootstrap.secrettestnet.io",
            senderAddress,
            async (signBytes) => {
                return encodeSecp256k1Signature(senderPubKey, await window.cosmosJSWalletProvider.sign({
                    get: () => {
                        return "holodeck"
                    },
                }, senderAddress, signBytes));
            },
            undefined,
            {
                upload: {
                    amount: singleAmount(250000, "uscrt"),
                    gas: "1000000", // one million
                },
                init: {
                    amount: singleAmount(125000, "uscrt"),
                    gas: "500000", // 500k
                },
                exec: {
                    amount: singleAmount(50000, "uscrt"),
                    gas: "200000", // 200k
                },
                send: {
                    amount: singleAmount(20000, "uscrt"),
                    gas: "80000", // 80k
                },
            }
        );
        // It is neccessary to inject the logic that communicates with Keplr extension for encryting/decryting.
        // If webpage uses the their own seed for encryting/decryting, it is impossible to let Keplr extension decryting the transaction's msg for executing Secret-wasm.
        // Currently, secretjs doesn't permit to use the custom enigma utils. So, for now, just injecting the Keplr's enigma utils by force.
        secretJS.restClient.enigmautils = window.getEnigmaUtils("holodeck");

        // Request sending messages.
        // Fee will be set by the Keplr extension.
        // The gas adjustment has not been implemented yet, so please set the gas manually.
        const result = await secretJS.execute(
            "secret1w3nk6t3ppvkxsvyc4fx2zjdds2jvxrqm3afz34",
            {
                transfer: {
                    recipient: recipient.toBech32(),
                    amount: amount.toString(),
                }
            }
        );

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log);
        }

        console.log(result);

        alert("Succeed to send tx");
    })();

    return false;
};
