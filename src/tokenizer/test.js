import tokenizer from "./tokenizer.js";
import { readFileSync } from "fs";

let cfg = readFileSync("sample.txt", "utf8")

console.log(tokenizer(cfg))