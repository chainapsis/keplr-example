export const OsmosisTestnetChainInfo = {
  // Chain-id of the Osmosis chain.
  chainId: "osmo-test-5",
  // The name of the chain to be displayed to the user.
  chainName: "Osmosis Testnet",
  // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
  rpc: "https://rpc.osmotest5.osmosis.zone",
  // REST endpoint of the chain.
  rest: "https://lcd.osmotest5.osmosis.zone",
  // Staking coin information
  stakeCurrency: {
    // Coin denomination to be displayed to the user.
    coinDenom: "OSMO",
    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
    coinMinimalDenom: "uosmo",
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
  bech32Config: {
    bech32PrefixAccAddr: "osmo",
    bech32PrefixAccPub: "osmopub",
    bech32PrefixValAddr: "osmovaloper",
    bech32PrefixValPub: "osmovaloperpub",
    bech32PrefixConsAddr: "osmovalcons",
    bech32PrefixConsPub: "osmovalconspub",
  },
  // List of all coin/tokens used in this chain.
  currencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: "OSMO",
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: "uosmo",
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: 6,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    },
  ],
  // List of coin/tokens used as a fee token in this chain.
  feeCurrencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: "OSMO",
      // Actual denom (i.e. uosmo, uscrt) used by the blockchain.
      coinMinimalDenom: "uosmo",
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: 6,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
      // (Optional) This is used to set the fee of the transaction.
      // If this field is not provided and suggesting chain is not natively integrated, Keplr extension will set the Keplr default gas price (low: 0.01, average: 0.025, high: 0.04).
      // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
      // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
      gasPriceStep: {
        low: 0.0025,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
};

export const OsmosisChainInfo = {
  rpc: "https://rpc-osmosis.keplr.app",
  rest: "https://lcd-osmosis.keplr.app",
  chainId: "osmosis-1",
  chainName: "Osmosis",
  stakeCurrency: {
    coinDenom: "OSMO",
    coinMinimalDenom: "uosmo",
    coinDecimals: 6,
    coinGeckoId: "osmosis",
  },
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "osmo",
    bech32PrefixAccPub: "osmopub",
    bech32PrefixValAddr: "osmovaloper",
    bech32PrefixValPub: "osmovaloperpub",
    bech32PrefixConsAddr: "osmovalcons",
    bech32PrefixConsPub: "osmovalconspub",
  },
  currencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
    },
    {
      coinDenom: "ION",
      coinMinimalDenom: "uion",
      coinDecimals: 6,
      coinGeckoId: "ion",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
      gasPriceStep: {
        low: 0,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  features: [
    "ibc-transfer",
    "ibc-go",
    "cosmwasm",
    "wasmd_0.24+",
    "osmosis-txfees",
  ],
};

export const EvmosChainInfo = {
  chainId: "evmos_9001-2",
  chainName: "Evmos",
  rpc: "https://evmos-rpc.publicnode.com:443",
  rest: "https://evmos-rest.publicnode.com",
  stakeCurrency: {
    coinDenom: "EVMOS",
    coinMinimalDenom: "aevmos",
    coinDecimals: 18,
    coinGeckoId: "evmos",
  },
  bip44: { coinType: 60 },
  bech32Config: {
    bech32PrefixAccAddr: "evmos",
    bech32PrefixAccPub: "evmospub",
    bech32PrefixValAddr: "evmosvaloper",
    bech32PrefixValPub: "evmosvaloperpub",
    bech32PrefixConsAddr: "evmosvalcons",
    bech32PrefixConsPub: "evmosvalconspub",
  },
  currencies: [
    {
      coinDenom: "EVMOS",
      coinMinimalDenom: "aevmos",
      coinDecimals: 18,
      coinGeckoId: "evmos",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "EVMOS",
      coinMinimalDenom: "aevmos",
      coinDecimals: 18,
      coinGeckoId: "evmos",
      gasPriceStep: {
        low: 25000000000,
        average: 25000000000,
        high: 40000000000,
      },
    },
  ],
  features: ["eth-address-gen", "eth-key-sign"],
  evm: {
    chainId: 9001,
    rpc: "https://evmos-evm-rpc.publicnode.com",
  },
};

export const InjectiveChainInfo = {
  chainId: "injective-1",
  chainName: "Injective",
  rpc: "https://sentry.tm.injective.network:443",
  rest: "https://sentry.lcd.injective.network:443",
  stakeCurrency: {
    coinDenom: "INJ",
    coinMinimalDenom: "inj",
    coinDecimals: 18,
    coinGeckoId: "injective-protocol",
  },
  bip44: { coinType: 60 },
  bech32Config: {
    bech32PrefixAccAddr: "inj",
    bech32PrefixAccPub: "injpub",
    bech32PrefixValAddr: "injvaloper",
    bech32PrefixValPub: "injvaloperpub",
    bech32PrefixConsAddr: "injvalcons",
    bech32PrefixConsPub: "injvalconspub",
  },
  currencies: [
    {
      coinDenom: "INJ",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
      coinGeckoId: "injective-protocol",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "INJ",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
      coinGeckoId: "injective-protocol",
      gasPriceStep: { low: 500000000, average: 1000000000, high: 1500000000 },
    },
  ],
  features: ["eth-address-gen", "eth-key-sign"],
  evm: {
    chainId: 1, // Injective EVM chainId (실제로 1이 맞음 — 구현 시 Keplr 체인 레지스트리에서 재확인)
    rpc: "https://sentry.evm-rpc.injective.network",
  },
};

export const EthermintChains = [
  { id: "evmos", label: "Evmos", info: EvmosChainInfo },
  { id: "injective", label: "Injective", info: InjectiveChainInfo },
];
