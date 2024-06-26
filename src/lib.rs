// use ndarray::prelude::*;
// use nshare::ToNalgebra;
use wasm_bindgen::prelude::*;

fn function_a(value: f64, mode: i8, target: f64, spread: f64) -> f64 {
    const K_NUMERATOR: f64 = 0.99;
    let k: f64 = K_NUMERATOR / spread.abs();

    fn a(k: f64, value: f64, target: f64) -> f64 {
        let output: f64 = -k * (value - target).abs() + 1.0;
        if output <= 0.0 {
            return 0.0;
        } else {
            return output;
        }
    }

    let score: f64 = a(k, value, target);

    if mode > 0 {
        if value >= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else if mode < 0 {
        if value <= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else {
        return score * 100.0;
    }
}

fn function_b(value: f64, mode: i8, target: f64, spread: f64) -> f64 {
    let k_numerator: f64 = ((99.0 * ::std::f64::consts::PI) / 200.0).tan();
    let k_denominator: f64 = spread.powf(2.0);
    let k: f64 = k_numerator / k_denominator;

    fn b(k: f64, value: f64, target: f64) -> f64 {
        let output: f64 =
            -(2.0 / ::std::f64::consts::PI) * (k * (value - target).powf(2.0)).atan() + 1.0;
        return output;
    }

    let score: f64 = b(k, value, target);

    if mode > 0 {
        if value >= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else if mode < 0 {
        if value <= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else {
        return score * 100.0;
    }
}

fn function_c(value: f64, mode: i8, target: f64, spread: f64) -> f64 {
    let k_numerator: f64 = (199.0_f64).ln();
    let k_denominator: f64 = spread.abs();
    let k: f64 = k_numerator / k_denominator;

    fn c(k: f64, value: f64, target: f64) -> f64 {
        let output: f64 = 2.0 / (1.0 + ::std::f64::consts::E.powf(k * (value - target).abs()));
        return output;
    }

    let score: f64 = c(k, value, target);

    if mode > 0 {
        if value >= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else if mode < 0 {
        if value <= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else {
        return score * 100.0;
    }
}

fn function_d(value: f64, mode: i8, target: f64, spread: f64) -> f64 {
    let k_numerator: f64 = ((99.0 * ::std::f64::consts::PI) / 200.0).tan();
    let k_denominator: f64 = spread.abs();
    let k: f64 = k_numerator / k_denominator;

    fn d(k: f64, value: f64, target: f64) -> f64 {
        let output: f64 =
            -(2.0 / ::std::f64::consts::PI) * (k * (value - target).abs()).atan() + 1.0;
        return output;
    }

    let score: f64 = d(k, value, target);
    if mode > 0 {
        if value >= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else if mode < 0 {
        if value <= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else {
        return score * 100.0;
    }
}

fn function_e(value: f64, mode: i8, target: f64, spread: f64) -> f64 {
    let k_numerator: f64 = (100.0_f64).ln();
    let k_denominator: f64 = spread.powf(2.0);
    let k: f64 = k_numerator / k_denominator;

    fn e(k: f64, value: f64, target: f64) -> f64 {
        let output: f64 = ::std::f64::consts::E.powf(-k * (value - target).powf(2.0));
        return output;
    }

    let score: f64 = e(k, value, target);

    if mode > 0 {
        if value >= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else if mode < 0 {
        if value <= target {
            return 1.0;
        } else {
            return score * 100.0;
        }
    } else {
        return score * 100.0;
    }
}

#[wasm_bindgen]
pub fn calc_score(value: f64, mode: i8, fn_type: char, target: f64, spread: f64) -> f64 {
    if fn_type == 'a' {
        return function_a(value, mode, target, spread);
    } else if fn_type == 'b' {
        return function_b(value, mode, target, spread);
    } else if fn_type == 'c' {
        return function_c(value, mode, target, spread);
    } else if fn_type == 'd' {
        return function_d(value, mode, target, spread);
    } else if fn_type == 'e' {
        return function_e(value, mode, target, spread);
    } else {
        return -1.0;
    }
}

// #[wasm_bindgen]
// pub fn calc_weight(input_string: &str) -> Vec<f32> {
//     let mut matrix_string: String = String::new();
//     input_string.clone_into(&mut matrix_string);
//     let mut vector_index: usize = 0;
//     for (i, c) in matrix_string.chars().enumerate() {
//         if c == 'v' {
//             vector_index = i;
//         }
//     }
//     let mut vector_string: String = matrix_string.split_off(vector_index);
//     vector_string.remove(0);
//     let vector_items = vector_string.split(";");
//     let mut vector: Vec<f32> = Vec::new();
//     for item in vector_items {
//         let tmp = item.parse::<f32>();
//         if tmp.is_ok() {
//             vector.push(tmp.unwrap());
//         }
//     }
//     let v = Array::from_vec(vector);
//     let v_dim = v.dim();
//     let matrix = matrix_string.split(";");
//     let mut m = Array2::<f32>::zeros((v_dim, v_dim));
//     for (pos, item) in matrix.enumerate() {
//         let tmp = item.split(",");
//         // let mut row: Vec<f32> = Vec::new();
//         for (index, tmp_item) in tmp.enumerate() {
//             let tmp2 = tmp_item.parse::<f32>();
//             if tmp2.is_ok() {
//                 m[[index, pos]] = tmp2.unwrap();
//             }
//         }
//     }
//     let a = m.into_nalgebra();
//     let b = v.into_nalgebra();

//     let a_lu = a.lu();
//     let y = a_lu.u().ad_solve_lower_triangular_unchecked(&b);
//     let out = a_lu.l().ad_solve_upper_triangular_unchecked(&y);

//     // let a_qr = a.qr();
//     // let y = a_lu.u().ad_solve_lower_triangular_unchecked(&b);
//     // let out = a_lu.l().ad_solve_upper_triangular_unchecked(&y);

//     let mut test: Vec<f32> = Vec::new();

//     for row in out.row_iter() {
//         let tmp = row[0];
//         test.push(tmp.to_owned());
//     }
//     return test;
// }

// // #[wasm_bindgen]
// fn soft_max(values: Vec<f32>) -> Vec<f32> {
//     let mut out: Vec<f32> = values;
//     let sum_iter = out.iter();
//     let out_iter = out.iter();
//     let mut sum = 0.0;
//     for item in sum_iter {
//         sum = sum + ::std::f32::consts::E.powf(*item);
//     }

//     for i in &out {
//         *i = (::std::f32::consts::E.powf(*i) / sum) * 100.0;
//     }

//     return out;
// }
