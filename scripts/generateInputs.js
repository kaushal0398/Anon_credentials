"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var fs_1 = require("fs");
// --- Parameters ---
var secrets = ["alice", "bob", "carol", "dave", "eve", "frank", "grace", "heidi"];
var signal = 42;
var nullifierSecret = 123n;
var indexToProve = 3; // pick "dave"
var treeDepth = 3;
// --- Pedersen-like dummy hash (replace with poseidon/pedersen lib in prod) ---
function hash(a, b) {
    var input = a.toString() + b.toString();
    var digest = crypto_1.default.createHash("sha256").update(input).digest("hex");
    return BigInt("0x" + digest) % Math.pow(BigInt(2), 251n);
}
function leafHash(secret) {
    var bytes = Buffer.from(secret);
    var digest = crypto_1.default.createHash("sha256").update(bytes).digest("hex");
    return BigInt("0x" + digest) % Math.pow(BigInt(2), 251n);
}
// --- Build Merkle Tree ---
var leaves = secrets.map(leafHash);
var tree = [leaves];
for (var level = 0; level < treeDepth; level++) {
    var prev = tree[level];
    var next = [];
    for (var i = 0; i < prev.length; i += 2) {
        next.push(hash(prev[i], prev[i + 1]));
    }
    tree.push(next);
}
var root = tree[treeDepth][0];
var leaf = leaves[indexToProve];
var idx = indexToProve;
var path = [];
for (var level = 0; level < treeDepth; level++) {
    var siblingIndex = idx ^ 1;
    path.push(tree[level][siblingIndex]);
    idx = Math.floor(idx / 2);
}
var nullifierHash = hash(nullifierSecret, BigInt(signal));
// --- Output Prover.toml ---
var proverToml = "\nleaf = \"".concat(leaf, "\"\nindex = \"").concat(indexToProve, "\"\npath = [").concat(path.map(function (x) { return "\"".concat(x, "\""); }).join(", "), "]\nnullifier_secret = \"").concat(nullifierSecret, "\"\nsignal = \"").concat(signal, "\"\nroot = \"").concat(root, "\"\n");
fs_1.default.writeFileSync("Prover.toml", proverToml);
console.log("✅ Prover.toml generated!");
