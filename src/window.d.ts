import {
  ChainInfoWithoutEndpoints,
  Keplr,
  Window as KeplrWindow,
} from "@keplr-wallet/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    keplr?: Keplr & {
      ethereum: any;
      getChainInfoWithoutEndpoints: (
        chainId: string
      ) => Promise<ChainInfoWithoutEndpoints>;
    };
    ethereum?: any;
  }
}
