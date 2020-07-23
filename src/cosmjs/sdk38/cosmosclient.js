"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosClient = exports.isPostTxFailure = void 0;
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const math_1 = require("@cosmjs/math");
const lcdapi_1 = require("./lcdapi");
const logs_1 = require("./logs");
const pubkey_1 = require("./pubkey");
function isPostTxFailure(postTxResult) {
    return !!postTxResult.code;
}
exports.isPostTxFailure = isPostTxFailure;
function isSearchByIdQuery(query) {
    return query.id !== undefined;
}
function isSearchByHeightQuery(query) {
    return query.height !== undefined;
}
function isSearchBySentFromOrToQuery(query) {
    return query.sentFromOrTo !== undefined;
}
function isSearchByTagsQuery(query) {
    return query.tags !== undefined;
}
class CosmosClient {
    /**
     * Creates a new client to interact with a CosmWasm blockchain.
     *
     * This instance does a lot of caching. In order to benefit from that you should try to use one instance
     * for the lifetime of your application. When switching backends, a new instance must be created.
     *
     * @param apiUrl The URL of a Cosmos SDK light client daemon API (sometimes called REST server or REST API)
     * @param broadcastMode Defines at which point of the transaction processing the postTx method (i.e. transaction broadcasting) returns
     */
    constructor(apiUrl, broadcastMode = lcdapi_1.BroadcastMode.Block) {
        this.lcdClient = lcdapi_1.LcdClient.withExtensions({ apiUrl: apiUrl, broadcastMode: broadcastMode }, lcdapi_1.setupAuthExtension);
    }
    async getChainId() {
        if (!this.chainId) {
            const response = await this.lcdClient.nodeInfo();
            const chainId = response.node_info.network;
            if (!chainId)
                throw new Error("Chain ID must not be empty");
            this.chainId = chainId;
        }
        return this.chainId;
    }
    async getHeight() {
        if (this.anyValidAddress) {
            const { height } = await this.lcdClient.auth.account(this.anyValidAddress);
            return parseInt(height, 10);
        }
        else {
            // Note: this gets inefficient when blocks contain a lot of transactions since it
            // requires downloading and deserializing all transactions in the block.
            const latest = await this.lcdClient.blocksLatest();
            return parseInt(latest.block.header.height, 10);
        }
    }
    /**
     * Returns a 32 byte upper-case hex transaction hash (typically used as the transaction ID)
     */
    async getIdentifier(tx) {
        // We consult the REST API because we don't have a local amino encoder
        const response = await this.lcdClient.encodeTx(tx);
        const hash = new crypto_1.Sha256(encoding_1.fromBase64(response.tx)).digest();
        return encoding_1.toHex(hash).toUpperCase();
    }
    /**
     * Returns account number and sequence.
     *
     * Throws if the account does not exist on chain.
     *
     * @param address returns data for this address. When unset, the client's sender adddress is used.
     */
    async getSequence(address) {
        const account = await this.getAccount(address);
        if (!account) {
            throw new Error("Account does not exist on chain. Send some tokens there before trying to query sequence.");
        }
        return {
            accountNumber: account.accountNumber,
            sequence: account.sequence,
        };
    }
    async getAccount(address) {
        const account = await this.lcdClient.auth.account(address);
        const value = account.result.value;
        if (value.address === "") {
            return undefined;
        }
        else {
            this.anyValidAddress = value.address;
            return {
                address: value.address,
                balance: value.coins,
                pubkey: value.public_key ? (value.public_key.value ? value.public_key.value : pubkey_1.decodeBech32Pubkey(value.public_key)) : undefined,
                accountNumber: value.account_number,
                sequence: value.sequence,
            };
        }
    }
    /**
     * Gets block header and meta
     *
     * @param height The height of the block. If undefined, the latest height is used.
     */
    async getBlock(height) {
        const response = height !== undefined ? await this.lcdClient.blocks(height) : await this.lcdClient.blocksLatest();
        return {
            id: response.block_id.hash,
            header: {
                version: response.block.header.version,
                time: response.block.header.time,
                height: parseInt(response.block.header.height, 10),
                chainId: response.block.header.chain_id,
            },
            txs: (response.block.data.txs || []).map(encoding_1.fromBase64),
        };
    }
    async searchTx(query, filter = {}) {
        const minHeight = filter.minHeight || 0;
        const maxHeight = filter.maxHeight || Number.MAX_SAFE_INTEGER;
        if (maxHeight < minHeight)
            return []; // optional optimization
        function withFilters(originalQuery) {
            return `${originalQuery}&tx.minheight=${minHeight}&tx.maxheight=${maxHeight}`;
        }
        let txs;
        if (isSearchByIdQuery(query)) {
            txs = await this.txsQuery(`tx.hash=${query.id}`);
        }
        else if (isSearchByHeightQuery(query)) {
            // optional optimization to avoid network request
            if (query.height < minHeight || query.height > maxHeight) {
                txs = [];
            }
            else {
                txs = await this.txsQuery(`tx.height=${query.height}`);
            }
        }
        else if (isSearchBySentFromOrToQuery(query)) {
            // We cannot get both in one request (see https://github.com/cosmos/gaia/issues/75)
            const sentQuery = withFilters(`message.module=bank&message.sender=${query.sentFromOrTo}`);
            const receivedQuery = withFilters(`message.module=bank&transfer.recipient=${query.sentFromOrTo}`);
            const sent = await this.txsQuery(sentQuery);
            const received = await this.txsQuery(receivedQuery);
            const sentHashes = sent.map((t) => t.hash);
            txs = [...sent, ...received.filter((t) => !sentHashes.includes(t.hash))];
        }
        else if (isSearchByTagsQuery(query)) {
            const rawQuery = withFilters(query.tags.map((t) => `${t.key}=${t.value}`).join("&"));
            txs = await this.txsQuery(rawQuery);
        }
        else {
            throw new Error("Unknown query type");
        }
        // backend sometimes messes up with min/max height filtering
        const filtered = txs.filter((tx) => tx.height >= minHeight && tx.height <= maxHeight);
        return filtered;
    }
    async postTx(tx) {
        const result = await this.lcdClient.postTx(tx);
        if (!result.txhash.match(/^([0-9A-F][0-9A-F])+$/)) {
            throw new Error("Received ill-formatted txhash. Must be non-empty upper-case hex");
        }
        return result.code !== undefined
            ? {
                height: math_1.Uint53.fromString(result.height).toNumber(),
                transactionHash: result.txhash,
                code: result.code,
                rawLog: result.raw_log || "",
            }
            : {
                logs: result.logs ? logs_1.parseLogs(result.logs) : [],
                rawLog: result.raw_log || "",
                transactionHash: result.txhash,
                data: result.data ? encoding_1.fromHex(result.data) : undefined,
            };
    }
    async txsQuery(query) {
        // TODO: we need proper pagination support
        const limit = 100;
        const result = await this.lcdClient.txsQuery(`${query}&limit=${limit}`);
        const pages = parseInt(result.page_total, 10);
        if (pages > 1) {
            throw new Error(`Found more results on the backend than we can process currently. Results: ${result.total_count}, supported: ${limit}`);
        }
        return result.txs.map((restItem) => ({
            height: parseInt(restItem.height, 10),
            hash: restItem.txhash,
            code: restItem.code || 0,
            rawLog: restItem.raw_log,
            logs: logs_1.parseLogs(restItem.logs || []),
            tx: restItem.tx,
            timestamp: restItem.timestamp,
        }));
    }
}
exports.CosmosClient = CosmosClient;
//# sourceMappingURL=cosmosclient.js.map