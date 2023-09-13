use dep::std::ecdsa_secp256k1::verify_signature;
use dep::std::poseidon::bn254::hash4;
mod utils;

fn validate_tx<N>(pub_key_x : [u8;32], pub_key_y : [u8;32], signature : [u8;64], hashed_message : [u8;32], pub_key_index: Field, pub_key_path: [Field; N], pub_key_root: Field){
    let is_valid_signature = verify_signature(pub_key_x, pub_key_y, signature, hashed_message);
    assert(is_valid_signature);
    let x_hilo = utils::from_le_bytes(pub_key_x);
    let y_hilo = utils::from_le_bytes(pub_key_y);
    let pub_key_hash = hash4([x_hilo[0], x_hilo[1], y_hilo[0], y_hilo[1]]);
    utils::validate_mtp(pub_key_hash, pub_key_index, pub_key_path, pub_key_root);
}
