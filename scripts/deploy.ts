import { ethers } from "hardhat";

async function main() {
  const Verifier = await ethers.getContractFactory("PlonkVerifier");
  const verifier = await Verifier.deploy();

  await verifier.waitForDeployment(); // ✅ wait here

  console.log("✅ Verifier deployed to:", await verifier.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
