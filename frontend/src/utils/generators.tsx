import {ChainlinkFunction, FunctionArg} from "../common";
import randomWords from "random-words";

const COINGECKO_IMAGE_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fquiin.s3.us-east-1.amazonaws.com%2Forganizations%2Fpictures%2F000%2F004%2F638%2Foriginal%2FCoinGecko_Logo.png%3F1585529895&f=1&nofb=1&ipt=dfc0f4402e132a607d0551b69266e4449bfe5edfb5f994fb1e74031edc2b1d5a&ipo=images"

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const reduceWordsToCamelCase = (words: string[]): string => {
    return words.reduce((acc, word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return acc + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }, '');
}
export const generateRandomFunction = (): ChainlinkFunction => {
    const imageUrls = [
        "broken ass image url",
        COINGECKO_IMAGE_URL
    ]

    const supportedReturnTypes = ["uint256", "string"]
    const randName = randomWords({
        exactly: getRandomInt(3, 20),
        formatter: (word) => word.slice(0, 1).toUpperCase().concat(word.slice(1))
    }).join(" ")
    const randDesc = randomWords({
        exactly: getRandomInt(8, 75),
        formatter: (word) => word.slice(0, 1).toUpperCase().concat(word.slice(1))
    }).join(" ")

    const params: FunctionArg[] = []
    const nParams = getRandomInt(2, 6)
    for (let i = 0; i < nParams; i++) {
        const paramName = reduceWordsToCamelCase(randomWords({
            exactly: getRandomInt(1, 3),
        }))
        const paramType = supportedReturnTypes[getRandomInt(0, supportedReturnTypes.length - 1)]
        const hasDefault = getRandomInt(0, 1)
        let defa = ""
        if (hasDefault === 1) {
            if (paramType === "string") {
                defa = randomWords(3).join('')
            } else if (paramType === "uint256") {
                defa = getRandomInt(0, 1000000).toString()
            }
        }
        params.push({
            name: paramName,
            type: paramType,
            defaultValue: defa
        })
    }

    return {
        address: garbageAddressGenerator(),
        description: randDesc,
        estimatedGas: getRandomInt(100000, 1000000),
        estimatedGasToken: "MATIC",
        expectedArgs: params,
        fee: getRandomInt(100000, 1000000) / (10 ** getRandomInt(3, 8)),
        functionType: "Price Feed",
        imageUrl: imageUrls[getRandomInt(0, imageUrls.length - 1)],
        name: randName,
        owner: garbageAddressGenerator(),
        source: `console.log("hello world")`,
    }
}

function getRandomAlphaNum(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


export function getRandomAlphaNumHex(length: number) {
    let result = '';
    const characters = 'ABCDEFabcdef0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function garbageAddressGenerator(): string {
    return "0x" + getRandomAlphaNumHex(40)
}