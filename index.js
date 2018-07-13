const postcss = require('postcss');
const objectAssign = require('object-assign');

const defaults = {
    targetUnit: 'rpx',
    outputUnit: 'rem',
    proportion: 10 / 750, // 10rem / 750rpx; proportion = ouput / target
    unitPrecision: 5,
    replace: true,
    mediaQuery: false
};

function toFixed(number, precision) {
    const multiplier = Math.pow(10, precision + 1);
    const wholeNumber = Math.floor(number * multiplier);
    return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function declarationExists(decls, prop, value) {
    return decls.some(decl => decl.prop === prop && decl.value === value);
}

module.exports = postcss.plugin('postcss-rpx2rem', (options) => {
    const {
        targetUnit,
        outputUnit,
        proportion,
        unitPrecision,
        replace,
        mediaQuery
    } = objectAssign({}, defaults, options);

    const replaceFn = (m, $1) => {
        if (!$1) {
            return m;
        }
        const value = toFixed(parseFloat($1) * proportion, unitPrecision);
        return value === 0 ? '0' : `${value}${outputUnit}`;
    };
    const replaceRegex = new RegExp(`(\\d*\\.?\\d+)${targetUnit}`);

    return function rpx2rem(root, result) {
        root.walkRules((rule) => {
            rule.walkDecls((decl) => {
                if (decl.value.indexOf(targetUnit) === -1) return;
                const value = decl.value.replace(replaceRegex, replaceFn);
                // if rem unit already exists, do not add or replace
                if (declarationExists(decl.parent, decl.prop, value)) return;
                if (replace) {
                    decl.value = value;
                } else {
                    decl.parent.insertAfter(result, decl.clone({ value }));
                }
            });
        // We'll put more code here in a moment…
        });

        if (mediaQuery) {
            root.walkAtRules('media', (rule) => {
                if (rule.value.indexOf(targetUnit) === -1) return;
                rule.params = rule.params.replace(replaceRegex, replaceFn);
            });
        }
    };
});
