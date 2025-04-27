import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const verifierAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed verifier

  // Step 1: Mock proof and public inputs
  const mockProof = "0xabcdef";
  const mockPublicInputs = ["0", "0", "0", "0"];

  fs.mkdirSync("proofs", { recursive: true });
  fs.writeFileSync("proofs/proof.json", JSON.stringify({ proof: mockProof }, null, 2));
  fs.writeFileSync("proofs/public_inputs.json", JSON.stringify(mockPublicInputs, null, 2));

  console.log("✅ Mock proof and public inputs generated!");

  // Step 2: Load proof
  const proofJson = JSON.parse(fs.readFileSync("proofs/proof.json", "utf8"));
  const publicInputsJson = JSON.parse(fs.readFileSync("proofs/public_inputs.json", "utf8"));

  const proofBytes = proofJson.proof;
  const publicInputs = publicInputsJson;

  // Correct contract loading
  const Verifier = await ethers.getContractFactory("PlonkVerifier");
  const verifier = await Verifier.attach(verifierAddress);

  // Step 3: Call verify()
  const verified = await verifier.verify(proofBytes, publicInputs);

  console.log("✅ Proof verified:", verified);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
