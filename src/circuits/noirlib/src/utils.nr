use dep::std::hash::poseidon::bn254::hash_2;
use dep::std;
fn from_le_bytes(bytes: [u8; 32]) -> [Field; 2]{
    let mut hi: Field = 0;
    let mut lo: Field = 0;
    let mut mul2: Field = 1;
    for i in 0..16 {
        hi = hi + mul2 * (bytes[i + 16] as Field);
        lo = lo + mul2 * (bytes[i] as Field);
        mul2 = mul2 * 256;
    }

    let res = [hi, lo];
    res
}

fn to_le_bytes(hi: Field, lo: Field) -> [u8; 32]{
    let hi_bytes = hi.to_le_bytes(16);
    let lo_bytes = lo.to_le_bytes(16);
    let mut res = [0; 32];
    for i in 0..16{
        res[i] = lo_bytes[i];
        res[i + 16] = hi_bytes[i];
    }
    res
}

fn validate_mtp<N>(leaf: Field, index: Field, path: [Field; N], root: Field) -> Field {
    let index_bits  = index.to_le_bits(N as u32);
    let mut current = leaf;
    for i in 0..N {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (path[i], current)
         } else {
            (current, path[i])
         };

        current = hash_2([hash_left, hash_right]);
    };

    assert(current == root);
    current
}



