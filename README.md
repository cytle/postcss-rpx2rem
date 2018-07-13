# PostCSS Rpx2rem [![Build Status][ci-img]][ci]

[PostCSS] plugin rpx2rem.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/cytle/postcss-rpx2rem.svg
[ci]:      https://travis-ci.org/cytle/postcss-rpx2rem

```css
/* target */
.foo {
    border: 1rpx solid;
    height: 20px;
    padding: 75rpx;
    font-size: 1.2em;
}
```

```css
/* output */
.foo {
    border: 0.01333rem solid;
    height: 20px;
    padding: 1rem;
    font-size: 1.2em;
}
```

## Usage

```js
const rpx2rem = require('postcss-rpx2rem');
postcss([rpx2rem()])
```

### options

Type: `Object | Null`

Default:

```js
{
    targetUnit: 'rpx',
    outputUnit: 'rem',
    proportion: 10 / 750, // 10rem / 750rpx; proportion = ouput / target
    unitPrecision: 5,
    replace: true,
    mediaQuery: false
}
```

- `targetUnit` (String) The target unit you want to replace
- `outputUnit` (String) The unit you want to output
- `proportion` (Number) The proportion you want to convert; proportion = ouput / target
- `unitPrecision` (Number) The decimal numbers to allow the REM units to grow to.
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
