const { GaiaApi } = require("@chainapsis/cosmosjs/gaia/api");
const { AccAddress } = require("@chainapsis/cosmosjs/common/address");
const { Coin } = require("@chainapsis/cosmosjs/common/coin");
const { MsgExecuteContract } = require("@chainapsis/cosmosjs/x/wasm");

const { defaultBech32Config } = require("@chainapsis/cosmosjs/core/bech32Config");

const cw20ContractAddress = "coral18vd8fpwxzck93qlwghaj6arh4p7c5n89du58z4";

window.onload = async () => {
    // Keplr extension injects the wallet provider that is compatible with chainapsis's cosmosJS.
    // You can get this wallet provider from `window.cosmosJSWalletProvider` after load event.
    // If `window.cosmosJSWalletProvider` is null, Keplr extension may be not installed on browser.
    if (!window.cosmosJSWalletProvider) {
        alert("Please install keplr extension");
    } else {
        if (window.keplr && window.keplr.experimentalSuggestChain) {
            try {
                // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
                // If the user approves, the chain will be added to the user's Keplr extension.
                // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
                // If the same chain id is already registered, it will resolve and not require the user interactions.
                await window.keplr.experimentalSuggestChain({
                    // Chain-id of the Cosmos SDK chain.
                    chainId: "cosmwasm-coral",
                    // The name of the chain to be displayed to the user.
                    chainName: "Coral",
                    // RPC endpoint of the chain.
                    rpc: "https://rpc.coralnet.cosmwasm.com",
                    // REST endpoint of the chain.
                    rest: "https://lcd.coralnet.cosmwasm.com",
                    // Staking coin information
                    // (Currently, Keplr doesn't have the UI that shows multiple tokens, therefore this uses the SHELL token as the primary token althought SHELL is not a staking coin.)
                    stakeCurrency: {
                        // Coin denomination to be displayed to the user.
                        coinDenom: "SHELL",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "ushell",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    },
                    // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
                    // The 'stake' button in Keplr extension will link to the webpage.
                    // walletUrlForStaking: "",
                    // The BIP44 path.
                    bip44: {
                        // You can only set the coin type of BIP44.
                        // 'Purpose' is fixed to 44.
                        coinType: 118,
                    },
                    // Bech32 configuration to show the address to user.
                    // This field is the interface of
                    // {
                    //   bech32PrefixAccAddr: string;
                    //   bech32PrefixAccPub: string;
                    //   bech32PrefixValAddr: string;
                    //   bech32PrefixValPub: string;
                    //   bech32PrefixConsAddr: string;
                    //   bech32PrefixConsPub: string;
                    // }
                    bech32Config: defaultBech32Config("coral"),
                    // List of all coin/tokens used in this chain.
                    currencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "SHELL",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "ushell",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    }],
                    // List of coin/tokens used as a fee token in this chain.
                    feeCurrencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "SHELL",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "ushell",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    }],
                    // (Optional) The number of the coin type.
                    // This field is only used to fetch the address from ENS.
                    // Ideally, it is recommended to be the same with BIP44 path's coin type.
                    // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
                    // So, this is separated to support such chains.
                    // coinType: 118,
                });
            } catch {
                alert("Failed to suggest the chain");
            }
        } else {
            alert("Please use the recent version of keplr extension");
        }
    }

    // Initialize the gaia api with the wallet provider that is injected by Keplr extension.
    const cosmosJS = new GaiaApi({
        chainId: "cosmwasm-coral",
        walletProvider: window.cosmosJSWalletProvider,
        rpc: "https://rpc.coralnet.cosmwasm.com",
        rest: "https://lcd.coralnet.cosmwasm.com"
    }, {
        bech32Config: defaultBech32Config("coral")
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
        recipient = AccAddress.fromBech32(recipient, "coral");
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
            chainId: "cosmwasm-coral",
            walletProvider: window.cosmosJSWalletProvider,
            rpc: "https://rpc.coralnet.cosmwasm.com",
            rest: "https://lcd.coralnet.cosmwasm.com"
        }, {
            bech32Config: defaultBech32Config("coral")
        });

        // See above.
        await cosmosJS.enable();

        // Get the user's key.
        // And, parse bech32 address and validate it.
        const sender = AccAddress.fromBech32((await cosmosJS.getKeys())[0].bech32Address, "coral");

        // Make send message for bank module.
        const msg = new MsgExecuteContract(sender, AccAddress.fromBech32(cw20ContractAddress, "coral"), {
            transfer: {
                recipient: recipient.toBech32(),
                amount: amount.toString()
            }
        }, []);

        // Request sending messages.
        // Fee will be set by the Keplr extension.
        // The gas adjustment has not been implemented yet, so please set the gas manually.
        const result = await cosmosJS.sendMsgs([msg], {
            gas: 150000,
            memo: "",
            fee: new Coin("coral", 1)
        }, "sync");

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log);
        }

        alert("Succeed to send tx");
    })();

    return false;
};
