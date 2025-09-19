# Universal Binary Clock

A binary clock of seconds since the Big Bang, visualized as an 8×8 grid where each cell corresponds to a power of 2 seconds in a 64-bit integer representation.

The implementation uses the universe age estimate of 13.78 billion years from [Planck 2018 results (published 2020)](https://www.aanda.org/articles/aa/full_html/2020/09/aa33910-18/aa33910-18.html).

Time unit abbreviations follow ISO/IEC 80000-3:2019:
- `a` (annus) - years
- `ka` (kiloannus) - millennia  
- `Ma` (megaannus) - millions of years
- `Ga` (gigaannus) - billions of years

## Implementation

Each bit position represents 2^n seconds. The grid displays time from seconds to billions of years, with each moment in universal history having a unique binary pattern.

---

Larix Kortbeek, PlusOne Amsterdam, 2025