# Universal Binary Clock

A binary clock implementation counting seconds since the Big Bang using JavaScript BigInt arithmetic.

## Implementation

Time is represented as a 64-bit integer where each bit corresponds to a power of 2 seconds. The visualization displays an 8×8 grid where each cell represents one bit position. Time scales range from seconds to billions of years.

## Functionality

- Binary representation of time as powers of 2 seconds
- Time scale from seconds to gigayears
- Exponential easing for time transitions
- Cell hover displays corresponding time scales
- Real-time updates synchronized to Unix epoch + cosmic offset

## Time Scales

Each cell represents a power of 2 seconds, covering these scales:
- s - seconds
- m - minutes  
- h - hours
- d - days
- a - years
- ka - kiloyears
- Ma - megayears
- Ga - gigayears

## Technical Specifications

- JavaScript BigInt for integer calculations
- React 19 with functional components
- TypeScript with inline prop definitions
- Vite build system
- Custom easing functions for transitions


## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Notes

Mathematical abstraction of cosmic time as binary patterns. Reduces temporal complexity to integer representation.

Built by Larix Kortbeek, September 2025.

## License

MIT License.