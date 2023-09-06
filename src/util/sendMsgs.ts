import {BroadcastMode, ChainInfo, Keplr, Msg, StdFee, StdSignDoc} from "@keplr-wallet/types";
import {Any} from "@keplr-wallet/proto-types/google/protobuf/any";
import {OsmosisChainInfo} from "../constants";
import {Balances} from "../types/balance";
import {Dec} from "@keplr-wallet/unit";
import {Account, AccountResponse} from "../types/account";
import {api} from "./api";
import {sortObjectByKey} from "@keplr-wallet/common";
import {AuthInfo, Fee, SignerInfo, TxBody, TxRaw} from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx";
import {SignMode} from "@keplr-wallet/proto-types/cosmos/tx/signing/v1beta1/signing";
import {PubKey} from "@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys";
import Long from "long";


export const sendMsgs = async (
  keplr:Keplr,
  chainInfo: ChainInfo,
  sender: string,
  msgs: {
    amino: Msg[];
    proto: Any[];
  },
  fee: StdFee,
  memo: string = ""
) => {
  const account = await fetchAccountInfo(chainInfo, sender);

  // const signDocRaw: StdSignDoc = {
  //   chain_id: chainInfo.chainId,
  //   account_number: account.account_number,
  //   sequence: account.sequence,
  //   fee,
  //   msgs: msgs.amino,
  //   memo: memo,
  // };
  // const signDoc = sortObjectByKey(signDocRaw);
  //
  // const signResponse = await keplr.signAmino(
  //   chainInfo.chainId,
  //   sender,
  //   signDoc,
  // );
  //
  // const signedTx = TxRaw.encode({
  //   bodyBytes: TxBody.encode(
  //     TxBody.fromPartial({
  //       // XXX: I don't know why typing error occurs.
  //       // TODO: Solve typing problem.
  //       messages: msgs.proto as any,
  //       memo: signResponse.signed.memo,
  //     }),
  //   ).finish(),
  //   authInfoBytes: AuthInfo.encode({
  //     signerInfos: [
  //       {
  //         publicKey: {
  //           typeUrl: "/cosmos.crypto.secp256k1.PubKey",
  //           value: PubKey.encode({
  //             key: Buffer.from(signResponse.signature.pub_key.value, "base64"),
  //           }).finish(),
  //         },
  //         modeInfo: {
  //           single: {
  //             mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
  //           },
  //           multi: undefined,
  //         },
  //         sequence: signResponse.signed.sequence,
  //       },
  //     ],
  //     fee: Fee.fromPartial({
  //       amount: signResponse.signed.fee.amount as any,
  //       gasLimit: signResponse.signed.fee.gas,
  //     }),
  //   }).finish(),
  //   signatures: [Buffer.from(signResponse.signature.signature, "base64")],
  // }).finish();

  const signed = await keplr.signDirect(
    chainInfo.chainId,
    sender,
    {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: msgs.proto,
          memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/cosmos.crypto.secp256k1.PubKey",
              value: PubKey.encode({
                key: Buffer.from(account.pub_key.key, "base64"),
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
      accountNumber: Long.fromString(account.account_number),
    },
  )

  const signedTx = {
    tx: TxRaw.encode({
      bodyBytes: signed.signed.bodyBytes,
      authInfoBytes: signed.signed.authInfoBytes,
      signatures: [Buffer.from(signed.signature.signature, "base64")],
    }).finish(),
    signDoc: signed.signed,
  }

  await broadcastTxSync(keplr, chainInfo.chainId, signedTx.tx);
}

export const fetchAccountInfo = async (chainInfo: ChainInfo, address: string) => {
  const uri = `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${address}`;
  const response = await api<AccountResponse>(uri);

  return response.account;
}



export const broadcastTxSync = async (
  keplr:Keplr,
  chainId: string,
  tx: Uint8Array,
): Promise<Uint8Array> => {
  return keplr.sendTx(chainId,  tx, "sync" as BroadcastMode)
}
