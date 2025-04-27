import crypto from "crypto";
import fs from "fs";
import path from "path";

// --- Parameters ---
const secrets = ["alice", "bob", "carol", "dave", "eve", "frank", "grace", "heidi"];
const signal = 42;
const epoch = 1;
const nullifierSecret = 123n;
const indexToProve = 3; // pick "dave"
const treeDepth = 3;

// --- Pedersen-like dummy hash (replace with poseidon/pedersen lib in prod) ---
function hash(a: bigint, b: bigint): bigint {
  const input = a.toString() + b.toString();
  const digest = crypto.createHash("sha256").update(input).digest("hex");
  return BigInt("0x" + digest) % BigInt(2) ** 251n;
}

function leafHash(secret: string): bigint {
  const bytes = Buffer.from(secret);
  const digest = crypto.createHash("sha256").update(bytes).digest("hex");
  return BigInt("0x" + digest) % BigInt(2) ** 251n;
}

// --- Build Merkle Tree ---
const leaves = secrets.map(leafHash);
const tree: bigint[][] = [leaves];

for (let level = 0; level < treeDepth; level++) {
  const prev = tree[level];
  const next: bigint[] = [];
  for (let i = 0; i < prev.length; i += 2) {
    next.push(hash(prev[i], prev[i + 1]));
  }
  tree.push(next);
}

const root = tree[treeDepth][0];
const leaf = leaves[indexToProve];
let idx = indexToProve;
const merklePath: bigint[] = [];

for (let level = 0; level < treeDepth; level++) {
  const siblingIndex = idx ^ 1;
  merklePath.push(tree[level][siblingIndex]);
  idx = Math.floor(idx / 2);
}

const nullifierHash = hash(nullifierSecret, BigInt(signal + epoch));

// Format root as hex to match Noir output
const rootHex = "0x" + root.toString(16);

// --- Output Prover.toml ---
const proverToml = `
leaf = "${leaf}"
index = "${indexToProve}"
path = [${merklePath.map((x) => `"${x}"`).join(", ")}]
nullifier_secret = "${nullifierSecret}"
signal = "${signal}"
epoch = "${epoch}"
root = "${rootHex}"
`;
fs.writeFileSync("Prover.toml", proverToml);

// --- Output frontend-friendly JSON ---
const jsonData = {
  leaf: leaf.toString(),
  index: indexToProve,
  path: merklePath.map((x) => x.toString()),
  nullifier_secret: nullifierSecret.toString(),
  signal,
  epoch,
  root: rootHex,
  nullifier_hash: nullifierHash.toString(),
};
fs.writeFileSync("proof_inputs.json", JSON.stringify(jsonData, null, 2));

console.log("✅ Prover.toml and proof_inputs.json generated!");
