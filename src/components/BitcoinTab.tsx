import { BitcoinSignMessageType, Network } from "@keplr-wallet/types";
import React, { useState } from "react";

export const BitcoinTab: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [balance, setBalance] = useState<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  } | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<string>("");
  const [txResult, setTxResult] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [signType, setSignType] = useState<BitcoinSignMessageType>(
    BitcoinSignMessageType.ECDSA
  );
  const [signature, setSignature] = useState<string>("");

  // PSBT signing state
  const [psbtInputs, setPsbtInputs] = useState<string[]>([""]);
  const [signPsbtResult, setSignPsbtResult] = useState<string>("");

  const requestAccounts = async () => {
    try {
      const accounts = await window.keplr?.bitcoin.requestAccounts();
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Error getting accounts:", error);
    }
  };

  const getPublicKey = async () => {
    try {
      const pubKey = await window.keplr?.bitcoin.getPublicKey();
      if (pubKey) {
        setPublicKey(pubKey);
      } else {
        setPublicKey("");
      }
    } catch (error) {
      console.error("Error getting public key:", error);
    }
  };

  const getBalance = async () => {
    try {
      const balanceInfo = await window.keplr?.bitcoin.getBalance();
      if (balanceInfo) {
        setBalance(balanceInfo);
      } else {
        setBalance(null);
      }
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const getCurrentNetwork = async () => {
    try {
      const networkInfo = await window.keplr?.bitcoin.getNetwork();
      if (networkInfo) {
        setNetwork(networkInfo);
      } else {
        setNetwork(null);
      }
    } catch (error) {
      console.error("Error getting network:", error);
    }
  };

  const switchNetwork = async (
    newNetwork: "livenet" | "signet" | "testnet"
  ) => {
    try {
      const result = await window.keplr?.bitcoin.switchNetwork(
        newNetwork as Network
      );
      if (result) {
        setNetwork(result);
      } else {
        setNetwork(null);
      }
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  const handleSendBitcoin = async () => {
    try {
      if (!recipientAddress || !sendAmount) return;

      const amountInSats = parseInt(sendAmount);
      if (isNaN(amountInSats)) return;

      const txId = await window.keplr?.bitcoin.sendBitcoin(
        recipientAddress,
        amountInSats
      );

      if (txId) {
        setTxResult(txId);
      } else {
        setTxResult("Error: No transaction ID returned");
      }
    } catch (error) {
      console.error("Error sending bitcoin:", error);
      setTxResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const handleSignMessage = async () => {
    try {
      if (!message) return;

      const sig = await window.keplr?.bitcoin.signMessage(
        message,
        signType as BitcoinSignMessageType
      );
      if (sig) {
        setSignature(sig);
      } else {
        setSignature("Error: No signature returned");
      }
    } catch (error) {
      console.error("Error signing message:", error);
      setSignature(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const addPsbtInput = () => {
    setPsbtInputs([...psbtInputs, ""]);
  };

  const handlePsbtInputChange = (index: number, value: string) => {
    const newInputs = [...psbtInputs];
    newInputs[index] = value;
    setPsbtInputs(newInputs);
  };

  const removePsbtInput = (index: number) => {
    if (psbtInputs.length > 1) {
      const newInputs = [...psbtInputs];
      newInputs.splice(index, 1);
      setPsbtInputs(newInputs);
    }
  };

  const handleSignPsbts = async () => {
    try {
      const validInputs = psbtInputs.filter((input) => input.trim() !== "");

      if (validInputs.length === 0) {
        setSignPsbtResult("Error: No valid PSBT inputs provided");
        return;
      }

      const results = await window.keplr?.bitcoin.signPsbts(validInputs);

      if (results && Array.isArray(results)) {
        setSignPsbtResult(
          results.length === 1 ? results[0] : JSON.stringify(results, null, 2)
        );
      } else {
        setSignPsbtResult("Error: No valid result returned");
      }
    } catch (error) {
      console.error("Error signing PSBTs:", error);
      setSignPsbtResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Request to Bitcoin Chain via Keplr Bitcoin Provider
      </h2>
      <div className="item-container">
        <div className="item">
          <div className="item-title">Account Info</div>
          <div className="item-content">
            <button className="keplr-button" onClick={requestAccounts}>
              Request Accounts
            </button>
            <button className="keplr-button" onClick={getPublicKey}>
              Get Public Key
            </button>

            <div style={{ marginTop: "10px" }}>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">{address || "Not connected"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Public Key:</span>
                <span className="info-value">{publicKey || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Balance</div>
          <div className="item-content">
            <button className="keplr-button" onClick={getBalance}>
              Get Balance
            </button>

            {balance && (
              <div style={{ marginTop: "10px" }}>
                <div>Confirmed: {balance.confirmed} sats</div>
                <div>Unconfirmed: {balance.unconfirmed} sats</div>
                <div>Total: {balance.total} sats</div>
              </div>
            )}
          </div>
        </div>

        <div className="item">
          <div className="item-title">Network</div>
          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <button className="keplr-button" onClick={getCurrentNetwork}>
                Get Network
              </button>
            </div>

            <div style={{ marginTop: "10px" }}>
              <div>Current Network: {network || "N/A"}</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              Switch Network:
              <div style={{ marginTop: "5px" }}>
                <select onChange={(e) => switchNetwork(e.target.value as any)}>
                  <option value="">Select Network</option>
                  <option value="livenet">Bitcoin Mainnet</option>
                  <option value="signet">Bitcoin Signet</option>
                  <option value="testnet">Bitcoin Testnet</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Send Bitcoin</div>
          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Recipient:
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter Bitcoin address"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Amount (in satoshis):
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="Enter amount in sats"
              />
            </div>

            <button className="keplr-button" onClick={handleSendBitcoin}>
              Send Bitcoin
            </button>

            {txResult && (
              <div style={{ marginTop: "10px" }}>
                <div>Transaction Result: {txResult}</div>
              </div>
            )}
          </div>
        </div>

        <div className="item">
          <div className="item-title">Sign Message</div>
          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Message:
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Sign Message Type:
              <select
                value={signType}
                onChange={(e) =>
                  setSignType(e.target.value as BitcoinSignMessageType)
                }
              >
                <option value={BitcoinSignMessageType.ECDSA}>ECDSA</option>
                <option value={BitcoinSignMessageType.BIP322_SIMPLE}>
                  BIP322-Simple
                </option>
              </select>
            </div>

            <button className="keplr-button" onClick={handleSignMessage}>
              Sign Message
            </button>

            {signature && (
              <div style={{ marginTop: "10px" }}>
                <div>Signature: {signature}</div>
              </div>
            )}
          </div>
        </div>

        <div className="item">
          <div className="item-title">Sign PSBTs</div>
          <div className="item-content">
            {psbtInputs.map((input, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <textarea
                  value={input}
                  onChange={(e) => handlePsbtInputChange(index, e.target.value)}
                  placeholder="Enter PSBT hex or base64 string"
                  style={{ flex: 1 }}
                />
                {psbtInputs.length > 1 && (
                  <button
                    className="keplr-button"
                    onClick={() => removePsbtInput(index)}
                    style={{ maxWidth: "40px" }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            <button
              className="keplr-button"
              onClick={addPsbtInput}
              style={{ marginBottom: "10px" }}
            >
              + Add PSBT
            </button>

            <button className="keplr-button" onClick={handleSignPsbts}>
              Sign PSBTs
            </button>

            {signPsbtResult && (
              <div style={{ marginTop: "10px" }}>
                <div>Result:</div>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    background: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "5px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {signPsbtResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
