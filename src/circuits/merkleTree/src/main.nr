
use dep::std;
use dep::noirlib;

fn main(leaf: Field,
        index: Field, 
        path:[Field;3],
        root:pub Field) 
    {    
        noirlib::utils::validate_mtp(
            leaf,
            index,
            path,
            root
        );
}