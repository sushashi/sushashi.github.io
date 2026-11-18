# Calculator

A responsive calculator built with React and Vite. It offers two modes, with the original basic calculator kept as the default.

## Modes

- **Basic:** addition, subtraction, multiplication, division, percentages, sign changes, and decimals.
- **Scientific:** expression parsing with operator precedence and parentheses, trigonometry, square roots, powers, logarithms, reciprocals, and the constants `pi` and `e`. Trigonometry can use degrees or radians.

Each mode keeps its current input when switching. The scientific evaluator uses Math.js, and invalid or non-finite results are shown as an input error.

## Controls

- In Basic mode, use the on-screen keys or type numbers and operators. `Enter` evaluates, `Backspace` deletes, and `Escape` clears.
- In Scientific mode, use the keypad or type an expression such as `sin(30) + 2^3`. Press `Enter` to evaluate. Use the `DEG`/`RAD` key to change angle units.

## Development

```sh
npm install
npm run dev
```

Run the evaluator tests with `npm test`. Run `npm run lint` and `npm run build` to check the app and create a production build. `npm run deploy` builds and publishes the site to GitHub Pages.

## Credits

- The basic calculator was originally inspired by the [SitePoint React calculator tutorial](https://www.sitepoint.com/react-tutorial-build-calculator-app/).
- Developed with assistance from GitHub Copilot AI.