// scripts/generateAndVerify.ts
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const verifierAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your deployed verifier

  // Step 1: Mock proof and public inputs
  const mockProof = "0xabcdef";
  const mockPublicInputs = ["0", "0", "0", "0"];

  fs.writeFileSync("proofs/proof.json", JSON.stringify({ proof: mockProof }, null, 2));
  fs.writeFileSync("proofs/public_inputs.json", JSON.stringify(mockPublicInputs, null, 2));

  console.log("✅ Mock proof and public inputs generated!");

  // Step 2: Load proof
  const proofJson = JSON.parse(fs.readFileSync("proofs/proof.json", "utf8"));
  const publicInputsJson = JSON.parse(fs.readFileSync("proofs/public_inputs.json", "utf8"));

  const proofBytes = proofJson.proof;
  const publicInputs = publicInputsJson;

  const Verifier = await ethers.getContractAt("PlonkVerifier", verifierAddress);

  const verified = await Verifier.verify(proofBytes, publicInputs);

  console.log("✅ Proof verified:", verified);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
