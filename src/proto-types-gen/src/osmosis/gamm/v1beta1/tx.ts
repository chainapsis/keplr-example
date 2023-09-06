/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { SwapAmountInRoute, SwapAmountOutRoute } from "../../poolmanager/v1beta1/swap_route";

export const protobufPackage = "osmosis.gamm.v1beta1";

/**
 * ===================== MsgJoinPool
 * This is really MsgJoinPoolNoSwap
 */
export interface MsgJoinPool {
  sender: string;
  poolId: string;
  shareOutAmount: string;
  tokenInMaxs: Coin[];
}

export interface MsgJoinPoolResponse {
  shareOutAmount: string;
  tokenIn: Coin[];
}

/** ===================== MsgExitPool */
export interface MsgExitPool {
  sender: string;
  poolId: string;
  shareInAmount: string;
  tokenOutMins: Coin[];
}

export interface MsgExitPoolResponse {
  tokenOut: Coin[];
}

/** ===================== MsgSwapExactAmountIn */
export interface MsgSwapExactAmountIn {
  sender: string;
  routes: SwapAmountInRoute[];
  tokenIn: Coin | undefined;
  tokenOutMinAmount: string;
}

export interface MsgSwapExactAmountInResponse {
  tokenOutAmount: string;
}

export interface MsgSwapExactAmountOut {
  sender: string;
  routes: SwapAmountOutRoute[];
  tokenInMaxAmount: string;
  tokenOut: Coin | undefined;
}

export interface MsgSwapExactAmountOutResponse {
  tokenInAmount: string;
}

/**
 * ===================== MsgJoinSwapExternAmountIn
 * TODO: Rename to MsgJoinSwapExactAmountIn
 */
export interface MsgJoinSwapExternAmountIn {
  sender: string;
  poolId: string;
  tokenIn:
    | Coin
    | undefined;
  /**
   * repeated cosmos.base.v1beta1.Coin tokensIn = 5 [
   *   (gogoproto.moretags) = "yaml:\"tokens_in\"",
   *   (gogoproto.nullable) = false
   * ];
   */
  shareOutMinAmount: string;
}

export interface MsgJoinSwapExternAmountInResponse {
  shareOutAmount: string;
}

/** ===================== MsgJoinSwapShareAmountOut */
export interface MsgJoinSwapShareAmountOut {
  sender: string;
  poolId: string;
  tokenInDenom: string;
  shareOutAmount: string;
  tokenInMaxAmount: string;
}

export interface MsgJoinSwapShareAmountOutResponse {
  tokenInAmount: string;
}

/** ===================== MsgExitSwapShareAmountIn */
export interface MsgExitSwapShareAmountIn {
  sender: string;
  poolId: string;
  tokenOutDenom: string;
  shareInAmount: string;
  tokenOutMinAmount: string;
}

export interface MsgExitSwapShareAmountInResponse {
  tokenOutAmount: string;
}

/** ===================== MsgExitSwapExternAmountOut */
export interface MsgExitSwapExternAmountOut {
  sender: string;
  poolId: string;
  tokenOut: Coin | undefined;
  shareInMaxAmount: string;
}

export interface MsgExitSwapExternAmountOutResponse {
  shareInAmount: string;
}

function createBaseMsgJoinPool(): MsgJoinPool {
  return { sender: "", poolId: "0", shareOutAmount: "", tokenInMaxs: [] };
}

export const MsgJoinPool = {
  encode(message: MsgJoinPool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.shareOutAmount !== "") {
      writer.uint32(26).string(message.shareOutAmount);
    }
    for (const v of message.tokenInMaxs) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinPool {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinPool();
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
          if (tag !== 26) {
            break;
          }

          message.shareOutAmount = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tokenInMaxs.push(Coin.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgJoinPool {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      shareOutAmount: isSet(object.shareOutAmount) ? String(object.shareOutAmount) : "",
      tokenInMaxs: Array.isArray(object?.tokenInMaxs) ? object.tokenInMaxs.map((e: any) => Coin.fromJSON(e)) : [],
    };
  },

  toJSON(message: MsgJoinPool): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.shareOutAmount !== "") {
      obj.shareOutAmount = message.shareOutAmount;
    }
    if (message.tokenInMaxs?.length) {
      obj.tokenInMaxs = message.tokenInMaxs.map((e) => Coin.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgJoinPool>, I>>(base?: I): MsgJoinPool {
    return MsgJoinPool.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgJoinPool>, I>>(object: I): MsgJoinPool {
    const message = createBaseMsgJoinPool();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.shareOutAmount = object.shareOutAmount ?? "";
    message.tokenInMaxs = object.tokenInMaxs?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgJoinPoolResponse(): MsgJoinPoolResponse {
  return { shareOutAmount: "", tokenIn: [] };
}

export const MsgJoinPoolResponse = {
  encode(message: MsgJoinPoolResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.shareOutAmount !== "") {
      writer.uint32(10).string(message.shareOutAmount);
    }
    for (const v of message.tokenIn) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinPoolResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinPoolResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.shareOutAmount = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenIn.push(Coin.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgJoinPoolResponse {
    return {
      shareOutAmount: isSet(object.shareOutAmount) ? String(object.shareOutAmount) : "",
      tokenIn: Array.isArray(object?.tokenIn) ? object.tokenIn.map((e: any) => Coin.fromJSON(e)) : [],
    };
  },

  toJSON(message: MsgJoinPoolResponse): unknown {
    const obj: any = {};
    if (message.shareOutAmount !== "") {
      obj.shareOutAmount = message.shareOutAmount;
    }
    if (message.tokenIn?.length) {
      obj.tokenIn = message.tokenIn.map((e) => Coin.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgJoinPoolResponse>, I>>(base?: I): MsgJoinPoolResponse {
    return MsgJoinPoolResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgJoinPoolResponse>, I>>(object: I): MsgJoinPoolResponse {
    const message = createBaseMsgJoinPoolResponse();
    message.shareOutAmount = object.shareOutAmount ?? "";
    message.tokenIn = object.tokenIn?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgExitPool(): MsgExitPool {
  return { sender: "", poolId: "0", shareInAmount: "", tokenOutMins: [] };
}

export const MsgExitPool = {
  encode(message: MsgExitPool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.shareInAmount !== "") {
      writer.uint32(26).string(message.shareInAmount);
    }
    for (const v of message.tokenOutMins) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitPool {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitPool();
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
          if (tag !== 26) {
            break;
          }

          message.shareInAmount = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tokenOutMins.push(Coin.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgExitPool {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      shareInAmount: isSet(object.shareInAmount) ? String(object.shareInAmount) : "",
      tokenOutMins: Array.isArray(object?.tokenOutMins) ? object.tokenOutMins.map((e: any) => Coin.fromJSON(e)) : [],
    };
  },

  toJSON(message: MsgExitPool): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.shareInAmount !== "") {
      obj.shareInAmount = message.shareInAmount;
    }
    if (message.tokenOutMins?.length) {
      obj.tokenOutMins = message.tokenOutMins.map((e) => Coin.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExitPool>, I>>(base?: I): MsgExitPool {
    return MsgExitPool.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExitPool>, I>>(object: I): MsgExitPool {
    const message = createBaseMsgExitPool();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.shareInAmount = object.shareInAmount ?? "";
    message.tokenOutMins = object.tokenOutMins?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgExitPoolResponse(): MsgExitPoolResponse {
  return { tokenOut: [] };
}

export const MsgExitPoolResponse = {
  encode(message: MsgExitPoolResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.tokenOut) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitPoolResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitPoolResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tokenOut.push(Coin.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgExitPoolResponse {
    return { tokenOut: Array.isArray(object?.tokenOut) ? object.tokenOut.map((e: any) => Coin.fromJSON(e)) : [] };
  },

  toJSON(message: MsgExitPoolResponse): unknown {
    const obj: any = {};
    if (message.tokenOut?.length) {
      obj.tokenOut = message.tokenOut.map((e) => Coin.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExitPoolResponse>, I>>(base?: I): MsgExitPoolResponse {
    return MsgExitPoolResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExitPoolResponse>, I>>(object: I): MsgExitPoolResponse {
    const message = createBaseMsgExitPoolResponse();
    message.tokenOut = object.tokenOut?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgSwapExactAmountIn(): MsgSwapExactAmountIn {
  return { sender: "", routes: [], tokenIn: undefined, tokenOutMinAmount: "" };
}

export const MsgSwapExactAmountIn = {
  encode(message: MsgSwapExactAmountIn, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.routes) {
      SwapAmountInRoute.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.tokenIn !== undefined) {
      Coin.encode(message.tokenIn, writer.uint32(26).fork()).ldelim();
    }
    if (message.tokenOutMinAmount !== "") {
      writer.uint32(34).string(message.tokenOutMinAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSwapExactAmountIn {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountIn();
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

          message.routes.push(SwapAmountInRoute.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tokenIn = Coin.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tokenOutMinAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSwapExactAmountIn {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      routes: Array.isArray(object?.routes) ? object.routes.map((e: any) => SwapAmountInRoute.fromJSON(e)) : [],
      tokenIn: isSet(object.tokenIn) ? Coin.fromJSON(object.tokenIn) : undefined,
      tokenOutMinAmount: isSet(object.tokenOutMinAmount) ? String(object.tokenOutMinAmount) : "",
    };
  },

  toJSON(message: MsgSwapExactAmountIn): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.routes?.length) {
      obj.routes = message.routes.map((e) => SwapAmountInRoute.toJSON(e));
    }
    if (message.tokenIn !== undefined) {
      obj.tokenIn = Coin.toJSON(message.tokenIn);
    }
    if (message.tokenOutMinAmount !== "") {
      obj.tokenOutMinAmount = message.tokenOutMinAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSwapExactAmountIn>, I>>(base?: I): MsgSwapExactAmountIn {
    return MsgSwapExactAmountIn.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSwapExactAmountIn>, I>>(object: I): MsgSwapExactAmountIn {
    const message = createBaseMsgSwapExactAmountIn();
    message.sender = object.sender ?? "";
    message.routes = object.routes?.map((e) => SwapAmountInRoute.fromPartial(e)) || [];
    message.tokenIn = (object.tokenIn !== undefined && object.tokenIn !== null)
      ? Coin.fromPartial(object.tokenIn)
      : undefined;
    message.tokenOutMinAmount = object.tokenOutMinAmount ?? "";
    return message;
  },
};

function createBaseMsgSwapExactAmountInResponse(): MsgSwapExactAmountInResponse {
  return { tokenOutAmount: "" };
}

export const MsgSwapExactAmountInResponse = {
  encode(message: MsgSwapExactAmountInResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenOutAmount !== "") {
      writer.uint32(10).string(message.tokenOutAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSwapExactAmountInResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountInResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): MsgSwapExactAmountInResponse {
    return { tokenOutAmount: isSet(object.tokenOutAmount) ? String(object.tokenOutAmount) : "" };
  },

  toJSON(message: MsgSwapExactAmountInResponse): unknown {
    const obj: any = {};
    if (message.tokenOutAmount !== "") {
      obj.tokenOutAmount = message.tokenOutAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSwapExactAmountInResponse>, I>>(base?: I): MsgSwapExactAmountInResponse {
    return MsgSwapExactAmountInResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSwapExactAmountInResponse>, I>>(object: I): MsgSwapExactAmountInResponse {
    const message = createBaseMsgSwapExactAmountInResponse();
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
};

function createBaseMsgSwapExactAmountOut(): MsgSwapExactAmountOut {
  return { sender: "", routes: [], tokenInMaxAmount: "", tokenOut: undefined };
}

export const MsgSwapExactAmountOut = {
  encode(message: MsgSwapExactAmountOut, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.routes) {
      SwapAmountOutRoute.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.tokenInMaxAmount !== "") {
      writer.uint32(26).string(message.tokenInMaxAmount);
    }
    if (message.tokenOut !== undefined) {
      Coin.encode(message.tokenOut, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSwapExactAmountOut {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountOut();
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

          message.routes.push(SwapAmountOutRoute.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tokenInMaxAmount = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tokenOut = Coin.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSwapExactAmountOut {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      routes: Array.isArray(object?.routes) ? object.routes.map((e: any) => SwapAmountOutRoute.fromJSON(e)) : [],
      tokenInMaxAmount: isSet(object.tokenInMaxAmount) ? String(object.tokenInMaxAmount) : "",
      tokenOut: isSet(object.tokenOut) ? Coin.fromJSON(object.tokenOut) : undefined,
    };
  },

  toJSON(message: MsgSwapExactAmountOut): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.routes?.length) {
      obj.routes = message.routes.map((e) => SwapAmountOutRoute.toJSON(e));
    }
    if (message.tokenInMaxAmount !== "") {
      obj.tokenInMaxAmount = message.tokenInMaxAmount;
    }
    if (message.tokenOut !== undefined) {
      obj.tokenOut = Coin.toJSON(message.tokenOut);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSwapExactAmountOut>, I>>(base?: I): MsgSwapExactAmountOut {
    return MsgSwapExactAmountOut.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSwapExactAmountOut>, I>>(object: I): MsgSwapExactAmountOut {
    const message = createBaseMsgSwapExactAmountOut();
    message.sender = object.sender ?? "";
    message.routes = object.routes?.map((e) => SwapAmountOutRoute.fromPartial(e)) || [];
    message.tokenInMaxAmount = object.tokenInMaxAmount ?? "";
    message.tokenOut = (object.tokenOut !== undefined && object.tokenOut !== null)
      ? Coin.fromPartial(object.tokenOut)
      : undefined;
    return message;
  },
};

function createBaseMsgSwapExactAmountOutResponse(): MsgSwapExactAmountOutResponse {
  return { tokenInAmount: "" };
}

export const MsgSwapExactAmountOutResponse = {
  encode(message: MsgSwapExactAmountOutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenInAmount !== "") {
      writer.uint32(10).string(message.tokenInAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSwapExactAmountOutResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapExactAmountOutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): MsgSwapExactAmountOutResponse {
    return { tokenInAmount: isSet(object.tokenInAmount) ? String(object.tokenInAmount) : "" };
  },

  toJSON(message: MsgSwapExactAmountOutResponse): unknown {
    const obj: any = {};
    if (message.tokenInAmount !== "") {
      obj.tokenInAmount = message.tokenInAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSwapExactAmountOutResponse>, I>>(base?: I): MsgSwapExactAmountOutResponse {
    return MsgSwapExactAmountOutResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSwapExactAmountOutResponse>, I>>(
    object: I,
  ): MsgSwapExactAmountOutResponse {
    const message = createBaseMsgSwapExactAmountOutResponse();
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapExternAmountIn(): MsgJoinSwapExternAmountIn {
  return { sender: "", poolId: "0", tokenIn: undefined, shareOutMinAmount: "" };
}

export const MsgJoinSwapExternAmountIn = {
  encode(message: MsgJoinSwapExternAmountIn, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.tokenIn !== undefined) {
      Coin.encode(message.tokenIn, writer.uint32(26).fork()).ldelim();
    }
    if (message.shareOutMinAmount !== "") {
      writer.uint32(34).string(message.shareOutMinAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinSwapExternAmountIn {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapExternAmountIn();
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
          if (tag !== 26) {
            break;
          }

          message.tokenIn = Coin.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.shareOutMinAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgJoinSwapExternAmountIn {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      tokenIn: isSet(object.tokenIn) ? Coin.fromJSON(object.tokenIn) : undefined,
      shareOutMinAmount: isSet(object.shareOutMinAmount) ? String(object.shareOutMinAmount) : "",
    };
  },

  toJSON(message: MsgJoinSwapExternAmountIn): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.tokenIn !== undefined) {
      obj.tokenIn = Coin.toJSON(message.tokenIn);
    }
    if (message.shareOutMinAmount !== "") {
      obj.shareOutMinAmount = message.shareOutMinAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgJoinSwapExternAmountIn>, I>>(base?: I): MsgJoinSwapExternAmountIn {
    return MsgJoinSwapExternAmountIn.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgJoinSwapExternAmountIn>, I>>(object: I): MsgJoinSwapExternAmountIn {
    const message = createBaseMsgJoinSwapExternAmountIn();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.tokenIn = (object.tokenIn !== undefined && object.tokenIn !== null)
      ? Coin.fromPartial(object.tokenIn)
      : undefined;
    message.shareOutMinAmount = object.shareOutMinAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapExternAmountInResponse(): MsgJoinSwapExternAmountInResponse {
  return { shareOutAmount: "" };
}

export const MsgJoinSwapExternAmountInResponse = {
  encode(message: MsgJoinSwapExternAmountInResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.shareOutAmount !== "") {
      writer.uint32(10).string(message.shareOutAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinSwapExternAmountInResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapExternAmountInResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.shareOutAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgJoinSwapExternAmountInResponse {
    return { shareOutAmount: isSet(object.shareOutAmount) ? String(object.shareOutAmount) : "" };
  },

  toJSON(message: MsgJoinSwapExternAmountInResponse): unknown {
    const obj: any = {};
    if (message.shareOutAmount !== "") {
      obj.shareOutAmount = message.shareOutAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgJoinSwapExternAmountInResponse>, I>>(
    base?: I,
  ): MsgJoinSwapExternAmountInResponse {
    return MsgJoinSwapExternAmountInResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgJoinSwapExternAmountInResponse>, I>>(
    object: I,
  ): MsgJoinSwapExternAmountInResponse {
    const message = createBaseMsgJoinSwapExternAmountInResponse();
    message.shareOutAmount = object.shareOutAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapShareAmountOut(): MsgJoinSwapShareAmountOut {
  return { sender: "", poolId: "0", tokenInDenom: "", shareOutAmount: "", tokenInMaxAmount: "" };
}

export const MsgJoinSwapShareAmountOut = {
  encode(message: MsgJoinSwapShareAmountOut, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.tokenInDenom !== "") {
      writer.uint32(26).string(message.tokenInDenom);
    }
    if (message.shareOutAmount !== "") {
      writer.uint32(34).string(message.shareOutAmount);
    }
    if (message.tokenInMaxAmount !== "") {
      writer.uint32(42).string(message.tokenInMaxAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinSwapShareAmountOut {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapShareAmountOut();
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
          if (tag !== 26) {
            break;
          }

          message.tokenInDenom = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.shareOutAmount = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.tokenInMaxAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgJoinSwapShareAmountOut {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      tokenInDenom: isSet(object.tokenInDenom) ? String(object.tokenInDenom) : "",
      shareOutAmount: isSet(object.shareOutAmount) ? String(object.shareOutAmount) : "",
      tokenInMaxAmount: isSet(object.tokenInMaxAmount) ? String(object.tokenInMaxAmount) : "",
    };
  },

  toJSON(message: MsgJoinSwapShareAmountOut): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.tokenInDenom !== "") {
      obj.tokenInDenom = message.tokenInDenom;
    }
    if (message.shareOutAmount !== "") {
      obj.shareOutAmount = message.shareOutAmount;
    }
    if (message.tokenInMaxAmount !== "") {
      obj.tokenInMaxAmount = message.tokenInMaxAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgJoinSwapShareAmountOut>, I>>(base?: I): MsgJoinSwapShareAmountOut {
    return MsgJoinSwapShareAmountOut.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgJoinSwapShareAmountOut>, I>>(object: I): MsgJoinSwapShareAmountOut {
    const message = createBaseMsgJoinSwapShareAmountOut();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.tokenInDenom = object.tokenInDenom ?? "";
    message.shareOutAmount = object.shareOutAmount ?? "";
    message.tokenInMaxAmount = object.tokenInMaxAmount ?? "";
    return message;
  },
};

function createBaseMsgJoinSwapShareAmountOutResponse(): MsgJoinSwapShareAmountOutResponse {
  return { tokenInAmount: "" };
}

export const MsgJoinSwapShareAmountOutResponse = {
  encode(message: MsgJoinSwapShareAmountOutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenInAmount !== "") {
      writer.uint32(10).string(message.tokenInAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinSwapShareAmountOutResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgJoinSwapShareAmountOutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): MsgJoinSwapShareAmountOutResponse {
    return { tokenInAmount: isSet(object.tokenInAmount) ? String(object.tokenInAmount) : "" };
  },

  toJSON(message: MsgJoinSwapShareAmountOutResponse): unknown {
    const obj: any = {};
    if (message.tokenInAmount !== "") {
      obj.tokenInAmount = message.tokenInAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgJoinSwapShareAmountOutResponse>, I>>(
    base?: I,
  ): MsgJoinSwapShareAmountOutResponse {
    return MsgJoinSwapShareAmountOutResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgJoinSwapShareAmountOutResponse>, I>>(
    object: I,
  ): MsgJoinSwapShareAmountOutResponse {
    const message = createBaseMsgJoinSwapShareAmountOutResponse();
    message.tokenInAmount = object.tokenInAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapShareAmountIn(): MsgExitSwapShareAmountIn {
  return { sender: "", poolId: "0", tokenOutDenom: "", shareInAmount: "", tokenOutMinAmount: "" };
}

export const MsgExitSwapShareAmountIn = {
  encode(message: MsgExitSwapShareAmountIn, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.tokenOutDenom !== "") {
      writer.uint32(26).string(message.tokenOutDenom);
    }
    if (message.shareInAmount !== "") {
      writer.uint32(34).string(message.shareInAmount);
    }
    if (message.tokenOutMinAmount !== "") {
      writer.uint32(42).string(message.tokenOutMinAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitSwapShareAmountIn {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapShareAmountIn();
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
          if (tag !== 26) {
            break;
          }

          message.tokenOutDenom = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.shareInAmount = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.tokenOutMinAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgExitSwapShareAmountIn {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      tokenOutDenom: isSet(object.tokenOutDenom) ? String(object.tokenOutDenom) : "",
      shareInAmount: isSet(object.shareInAmount) ? String(object.shareInAmount) : "",
      tokenOutMinAmount: isSet(object.tokenOutMinAmount) ? String(object.tokenOutMinAmount) : "",
    };
  },

  toJSON(message: MsgExitSwapShareAmountIn): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.tokenOutDenom !== "") {
      obj.tokenOutDenom = message.tokenOutDenom;
    }
    if (message.shareInAmount !== "") {
      obj.shareInAmount = message.shareInAmount;
    }
    if (message.tokenOutMinAmount !== "") {
      obj.tokenOutMinAmount = message.tokenOutMinAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExitSwapShareAmountIn>, I>>(base?: I): MsgExitSwapShareAmountIn {
    return MsgExitSwapShareAmountIn.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExitSwapShareAmountIn>, I>>(object: I): MsgExitSwapShareAmountIn {
    const message = createBaseMsgExitSwapShareAmountIn();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.tokenOutDenom = object.tokenOutDenom ?? "";
    message.shareInAmount = object.shareInAmount ?? "";
    message.tokenOutMinAmount = object.tokenOutMinAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapShareAmountInResponse(): MsgExitSwapShareAmountInResponse {
  return { tokenOutAmount: "" };
}

export const MsgExitSwapShareAmountInResponse = {
  encode(message: MsgExitSwapShareAmountInResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenOutAmount !== "") {
      writer.uint32(10).string(message.tokenOutAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitSwapShareAmountInResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapShareAmountInResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): MsgExitSwapShareAmountInResponse {
    return { tokenOutAmount: isSet(object.tokenOutAmount) ? String(object.tokenOutAmount) : "" };
  },

  toJSON(message: MsgExitSwapShareAmountInResponse): unknown {
    const obj: any = {};
    if (message.tokenOutAmount !== "") {
      obj.tokenOutAmount = message.tokenOutAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExitSwapShareAmountInResponse>, I>>(
    base?: I,
  ): MsgExitSwapShareAmountInResponse {
    return MsgExitSwapShareAmountInResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExitSwapShareAmountInResponse>, I>>(
    object: I,
  ): MsgExitSwapShareAmountInResponse {
    const message = createBaseMsgExitSwapShareAmountInResponse();
    message.tokenOutAmount = object.tokenOutAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapExternAmountOut(): MsgExitSwapExternAmountOut {
  return { sender: "", poolId: "0", tokenOut: undefined, shareInMaxAmount: "" };
}

export const MsgExitSwapExternAmountOut = {
  encode(message: MsgExitSwapExternAmountOut, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.poolId !== "0") {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.tokenOut !== undefined) {
      Coin.encode(message.tokenOut, writer.uint32(26).fork()).ldelim();
    }
    if (message.shareInMaxAmount !== "") {
      writer.uint32(34).string(message.shareInMaxAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitSwapExternAmountOut {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapExternAmountOut();
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
          if (tag !== 26) {
            break;
          }

          message.tokenOut = Coin.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.shareInMaxAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgExitSwapExternAmountOut {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      poolId: isSet(object.poolId) ? String(object.poolId) : "0",
      tokenOut: isSet(object.tokenOut) ? Coin.fromJSON(object.tokenOut) : undefined,
      shareInMaxAmount: isSet(object.shareInMaxAmount) ? String(object.shareInMaxAmount) : "",
    };
  },

  toJSON(message: MsgExitSwapExternAmountOut): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.poolId !== "0") {
      obj.poolId = message.poolId;
    }
    if (message.tokenOut !== undefined) {
      obj.tokenOut = Coin.toJSON(message.tokenOut);
    }
    if (message.shareInMaxAmount !== "") {
      obj.shareInMaxAmount = message.shareInMaxAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExitSwapExternAmountOut>, I>>(base?: I): MsgExitSwapExternAmountOut {
    return MsgExitSwapExternAmountOut.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExitSwapExternAmountOut>, I>>(object: I): MsgExitSwapExternAmountOut {
    const message = createBaseMsgExitSwapExternAmountOut();
    message.sender = object.sender ?? "";
    message.poolId = object.poolId ?? "0";
    message.tokenOut = (object.tokenOut !== undefined && object.tokenOut !== null)
      ? Coin.fromPartial(object.tokenOut)
      : undefined;
    message.shareInMaxAmount = object.shareInMaxAmount ?? "";
    return message;
  },
};

function createBaseMsgExitSwapExternAmountOutResponse(): MsgExitSwapExternAmountOutResponse {
  return { shareInAmount: "" };
}

export const MsgExitSwapExternAmountOutResponse = {
  encode(message: MsgExitSwapExternAmountOutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.shareInAmount !== "") {
      writer.uint32(10).string(message.shareInAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExitSwapExternAmountOutResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExitSwapExternAmountOutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.shareInAmount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgExitSwapExternAmountOutResponse {
    return { shareInAmount: isSet(object.shareInAmount) ? String(object.shareInAmount) : "" };
  },

  toJSON(message: MsgExitSwapExternAmountOutResponse): unknown {
    const obj: any = {};
    if (message.shareInAmount !== "") {
      obj.shareInAmount = message.shareInAmount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExitSwapExternAmountOutResponse>, I>>(
    base?: I,
  ): MsgExitSwapExternAmountOutResponse {
    return MsgExitSwapExternAmountOutResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExitSwapExternAmountOutResponse>, I>>(
    object: I,
  ): MsgExitSwapExternAmountOutResponse {
    const message = createBaseMsgExitSwapExternAmountOutResponse();
    message.shareInAmount = object.shareInAmount ?? "";
    return message;
  },
};

export interface Msg {
  JoinPool(request: MsgJoinPool): Promise<MsgJoinPoolResponse>;
  ExitPool(request: MsgExitPool): Promise<MsgExitPoolResponse>;
  SwapExactAmountIn(request: MsgSwapExactAmountIn): Promise<MsgSwapExactAmountInResponse>;
  SwapExactAmountOut(request: MsgSwapExactAmountOut): Promise<MsgSwapExactAmountOutResponse>;
  JoinSwapExternAmountIn(request: MsgJoinSwapExternAmountIn): Promise<MsgJoinSwapExternAmountInResponse>;
  JoinSwapShareAmountOut(request: MsgJoinSwapShareAmountOut): Promise<MsgJoinSwapShareAmountOutResponse>;
  ExitSwapExternAmountOut(request: MsgExitSwapExternAmountOut): Promise<MsgExitSwapExternAmountOutResponse>;
  ExitSwapShareAmountIn(request: MsgExitSwapShareAmountIn): Promise<MsgExitSwapShareAmountInResponse>;
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
