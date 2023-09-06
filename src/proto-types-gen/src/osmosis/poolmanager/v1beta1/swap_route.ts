/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "osmosis.poolmanager.v1beta1";

export interface SwapAmountInRoute {
  poolId: string;
  tokenOutDenom: string;
}

export interface SwapAmountOutRoute {
  poolId: string;
  tokenInDenom: string;
}

export interface SwapAmountInSplitRoute {
  pools: SwapAmountInRoute[];
  tokenInAmount: string;
}

export interface SwapAmountOutSplitRoute {
  pools: SwapAmountOutRoute[];
  tokenOutAmount: string;
}

function createBaseSwapAmountInRoute(): SwapAmountInRoute {
  return { poolId: "0", tokenOutDenom: "" };
}

export const SwapAmountInRoute = {
  encode(message: SwapAmountInRoute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.poolId !== "0") {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.tokenOutDenom !== "") {
      writer.uint32(18).string(message.tokenOutDenom);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SwapAmountInRoute {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountInRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.poolId = longToString(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenOutDenom = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SwapAmountInRoute {
    return {
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      tokenOutDenom: isSet(object.tokenOutDenom) ? String(object.tokenOutDenom) : "",
    };
  },

  toJSON(message: SwapAmountInRoute): unknown {
    const obj: any = {};
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.tokenOutDenom !== "") {
      obj.tokenOutDenom = message.tokenOutDenom;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SwapAmountInRoute>, I>>(base?: I): SwapAmountInRoute {
    return SwapAmountInRoute.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SwapAmountInRoute>, I>>(object: I): SwapAmountInRoute {
    const message = createBaseSwapAmountInRoute();
    message.poolId = object.poolId ?? "0";
    message.tokenOutDenom = object.tokenOutDenom ?? "";
    return message;
  },
};

function createBaseSwapAmountOutRoute(): SwapAmountOutRoute {
  return { poolId: "0", tokenInDenom: "" };
}

export const SwapAmountOutRoute = {
  encode(message: SwapAmountOutRoute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.poolId !== "0") {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.tokenInDenom !== "") {
      writer.uint32(18).string(message.tokenInDenom);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SwapAmountOutRoute {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountOutRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.poolId = longToString(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenInDenom = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SwapAmountOutRoute {
    return {
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      tokenInDenom: isSet(object.tokenInDenom) ? String(object.tokenInDenom) : "",
    };
  },

  toJSON(message: SwapAmountOutRoute): unknown {
    const obj: any = {};
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.tokenInDenom !== "") {
      obj.tokenInDenom = message.tokenInDenom;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SwapAmountOutRoute>, I>>(base?: I): SwapAmountOutRoute {
    return SwapAmountOutRoute.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SwapAmountOutRoute>, I>>(object: I): SwapAmountOutRoute {
    const message = createBaseSwapAmountOutRoute();
    message.poolId = object.poolId ?? "0";
    message.tokenInDenom = object.tokenInDenom ?? "";
    return message;
  },
};

function createBaseSwapAmountInSplitRoute(): SwapAmountInSplitRoute {
  return { pools: [], tokenInAmount: "" };
}

export const SwapAmountInSplitRoute = {
  encode(message: SwapAmountInSplitRoute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.pools) {
      SwapAmountInRoute.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.tokenInAmount !== "") {
      writer.uint32(18).string(message.tokenInAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SwapAmountInSplitRoute {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountInSplitRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pools.push(SwapAmountInRoute.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenInAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SwapAmountInSplitRoute {
    return {
      pools: Array.isArray(object?.pools) ? object.pools.map((e: any) => SwapAmountInRoute.fromJSON(e)) : [],
      tokenInAmount: isSet(object.tokenInAmount) ? String(object.tokenInAmount) : "",
    };
  },

  toJSON(message: SwapAmountInSplitRoute): unknown {
    const obj: any = {};
    if (message.pools?.length) {
      obj.pools = message.pools.map((e) => SwapAmountInRoute.toJSON(e));
    }
    if (message.tokenInAmount !== "") {
      obj.tokenInAmount = message.tokenInAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SwapAmountInSplitRoute>, I>>(base?: I): SwapAmountInSplitRoute {
    return SwapAmountInSplitRoute.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SwapAmountInSplitRoute>, I>>(object: I): SwapAmountInSplitRoute {
    const message = createBaseSwapAmountInSplitRoute();
    message.pools = object.pools?.map((e) => SwapAmountInRoute.fromPartial(e)) || [];
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
};

function createBaseSwapAmountOutSplitRoute(): SwapAmountOutSplitRoute {
  return { pools: [], tokenOutAmount: "" };
}

export const SwapAmountOutSplitRoute = {
  encode(message: SwapAmountOutSplitRoute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.pools) {
      SwapAmountOutRoute.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.tokenOutAmount !== "") {
      writer.uint32(18).string(message.tokenOutAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SwapAmountOutSplitRoute {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapAmountOutSplitRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pools.push(SwapAmountOutRoute.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenOutAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SwapAmountOutSplitRoute {
    return {
      pools: Array.isArray(object?.pools) ? object.pools.map((e: any) => SwapAmountOutRoute.fromJSON(e)) : [],
      tokenOutAmount: isSet(object.tokenOutAmount) ? String(object.tokenOutAmount) : "",
    };
  },

  toJSON(message: SwapAmountOutSplitRoute): unknown {
    const obj: any = {};
    if (message.pools?.length) {
      obj.pools = message.pools.map((e) => SwapAmountOutRoute.toJSON(e));
    }
    if (message.tokenOutAmount !== "") {
      obj.tokenOutAmount = message.tokenOutAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SwapAmountOutSplitRoute>, I>>(base?: I): SwapAmountOutSplitRoute {
    return SwapAmountOutSplitRoute.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SwapAmountOutSplitRoute>, I>>(object: I): SwapAmountOutSplitRoute {
    const message = createBaseSwapAmountOutSplitRoute();
    message.pools = object.pools?.map((e) => SwapAmountOutRoute.fromPartial(e)) || [];
    message.tokenOutAmount = object.tokenOutAmount ?? "";
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
