use dep::std::hash::pedersen_hash;

// Merkle path depth
type MerklePath = [Field; 3];

fn main(
    leaf: Field,
    index: Field,
    path: MerklePath,
    nullifier_secret: Field,
    signal: pub Field,
    root: pub Field
) {
    // 1. Merkle root check
    let mut hash = leaf;
    let mut idx = index as u32;

    for sibling in path {
        if idx % 2 == 0 {
            hash = pedersen_hash([hash, sibling]);
        } else {
            hash = pedersen_hash([sibling, hash]);
        }
        idx = idx / 2;
    }

    std::println(hash); // Debug: show computed root
    assert(hash == root);

    // 2. Nullifier hash binding secret to signal
    let nullifier_hash = pedersen_hash([nullifier_secret, signal]);
    std::println(nullifier_hash);
}
