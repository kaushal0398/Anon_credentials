# AnonCred: Anonymous Credential Verification using Zero-Knowledge Proofs

## 1. Introduction

*Problem:* In today's world, proving eligibility (e.g., age, citizenship, certification) usually involves disclosing personal data. This leads to serious privacy concerns, especially in sensitive applications like voting, healthcare, or decentralized finance.

*Solution:* AnonCred uses zero-knowledge proofs (ZKPs) to enable anonymous yet verifiable credential validation. Users can prove they possess a valid credential without revealing their identity or sensitive data.

*Vision:* Empower digital privacy through cryptographic proofs. AnonCred aligns with Web3 values by decentralizing trust while preserving anonymity.

---

## 2. Motivation and Use Cases

*Why ZK Credentials Matter:*

•⁠  ⁠Centralized authorities can leak or misuse sensitive data.
•⁠  ⁠Web3 identity systems lack privacy-preserving verification.

*Use Cases:*

•⁠  ⁠*Anonymous Voting:* Prove you're a voter without revealing who you are.
•⁠  ⁠*DAO Participation:* Validate membership without linking wallets to real identities.
•⁠  ⁠*Healthcare Access:* Prove medical credentials without exposing history.
•⁠  ⁠*Age Verification:* Prove over-18 status without revealing birthdate.
•⁠  ⁠*Whistleblower Protection:* Authenticate insider access without deanonymizing.

*Social Impact:* Facilitates civil liberties and censorship resistance.

---

## 3. Technical Architecture Overview

*Core Components:*

•⁠  ⁠*Noir (ZK language):* Define proof logic (e.g., hash inclusion).
•⁠  ⁠*zk-SNARKs:* Efficient proof system for large-scale verifications.
•⁠  ⁠*Hardhat + Ethers.js:* Blockchain deployment and script automation.
•⁠  ⁠*Solidity Verifier Contract:* Accepts proofs and validates on-chain.

*Proof Flow:*

1.⁠ ⁠User generates ZK proof off-chain.
2.⁠ ⁠User submits proof and public signals to smart contract.
3.⁠ ⁠Contract verifies proof using verifier logic (Groth16).

---

## 4. Project Structure

```
Anon_credentials/
├── index.html              # Main application file
├── README.md              # Project documentation
├── contracts/             # Smart contracts
│   ├── Verifier.sol       # ZK proof verifier contract
│   └── Credential.sol     # Credential management contract
├── circuits/              # Zero-knowledge circuits
│   ├── age_verification/  # Age verification circuit
│   ├── dao_membership/    # DAO membership circuit
│   └── healthcare/        # Healthcare access circuit
└── scripts/              # Deployment and utility scripts
    ├── deploy.js         # Contract deployment script
    └── generate_proof.js # Proof generation utilities
```

### Component Descriptions

#### Frontend (`index.html`)
- **Home Page**: Project introduction and use cases
- **Prove Page**: Interface for generating zero-knowledge proofs
  - User index selection
  - Signal value input
  - Proof generation and download
- **Admin Page**: Credential verification dashboard
  - Proof verification interface
  - Verification statistics
  - Recent verifications log

#### Smart Contracts
- **Verifier.sol**
  - Implements Groth16 verification logic
  - Validates zero-knowledge proofs
  - Manages nullifier tracking
- **Credential.sol**
  - Manages credential issuance
  - Handles credential revocation
  - Tracks active credentials

#### Zero-Knowledge Circuits
- **Age Verification Circuit**
  - Proves age > 18 without revealing birthdate
  - Uses timestamp comparison
- **DAO Membership Circuit**
  - Verifies membership without revealing identity
  - Uses Merkle tree inclusion proofs
- **Healthcare Circuit**
  - Validates medical credentials
  - Preserves patient privacy

#### Scripts
- **deploy.js**
  - Deploys smart contracts
  - Sets up initial parameters
- **generate_proof.js**
  - Generates zero-knowledge proofs
  - Handles circuit compilation
  - Manages proof verification

### How It Works

1. **Credential Issuance**
   - Authority issues credentials to users
   - Credentials are stored off-chain
   - Only commitment hashes are stored on-chain

2. **Proof Generation**
   - User selects credential type
   - System generates zero-knowledge proof
   - Proof includes nullifier to prevent double-use

3. **Verification Process**
   - User submits proof to verifier contract
   - Contract checks nullifier usage
   - Proof is verified using Groth16
   - Result is recorded on-chain

4. **Privacy Protection**
   - No personal data stored on-chain
   - Each credential can only be used once
   - Zero-knowledge proofs ensure privacy
   - Nullifiers prevent credential reuse

### Development Setup

1. **Prerequisites**
   ```bash
   npm install -g hardhat
   npm install
   ```

2. **Circuit Compilation**
   ```bash
   npx hardhat compile
   ```

3. **Contract Deployment**
   ```bash
   npx hardhat run scripts/deploy.js --network <network>
   ```

4. **Running Tests**
   ```bash
   npx hardhat test
   ```

### Security Considerations

- All proofs are verified on-chain
- Nullifiers prevent double-spending
- Credentials can be revoked if compromised
- No personal data is stored on-chain
- Regular security audits recommended 