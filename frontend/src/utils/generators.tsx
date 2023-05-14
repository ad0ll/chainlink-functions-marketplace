export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const reduceWordsToCamelCase = (words: string[]): string => {
    return words.reduce((acc, word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return acc + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }, '');
}


export const getRandomAlphaNum = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


export function getRandomAlphaNumHex(length: number): string {
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

