/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PoolAsset, PoolParams } from "../balancerPool";

export const protobufPackage = "osmosis.gamm.poolmodels.balancer.v1beta1";

/** ===================== MsgCreatePool */
export interface MsgCreateBalancerPool {
  sender: string;
  poolParams: PoolParams | undefined;
  poolAssets: PoolAsset[];
  futurePoolGovernor: string;
}

/** Returns the poolID */
export interface MsgCreateBalancerPoolResponse {
  poolId: string;
}

function createBaseMsgCreateBalancerPool(): MsgCreateBalancerPool {
  return { sender: "", poolParams: undefined, poolAssets: [], futurePoolGovernor: "" };
}

export const MsgCreateBalancerPool = {
  encode(message: MsgCreateBalancerPool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolParams !== undefined) {
      PoolParams.encode(message.poolParams, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.poolAssets) {
      PoolAsset.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.futurePoolGovernor !== "") {
      writer.uint32(34).string(message.futurePoolGovernor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateBalancerPool {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateBalancerPool();
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

          message.poolAssets.push(PoolAsset.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.futurePoolGovernor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateBalancerPool {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolParams: isSet(object.poolParams) ? PoolParams.fromJSON(object.poolParams) : undefined,
      poolAssets: Array.isArray(object?.poolAssets) ? object.poolAssets.map((e: any) => PoolAsset.fromJSON(e)) : [],
      futurePoolGovernor: isSet(object.futurePoolGovernor) ? String(object.futurePoolGovernor) : "",
    };
  },

  toJSON(message: MsgCreateBalancerPool): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolParams !== undefined) {
      obj.poolParams = PoolParams.toJSON(message.poolParams);
    }
    if (message.poolAssets?.length) {
      obj.poolAssets = message.poolAssets.map((e) => PoolAsset.toJSON(e));
    }
    if (message.futurePoolGovernor !== "") {
      obj.futurePoolGovernor = message.futurePoolGovernor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateBalancerPool>, I>>(base?: I): MsgCreateBalancerPool {
    return MsgCreateBalancerPool.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateBalancerPool>, I>>(object: I): MsgCreateBalancerPool {
    const message = createBaseMsgCreateBalancerPool();
    message.sender = object.sender ?? "";
    message.poolParams = (object.poolParams !== undefined && object.poolParams !== null)
      ? PoolParams.fromPartial(object.poolParams)
      : undefined;
    message.poolAssets = object.poolAssets?.map((e) => PoolAsset.fromPartial(e)) || [];
    message.futurePoolGovernor = object.futurePoolGovernor ?? "";
    return message;
  },
};

function createBaseMsgCreateBalancerPoolResponse(): MsgCreateBalancerPoolResponse {
  return { poolId: "0" };
}

export const MsgCreateBalancerPoolResponse = {
  encode(message: MsgCreateBalancerPoolResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.poolId !== "0") {
      writer.uint32(8).uint64(message.poolId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateBalancerPoolResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateBalancerPoolResponse();
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

  fromJSON(object: any): MsgCreateBalancerPoolResponse {
    return { poolId: isSet(object.poolId) ? String(object.poolId) : "0" };
  },

  toJSON(message: MsgCreateBalancerPoolResponse): unknown {
    const obj: any = {};
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateBalancerPoolResponse>, I>>(base?: I): MsgCreateBalancerPoolResponse {
    return MsgCreateBalancerPoolResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateBalancerPoolResponse>, I>>(
    object: I,
  ): MsgCreateBalancerPoolResponse {
    const message = createBaseMsgCreateBalancerPoolResponse();
    message.poolId = object.poolId ?? "0";
    return message;
  },
};

export interface Msg {
  CreateBalancerPool(request: MsgCreateBalancerPool): Promise<MsgCreateBalancerPoolResponse>;
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
