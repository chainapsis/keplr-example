import {ChainInfo, Keplr, StdFee} from "@keplr-wallet/types";
import {Any} from "../proto-types-gen/src/google/protobuf/any";
import {AuthInfo, Fee, TxBody, TxRaw} from "../proto-types-gen/src/cosmos/tx/v1beta1/tx";
import {PubKey} from "../proto-types-gen/src/cosmos/crypto/secp256k1/keys";
import {SignMode} from "../proto-types-gen/src/cosmos/tx/signing/v1beta1/signing";
import Long from "long";
import {fetchAccountInfo} from "./sendMsgs";
import {api} from "./api";
import {GasSimulateResponse} from "../types/simulate";
import {OsmosisChainInfo} from "../constants";
import {Coin} from "@keplr-wallet/types/src/cosmjs";

export const simulateMsgs = async (
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: readonly Coin[],
  memo: string = ""
) => {
  const account = await fetchAccountInfo(chainInfo, sender);

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
        amount: fee.map((coin) => {
          return {
            denom: coin.denom,
            amount: coin.amount.toString(),
          };
        }),
      }),
    }).finish(),
    chainId: chainInfo.chainId,
    accountNumber: Long.fromString(account.account_number)
  }

  const unsignedTx = TxRaw.encode({...signDoc, signatures: [new Uint8Array(64)]}).finish();

  const simulatedResult = await api<GasSimulateResponse>(`${OsmosisChainInfo.rest}/cosmos/tx/v1beta1/simulate`, {
    method: "POST",
    body: JSON.stringify({
      tx_bytes: Buffer.from(unsignedTx).toString("base64")
    })
  })

  const gasUsed = parseInt(simulatedResult.gas_info.gas_used);
  if (Number.isNaN(gasUsed)) {
    throw new Error(`Invalid integer gas: ${simulatedResult.gas_info.gas_used}`);
  }

  return gasUsed;
}
