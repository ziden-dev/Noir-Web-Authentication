use dep::noirlib;
use dep::std;

fn main( publicKeyX: Field, publicKeyY : pub Field, accountIndex : Field,
         accountPath: [Field; 5], accountNewRoot : Field, stateIndex: Field,
         statePath: [Field; 3], stateNewRoot : Field, stateOldRoot: Field ) {

    let leaf = std::hash::poseidon::bn254::hash_2([ publicKeyX, publicKeyY]);
    let root = noirlib::utils::validate_mtp( leaf, accountIndex, accountPath, accountNewRoot );
    noirlib::utils::validate_mtp(root, stateIndex, statePath, stateNewRoot);
}
