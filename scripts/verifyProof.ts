import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const verifierAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed verifier address

  // Load proof and public inputs
  const proofJson = JSON.parse(fs.readFileSync("proofs/proof.json", "utf8"));
  const publicInputsJson = JSON.parse(fs.readFileSync("proofs/public_inputs.json", "utf8"));

  const proofBytes = proofJson.proof;
  const publicInputs = publicInputsJson;

  // CORRECT way: load factory and attach to deployed address
  const Verifier = await ethers.getContractFactory("PlonkVerifier");
  const verifier = await Verifier.attach(verifierAddress);

  const verified = await verifier.verify(proofBytes, publicInputs);

  console.log("✅ Proof verified:", verified);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
