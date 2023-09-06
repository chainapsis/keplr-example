/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../../cosmos/base/v1beta1/coin";

export const protobufPackage = "osmosis.gamm.poolmodels.stableswap.v1beta1";

/**
 * PoolParams defined the parameters that will be managed by the pool
 * governance in the future. This params are not managed by the chain
 * governance. Instead they will be managed by the token holders of the pool.
 * The pool's token holders are specified in future_pool_governor.
 */
export interface PoolParams {
  swapFee: string;
  /**
   * N.B.: exit fee is disabled during pool creation in x/poolmanager. While old
   * pools can maintain a non-zero fee. No new pool can be created with non-zero
   * fee anymore
   */
  exitFee: string;
}

/** Pool is the stableswap Pool struct */
export interface Pool {
  address: string;
  id: string;
  poolParams:
    | PoolParams
    | undefined;
  /**
   * This string specifies who will govern the pool in the future.
   * Valid forms of this are:
   * {token name},{duration}
   * {duration}
   * where {token name} if specified is the token which determines the
   * governor, and if not specified is the LP token for this pool.duration is
   * a time specified as 0w,1w,2w, etc. which specifies how long the token
   * would need to be locked up to count in governance. 0w means no lockup.
   */
  futurePoolGovernor: string;
  /** sum of all LP shares */
  totalShares:
    | Coin
    | undefined;
  /** assets in the pool */
  poolLiquidity: Coin[];
  /** for calculation amognst assets with different precisions */
  scalingFactors: string[];
  /** scaling_factor_controller is the address can adjust pool scaling factors */
  scalingFactorController: string;
}

function createBasePoolParams(): PoolParams {
  return { swapFee: "", exitFee: "" };
}

export const PoolParams = {
  encode(message: PoolParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.swapFee !== "") {
      writer.uint32(10).string(message.swapFee);
    }
    if (message.exitFee !== "") {
      writer.uint32(18).string(message.exitFee);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolParams {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.swapFee = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.exitFee = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PoolParams {
    return {
      swapFee: isSet(object.swapFee) ? String(object.swapFee) : "",
      exitFee: isSet(object.exitFee) ? String(object.exitFee) : "",
    };
  },

  toJSON(message: PoolParams): unknown {
    const obj: any = {};
    if (message.swapFee !== "") {
      obj.swapFee = message.swapFee;
    }
    if (message.exitFee !== "") {
      obj.exitFee = message.exitFee;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PoolParams>, I>>(base?: I): PoolParams {
    return PoolParams.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PoolParams>, I>>(object: I): PoolParams {
    const message = createBasePoolParams();
    message.swapFee = object.swapFee ?? "";
    message.exitFee = object.exitFee ?? "";
    return message;
  },
};

function createBasePool(): Pool {
  return {
    address: "",
    id: "0",
    poolParams: undefined,
    futurePoolGovernor: "",
    totalShares: undefined,
    poolLiquidity: [],
    scalingFactors: [],
    scalingFactorController: "",
  };
}

export const Pool = {
  encode(message: Pool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.id !== "0") {
      writer.uint32(16).uint64(message.id);
    }
    if (message.poolParams !== undefined) {
      PoolParams.encode(message.poolParams, writer.uint32(26).fork()).ldelim();
    }
    if (message.futurePoolGovernor !== "") {
      writer.uint32(34).string(message.futurePoolGovernor);
    }
    if (message.totalShares !== undefined) {
      Coin.encode(message.totalShares, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.poolLiquidity) {
      Coin.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    writer.uint32(58).fork();
    for (const v of message.scalingFactors) {
      writer.uint64(v);
    }
    writer.ldelim();
    if (message.scalingFactorController !== "") {
      writer.uint32(66).string(message.scalingFactorController);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Pool {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePool();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.id = longToString(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.poolParams = PoolParams.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.futurePoolGovernor = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.totalShares = Coin.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.poolLiquidity.push(Coin.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag === 56) {
            message.scalingFactors.push(longToString(reader.uint64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.scalingFactors.push(longToString(reader.uint64() as Long));
            }

            continue;
          }

          break;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.scalingFactorController = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Pool {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      id: isSet(object.id) ? String(object.id) : "0",
      poolParams: isSet(object.poolParams) ? PoolParams.fromJSON(object.poolParams) : undefined,
      futurePoolGovernor: isSet(object.futurePoolGovernor) ? String(object.futurePoolGovernor) : "",
      totalShares: isSet(object.totalShares) ? Coin.fromJSON(object.totalShares) : undefined,
      poolLiquidity: Array.isArray(object?.poolLiquidity) ? object.poolLiquidity.map((e: any) => Coin.fromJSON(e)) : [],
      scalingFactors: Array.isArray(object?.scalingFactors) ? object.scalingFactors.map((e: any) => String(e)) : [],
      scalingFactorController: isSet(object.scalingFactorController) ? String(object.scalingFactorController) : "",
    };
  },

  toJSON(message: Pool): unknown {
    const obj: any = {};
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.id !== "0") {
      obj.id = message.id;
    }
    if (message.poolParams !== undefined) {
      obj.poolParams = PoolParams.toJSON(message.poolParams);
    }
    if (message.futurePoolGovernor !== "") {
      obj.futurePoolGovernor = message.futurePoolGovernor;
    }
    if (message.totalShares !== undefined) {
      obj.totalShares = Coin.toJSON(message.totalShares);
    }
    if (message.poolLiquidity?.length) {
      obj.poolLiquidity = message.poolLiquidity.map((e) => Coin.toJSON(e));
    }
    if (message.scalingFactors?.length) {
      obj.scalingFactors = message.scalingFactors;
    }
    if (message.scalingFactorController !== "") {
      obj.scalingFactorController = message.scalingFactorController;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Pool>, I>>(base?: I): Pool {
    return Pool.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Pool>, I>>(object: I): Pool {
    const message = createBasePool();
    message.address = object.address ?? "";
    message.id = object.id ?? "0";
    message.poolParams = (object.poolParams !== undefined && object.poolParams !== null)
      ? PoolParams.fromPartial(object.poolParams)
      : undefined;
    message.futurePoolGovernor = object.futurePoolGovernor ?? "";
    message.totalShares = (object.totalShares !== undefined && object.totalShares !== null)
      ? Coin.fromPartial(object.totalShares)
      : undefined;
    message.poolLiquidity = object.poolLiquidity?.map((e) => Coin.fromPartial(e)) || [];
    message.scalingFactors = object.scalingFactors?.map((e) => e) || [];
    message.scalingFactorController = object.scalingFactorController ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToString(long: Long) {
  return long.toString();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
