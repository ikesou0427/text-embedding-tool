import { readFileSync, writeFileSync } from "fs";

function main() {
    const input = readFileSync("./input", "utf8");
    
    let result = '';
    if (process.argv[2] === 'encode') {
        result = encode(input);
    } 
    else if (process.argv[2] === 'decode') {
        result = decode(input);
    } 
    else {
        throw new Error('コマンドを指定してください。')
    }
    
    writeFileSync("./output", result);
}

function encode(input: string): string {
    const targets = input.match(/\(\((.*?)\)\)/g);
    if (targets === null) {
        console.log("変換対象がありませんでした。");
        return '';
    }

    const reqlace_words: Array<string> = [];
    for (const target of targets) {
        const word = target.slice(2).slice(0, -2); // (())を除去
        if (word === '') {
            reqlace_words.push("");
        } 
        else {
            reqlace_words.push("\u200B" + wordToCiphertext(word) + "\u200B"); // zero width space
        }
    }

    let result = input;
    for (const word of reqlace_words) {
        result = result.replace(/\(\((.*?)\)\)/, word);
    }
    return result;
}

function wordToCiphertext(word: string) {
    const zero_codes: Array<string> = [];
    for (const char of word) {
        const unicode = char.charCodeAt(0);
        const binary = decimalToBinary(unicode);
        const ciphertext = binaryToZeroCode(binary);
        zero_codes.push(ciphertext);
    }
    return zero_codes.join("\uFEFF"); // BOM
}

function decimalToBinary(num: number): string {
    const binary = num.toString(2);
    const binary_array = binary.split('');
    let result = '';
    while (0 < binary_array.length) {
        const byte = binary_array.splice(-8);
        result = ("00000000" + byte.join('')).slice(-8) + result;
    }
    return result;
}

function binaryToZeroCode(binary: string) {
    return binary.replace(/0/g, "\u200C")   // zero width non-joiner
                 .replace(/1/g, "\u200D");  // zero width joiner
}

function decode(input: string) {
    const targets = input.match(/\u200B(.*?)\u200B/g); // zero width space
    if (targets === null) {
        console.log("変換対象がありませんでした。");
        return '';
    }

    const reqlace_words: Array<string> = [];
    for (const target of targets) {
        const word = target.slice(1).slice(0, -1); // \u200Bを除去
        if (word === '') {
            reqlace_words.push("");
        } 
        else {
            reqlace_words.push(ciphertextToWord(word));
        }
    }

    let result = input;
    for (const word of reqlace_words) {
        result = result.replace(/\u200B(.*?)\u200B/, word);
    }
    return result;
}

function ciphertextToWord(ciphertext: string): string {
    let result = '';

    const binary_word = ciphertextToBinary(ciphertext);
    for (const binary_char of binary_word.split("\uFEFF")) { // BOM
        result += String.fromCharCode(parseInt(binary_char, 2));
    }

    return result;
}

function ciphertextToBinary(ciphertext: string) {
    return ciphertext.replace(/\u200C/g, "0").replace(/\u200D/g, "1");
}

main();
