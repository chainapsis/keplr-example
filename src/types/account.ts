export type AccountResponse = {
  account: Account
}

export type Account = {
  account_number: string;
  address: string;
  sequence: string;
  pub_key: {
    "@type": string;
    key: string
  }
};
