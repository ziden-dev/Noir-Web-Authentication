use dep::std;

fn fields_to_u8_array<N, M>(x: [Field;N], mut z: [u8; M]) {
    for i in 0..N {
        let y = x[i].to_le_bytes(32);
        for j in 0..32 {
            z[i*32+j] = y[j];
        }
    }
}



