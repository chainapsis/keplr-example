"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coins = exports.coin = void 0;
const math_1 = require("@cosmjs/math");
/** Creates a coin */
function coin(amount, denom) {
    return { amount: new math_1.Uint53(amount).toString(), denom: denom };
}
exports.coin = coin;
/** Creates a list of coins with one element */
function coins(amount, denom) {
    return [coin(amount, denom)];
}
exports.coins = coins;
//# sourceMappingURL=coins.js.map