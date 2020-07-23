"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningCosmosClient = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const coins_1 = require("./coins");
const cosmosclient_1 = require("./cosmosclient");
const encoding_1 = require("./encoding");
const lcdapi_1 = require("./lcdapi");
const defaultFees = {
    upload: {
        amount: coins_1.coins(25000, "ucosm"),
        gas: "1000000",
    },
    init: {
        amount: coins_1.coins(12500, "ucosm"),
        gas: "500000",
    },
    exec: {
        amount: coins_1.coins(5000, "ucosm"),
        gas: "200000",
    },
    send: {
        amount: coins_1.coins(2000, "ucosm"),
        gas: "80000",
    },
};
class SigningCosmosClient extends cosmosclient_1.CosmosClient {
    /**
     * Creates a new client with signing capability to interact with a CosmWasm blockchain. This is the bigger brother of CosmWasmClient.
     *
     * This instance does a lot of caching. In order to benefit from that you should try to use one instance
     * for the lifetime of your application. When switching backends, a new instance must be created.
     *
     * @param apiUrl The URL of a Cosmos SDK light client daemon API (sometimes called REST server or REST API)
     * @param senderAddress The address that will sign and send transactions using this instance
     * @param signer An implementation of OfflineSigner which can provide signatures for transactions, potentially requiring user input.
     * @param customFees The fees that are paid for transactions
     * @param broadcastMode Defines at which point of the transaction processing the postTx method (i.e. transaction broadcasting) returns
     */
    constructor(apiUrl, senderAddress, signer, customFees, broadcastMode = lcdapi_1.BroadcastMode.Block) {
        super(apiUrl, broadcastMode);
        this.anyValidAddress = senderAddress;
        this.senderAddress = senderAddress;
        this.signer = signer;
        this.fees = Object.assign(Object.assign({}, defaultFees), (customFees || {}));
    }
    async getSequence(address) {
        return super.getSequence(address || this.senderAddress);
    }
    async getAccount(address) {
        return super.getAccount(address || this.senderAddress);
    }
    async sendTokens(recipientAddress, transferAmount, memo = "") {
        const sendMsg = {
            type: "cosmos-sdk/MsgSend",
            value: {
                from_address: this.senderAddress,
                to_address: recipientAddress,
                amount: transferAmount,
            },
        };
        const fee = this.fees.send;
        const { accountNumber, sequence } = await this.getSequence();
        const chainId = await this.getChainId();
        const signBytes = encoding_1.makeSignBytes([sendMsg], fee, chainId, memo, accountNumber, sequence);
        const signature = await this.signer.sign(this.senderAddress, signBytes);
        const signedTx = {
            msg: [sendMsg],
            fee: fee,
            memo: memo,
            signatures: [signature],
        };
        return this.postTx(signedTx);
    }
}
exports.SigningCosmosClient = SigningCosmosClient;
//# sourceMappingURL=signingcosmosclient.js.map