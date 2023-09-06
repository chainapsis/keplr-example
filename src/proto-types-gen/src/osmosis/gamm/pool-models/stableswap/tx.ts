/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../../cosmos/base/v1beta1/coin";
import { PoolParams } from "./stableswap_pool";

export const protobufPackage = "osmosis.gamm.poolmodels.stableswap.v1beta1";

/** ===================== MsgCreatePool */
export interface MsgCreateStableswapPool {
  sender: string;
  poolParams: PoolParams | undefined;
  initialPoolLiquidity: Coin[];
  scalingFactors: string[];
  futurePoolGovernor: string;
  scalingFactorController: string;
}

/** Returns a poolID with custom poolName. */
export interface MsgCreateStableswapPoolResponse {
  poolId: string;
}

/**
 * Sender must be the pool's scaling_factor_governor in order for the tx to
 * succeed. Adjusts stableswap scaling factors.
 */
export interface MsgStableSwapAdjustScalingFactors {
  sender: string;
  poolId: string;
  scalingFactors: string[];
}

export interface MsgStableSwapAdjustScalingFactorsResponse {
}

function createBaseMsgCreateStableswapPool(): MsgCreateStableswapPool {
  return {
    sender: "",
    poolParams: undefined,
    initialPoolLiquidity: [],
    scalingFactors: [],
    futurePoolGovernor: "",
    scalingFactorController: "",
  };
}

export const MsgCreateStableswapPool = {
  encode(message: MsgCreateStableswapPool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolParams !== undefined) {
      PoolParams.encode(message.poolParams, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.initialPoolLiquidity) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    writer.uint32(34).fork();
    for (const v of message.scalingFactors) {
      writer.uint64(v);
    }
    writer.ldelim();
    if (message.futurePoolGovernor !== "") {
      writer.uint32(42).string(message.futurePoolGovernor);
    }
    if (message.scalingFactorController !== "") {
      writer.uint32(50).string(message.scalingFactorController);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateStableswapPool {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateStableswapPool();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.poolParams = PoolParams.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.initialPoolLiquidity.push(Coin.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag === 32) {
            message.scalingFactors.push(longToString(reader.uint64() as Long));

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.scalingFactors.push(longToString(reader.uint64() as Long));
            }

            continue;
          }

          break;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.futurePoolGovernor = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
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

  fromJSON(object: any): MsgCreateStableswapPool {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolParams: isSet(object.poolParams) ? PoolParams.fromJSON(object.poolParams) : undefined,
      initialPoolLiquidity: Array.isArray(object?.initialPoolLiquidity)
        ? object.initialPoolLiquidity.map((e: any) => Coin.fromJSON(e))
        : [],
      scalingFactors: Array.isArray(object?.scalingFactors) ? object.scalingFactors.map((e: any) => String(e)) : [],
      futurePoolGovernor: isSet(object.futurePoolGovernor) ? String(object.futurePoolGovernor) : "",
      scalingFactorController: isSet(object.scalingFactorController) ? String(object.scalingFactorController) : "",
    };
  },

  toJSON(message: MsgCreateStableswapPool): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolParams !== undefined) {
      obj.poolParams = PoolParams.toJSON(message.poolParams);
    }
    if (message.initialPoolLiquidity?.length) {
      obj.initialPoolLiquidity = message.initialPoolLiquidity.map((e) => Coin.toJSON(e));
    }
    if (message.scalingFactors?.length) {
      obj.scalingFactors = message.scalingFactors;
    }
    if (message.futurePoolGovernor !== "") {
      obj.futurePoolGovernor = message.futurePoolGovernor;
    }
    if (message.scalingFactorController !== "") {
      obj.scalingFactorController = message.scalingFactorController;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateStableswapPool>, I>>(base?: I): MsgCreateStableswapPool {
    return MsgCreateStableswapPool.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateStableswapPool>, I>>(object: I): MsgCreateStableswapPool {
    const message = createBaseMsgCreateStableswapPool();
    message.sender = object.sender ?? "";
    message.poolParams = (object.poolParams !== undefined && object.poolParams !== null)
      ? PoolParams.fromPartial(object.poolParams)
      : undefined;
    message.initialPoolLiquidity = object.initialPoolLiquidity?.map((e) => Coin.fromPartial(e)) || [];
    message.scalingFactors = object.scalingFactors?.map((e) => e) || [];
    message.futurePoolGovernor = object.futurePoolGovernor ?? "";
    message.scalingFactorController = object.scalingFactorController ?? "";
    return message;
  },
};

function createBaseMsgCreateStableswapPoolResponse(): MsgCreateStableswapPoolResponse {
  return { poolId: "0" };
}

export const MsgCreateStableswapPoolResponse = {
  encode(message: MsgCreateStableswapPoolResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.poolId !== "0") {
      writer.uint32(8).uint64(message.poolId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateStableswapPoolResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateStableswapPoolResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.poolId = longToString(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateStableswapPoolResponse {
    return { poolId: isSet(object.poolId) ? String(object.poolId) : "0" };
  },

  toJSON(message: MsgCreateStableswapPoolResponse): unknown {
    const obj: any = {};
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateStableswapPoolResponse>, I>>(base?: I): MsgCreateStableswapPoolResponse {
    return MsgCreateStableswapPoolResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateStableswapPoolResponse>, I>>(
    object: I,
  ): MsgCreateStableswapPoolResponse {
    const message = createBaseMsgCreateStableswapPoolResponse();
    message.poolId = object.poolId ?? "0";
    return message;
  },
};

function createBaseMsgStableSwapAdjustScalingFactors(): MsgStableSwapAdjustScalingFactors {
  return { sender: "", poolId: "0", scalingFactors: [] };
}

export const MsgStableSwapAdjustScalingFactors = {
  encode(message: MsgStableSwapAdjustScalingFactors, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    writer.uint32(26).fork();
    for (const v of message.scalingFactors) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStableSwapAdjustScalingFactors {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStableSwapAdjustScalingFactors();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.poolId = longToString(reader.uint64() as Long);
          continue;
        case 3:
          if (tag === 24) {
            message.scalingFactors.push(longToString(reader.uint64() as Long));

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.scalingFactors.push(longToString(reader.uint64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgStableSwapAdjustScalingFactors {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      scalingFactors: Array.isArray(object?.scalingFactors) ? object.scalingFactors.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: MsgStableSwapAdjustScalingFactors): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.scalingFactors?.length) {
      obj.scalingFactors = message.scalingFactors;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgStableSwapAdjustScalingFactors>, I>>(
    base?: I,
  ): MsgStableSwapAdjustScalingFactors {
    return MsgStableSwapAdjustScalingFactors.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgStableSwapAdjustScalingFactors>, I>>(
    object: I,
  ): MsgStableSwapAdjustScalingFactors {
    const message = createBaseMsgStableSwapAdjustScalingFactors();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.scalingFactors = object.scalingFactors?.map((e) => e) || [];
    return message;
  },
};

function createBaseMsgStableSwapAdjustScalingFactorsResponse(): MsgStableSwapAdjustScalingFactorsResponse {
  return {};
}

export const MsgStableSwapAdjustScalingFactorsResponse = {
  encode(_: MsgStableSwapAdjustScalingFactorsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStableSwapAdjustScalingFactorsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStableSwapAdjustScalingFactorsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgStableSwapAdjustScalingFactorsResponse {
    return {};
  },

  toJSON(_: MsgStableSwapAdjustScalingFactorsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgStableSwapAdjustScalingFactorsResponse>, I>>(
    base?: I,
  ): MsgStableSwapAdjustScalingFactorsResponse {
    return MsgStableSwapAdjustScalingFactorsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgStableSwapAdjustScalingFactorsResponse>, I>>(
    _: I,
  ): MsgStableSwapAdjustScalingFactorsResponse {
    const message = createBaseMsgStableSwapAdjustScalingFactorsResponse();
    return message;
  },
};

export interface Msg {
  CreateStableswapPool(request: MsgCreateStableswapPool): Promise<MsgCreateStableswapPoolResponse>;
  StableSwapAdjustScalingFactors(
    request: MsgStableSwapAdjustScalingFactors,
  ): Promise<MsgStableSwapAdjustScalingFactorsResponse>;
}

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
