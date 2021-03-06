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

    const replace_words: Array<string> = [];
    for (const target of targets) {
        const word = target.slice(2).slice(0, -2); // (())を除去
        if (word === '') {
            replace_words.push("");
        } 
        else {
            replace_words.push("\u200B" + wordToCiphertext(word) + "\u200B"); // zero width space
        }
    }

    let result = input;
    for (const word of replace_words) {
        result = result.replace(/\(\((.*?)\)\)/, word);
    }
    return result;
}

function wordToCiphertext(word: string) {
    let ciphertext = "";
    const encoder = new TextEncoder();
    const encode_word = encoder.encode(word);
    for (let i = 0;i < encode_word.length; i++) {
        const binary = encode_word[i].toString(2);
        ciphertext += binaryToZeroCode(("00000000" + binary).slice(-8));
    }
    return ciphertext;
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
    const binary_text = Array<number>();
    const binary_word = ciphertextToBinary(ciphertext);
    
    for (let i = 0;i < binary_word.length;i += 8) {
        const byte = binary_word.substr(i, 8);
        binary_text.push(parseInt(byte, 2));
    }
    
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(binary_text));
}

function ciphertextToBinary(ciphertext: string) {
    return ciphertext.replace(/\u200C/g, "0")   // zero width non-joiner
                     .replace(/\u200D/g, "1");  // zero width joiner
}

main();
