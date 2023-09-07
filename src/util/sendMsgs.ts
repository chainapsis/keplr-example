import {BroadcastMode, ChainInfo, Keplr, StdFee} from "@keplr-wallet/types";
import {AccountResponse} from "../types/account";
import {api} from "./api";
import {AuthInfo, Fee, TxBody, TxRaw} from "../proto-types-gen/src/cosmos/tx/v1beta1/tx";
import {SignMode} from "../proto-types-gen/src/cosmos/tx/signing/v1beta1/signing";
import {PubKey} from "../proto-types-gen/src/cosmos/crypto/secp256k1/keys";
import {Any} from "../proto-types-gen/src/google/protobuf/any";
import Long from "long";
import {Buffer} from "buffer";
import {TendermintTxTracer} from "@keplr-wallet/cosmos";

export const sendMsgs = async (
  keplr:Keplr,
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: StdFee,
  memo: string = ""
) => {
  const account = await fetchAccountInfo(chainInfo, sender);
  const { pubKey } = await keplr.getKey(chainInfo.chainId);

  if(account) {
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/cosmos.crypto.secp256k1.PubKey",
              value: PubKey.encode({
                key: pubKey,
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: account.sequence,
          },
        ],
        fee: Fee.fromPartial({
          amount: fee.amount.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
          gasLimit: fee.gas,
        }),
      }).finish(),
      chainId: chainInfo.chainId,
      accountNumber: Long.fromString(account.account_number)
    }

    const signed = await keplr.signDirect(
      chainInfo.chainId,
      sender,
      signDoc,
    )

    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    }

    const txHash = await broadcastTxSync(keplr, chainInfo.chainId, signedTx.tx);
    const txTracer = new TendermintTxTracer(chainInfo.rpc, "/websocket");
    txTracer.traceTx(txHash).then((tx) => {
      alert("Transaction commit successfully");
    });

  }
}

export const fetchAccountInfo = async (chainInfo: ChainInfo, address: string) => {
  try {
    const uri = `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${address}`;
    const response = await api<AccountResponse>(uri);

    return response.account;
  } catch (e) {
    console.error("This may be a new account. Please send some tokens to this account first.")
    return undefined;
  }
}

export const broadcastTxSync = async (
  keplr:Keplr,
  chainId: string,
  tx: Uint8Array,
): Promise<Uint8Array> => {
  return keplr.sendTx(chainId,  tx, "sync" as BroadcastMode)
}
