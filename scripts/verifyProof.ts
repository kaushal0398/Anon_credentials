// scripts/verifyProof.ts
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const verifierAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your deployed verifier address

  // Load proof and public inputs
  const proofJson = JSON.parse(fs.readFileSync("proofs/proof.json", "utf8"));
  const publicInputsJson = JSON.parse(fs.readFileSync("proofs/public_inputs.json", "utf8"));

  const proofBytes = proofJson.proof;
  const publicInputs = publicInputsJson;

  const Verifier = await ethers.getContractAt("PlonkVerifier", verifierAddress);

  const result = await Verifier.verify(proofBytes, publicInputs);

  console.log("✅ Proof verified:", result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
