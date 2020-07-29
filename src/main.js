const { coins, SigningCosmosClient } = require("@cosmjs/launchpad");

const uatom = "uatom";
const chainId = "cosmoshub-3";
const apiUrl = "https://node-cosmoshub-3.keplr.app/rest";
const customFees = {
  send: {
    amount: coins(5000, uatom),
    gas: "80000",
  },
};

let client;

const initializeClient = async () => {
  // You should request Keplr to enable the wallet.
  // This method will ask the user whether or not to allow access if they haven't visited this website.
  // Also, it will request user to unlock the wallet if the wallet is locked.
  // If you don't request enabling before usage, there is no guarantee that other methods will work.
  await window.keplr.enable(chainId);
  const wallet = window.getCosmJSWalletProvider(chainId);

  // You can get the address/public keys by `getAccounts` method.
  // It can return the array of address/public key.
  // But, currently, Keplr extension manages only one address/public key pair.
  const [{ address: senderAddress }] = await wallet.getAccounts();

  // Initialize the gaia api with the wallet provider that is injected by Keplr extension.
  client = new SigningCosmosClient(apiUrl, senderAddress, wallet, customFees);

  // Display the sender address to the user
  document.getElementById("address").append(senderAddress);
};

const sendTx = async (recipient, amount) => {
  await window.keplr.enable(chainId);
  return client.sendTokens(recipient, coins(amount, uatom));
};

const parseAmount = (rawAmount) => {
  const parsedFloat = parseFloat(rawAmount);
  if (isNaN(parsedFloat)) {
    alert("Invalid amount");
    return false;
  }
  return Math.floor(parsedFloat * 1000000);
};

window.onload = () => {
  // Keplr extension injects the wallet provider that is compatible with cosmJS.
  // You can get this wallet provider from `window.getCosmJSWalletProvider(chainId:string)` after load event.
  // And it also injects the helper function to `window.keplr`.
  // If `window.getCosmJSWalletProvider` or `window.keplr` is null, Keplr extension may be not installed on browser.
  if (!window.getCosmJSWalletProvider || !window.keplr) {
    alert("Please install keplr extension");
  }

  initializeClient().catch((error) => {
    alert("Failed to initialize client: " + error);
  });
};

document.sendForm.onsubmit = () => {
  const recipient = document.sendForm.recipient.value;
  const rawAmount = document.sendForm.amount.value;
  const amount = parseAmount(rawAmount);

  if (amount) {
    sendTx(recipient, amount)
      .then((result) => {
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(result.rawLog);
        }
        alert("Transaction was sent!");
      })
      .catch((error) => {
        alert("Failed to send transaction: " + error);
      });
  }

  return false;
};
