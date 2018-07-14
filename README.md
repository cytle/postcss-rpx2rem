# PostCSS Rpx2rem [![Build Status][ci-img]][ci]

[PostCSS] plugin rpx2rem.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/cytle/postcss-rpx2rem.svg
[ci]:      https://travis-ci.org/cytle/postcss-rpx2rem

```css
/* target */
.foo {
    height: 20px;
    padding: 75rpx 1rem 0 20rpx;
    content: "20rpx";
}
```

```css
/* output */
.foo {
    height: 20px;
    padding: 1rem 1rem 0 0.26667rem;
    content: "20rpx";
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
