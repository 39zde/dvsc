# DVSC

A dynamic and visual calculator for getting a score between 0 and 100 across different categories. Initial values are being set with attributes of the custom HTML element.

```html

    <scoring-calc>
        <scoring-calc-row name="category 1 " value="0.5" target="0" mode="0" type="a" weight="25" spread="10" score="0">
        </scoring-calc-row>
        <!-- 

         ... 

         -->

    </scoring-calc>
```

`<scoring-calc>` handles all the calculations and takes no attributes.
`<scroring-calc-row>` has the following attributes:

```typescript
    {   
        name: string;
        value: number; // any number ∈  ℝ 
        target: number; // any number ∈  ℝ 
        mode: -1 | 0 | 1; 
        // Defines the sign of the slope of the scroring function. 
        // Zero means the scoring function start with positive slope                   
        // and ends with a negative one, reaching its peak at the target
        type: 'a'|'b'|'c'|'d'|'e'; // the type of scoring function to use
        weight: number;  // 0.01 < weight < 100 - (categoryCount - 1) * 0.01
        spread: number; //  Defines the offset from the target value, to get the score 1 
                        // spread > 0.01 and ∈  ℝ 
    }
```
The initial weight values will be overridden to be 1/categoryCount, so all weights are balanced from the start.
For now there are 5 scoring function available. You can find an interactive plot [here](https://www.desmos.com/calculator/wdk0tp8md2).
The functions a implemented in Rust. The matrix calculations, for balancing the weights upon input, are implemented in JavaScript, not yet in Rust.

## Notes

Due to the use of the new [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) compatibility is restricted to the newest Browser versions [(Chrome >= 114; Firefox >= 125)](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API#browser_compatibility) (2024-04-16).


## Development

To compile the Rust file into WASM the Rust toolchain must be installed. Get started [here](https://www.rust-lang.org/learn/get-started).

this command compiles to wasm in the pkg folder
```bash
wasm-pack build --target web --no-pack --release
```