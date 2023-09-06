export type Balances = {
  balances: CoinPrimitive[];
  pagination: {
    next_key?: string;
    total?: string;
  };
};

export type CoinPrimitive = {
  denom: string;
  amount: string;
};
