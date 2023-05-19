// Basic recreation of some key parts of the functions library code (which is transpiled in the starter repo)
import axios, {AxiosRequestConfig} from "axios";

const MAX_UINT256 = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935")
const MAX_INT256 = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819967")
const MAX_NEG_INT256 = BigInt("-57896044618658097711785492504343953926634992332820282019728792003956564819968")


export class Functions {

    static async makeHttpRequest(config: AxiosRequestConfig) {
        return axios.request(config);
    }

    static encodeUint256(result: number | string | bigint): Buffer {
        if (typeof result === "number") {
            if (!Number.isInteger(result)) {
                throw Error("encodeUint256 invalid input")
            }
            if (result < 0) {
                throw Error("encodeUint256 invalid input")
            }
            // Convert the result into a bigint and re-call this function to hit the below conditionsal
            return this.encodeUint256(BigInt(result))
        }
        if (typeof result === "bigint") {
            if (result > MAX_UINT256) {
                throw Error("encodeUint256 invalid input")
            }
            if (result < BigInt(0)) {
                throw Error("encodeUint256 invalid input")
            }
            if (result === BigInt(0)) {
                return Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex")
            }
            const hex = result.toString(16).padStart(64, "0")
            return Buffer.from(hex, "hex")
        }
        throw Error("encodeUint256 invalid input")
    }

    static encodeInt256(result: number | string | bigint): Buffer {
        if (typeof result === "number") {
            if (!Number.isInteger(result)) {
                throw Error("encodeInt256 invalid input")
            }
            return this.encodeInt256(BigInt(result))
        }
        if (typeof result !== "bigint") {
            throw Error("encodeInt256 invalid input")
        }
        if (result < MAX_NEG_INT256) {
            throw Error("encodeInt256 invalid input")
        }
        if (result > MAX_INT256) {
            throw Error("encodeInt256 invalid input")
        }
        if (result < BigInt(0)) {
            return this.encodeNegSignedInt(result)
        }
        return this.encodePosSignedInt(result)
    }

    static encodeString(result: string): Buffer {
        if (typeof result !== "string") {
            throw Error("encodeString invalid input")
        }
        return Buffer.from(result)
    }

    static encodePosSignedInt(val: bigint): Buffer {
        const hex = val.toString(16).padStart(64, "0")
        return Buffer.from(hex, "hex")
    }

    static encodeNegSignedInt(val: bigint): Buffer {
        const overflowingHex = (BigInt(2) ** BigInt(256) + val).toString(16)
        const int256Hex = overflowingHex.slice(-64)
        return Buffer.from(int256Hex, "hex")
    }
}