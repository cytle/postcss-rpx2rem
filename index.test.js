const postcss = require('postcss');
const plugin = require('./');

const basicCSS = '.rule { font-size: 15rpx }';

describe('plugin', () => {
    it('should work on the readme example', () => {
        const input = '.foo { height: 20px; padding: 75rpx 1rem 0 20rpx; content: "20rpx"; }';
        const output = '.foo { height: 20px; padding: 1rem 1rem 0 0.26667rem; content: "20rpx"; }';
        const processed = postcss(plugin()).process(input).css;

        expect(processed).toBe(output);
    });

    it('should replace the px unit with rem', () => {
        const processed = postcss(plugin()).process(basicCSS).css;
        const expected = '.rule { font-size: 0.2rem }';

        expect(processed).toBe(expected);
    });

    it('should ignore non px properties', () => {
        const expected = '.rule { font-size: 2em }';
        const processed = postcss(plugin()).process(expected).css;

        expect(processed).toBe(expected);
    });

    it('should handle < 1 values and values without a leading 0', () => {
        const rules = '.rule { margin: 0.5rem .5rpx -0.2rpx -.2em }';
        const expected = '.rule { margin: 0.5rem 0.00667rem -0.00267rem -.2em }';
        const processed = postcss(plugin()).process(rules).css;

        expect(processed).toBe(expected);
    });
    it('should not add properties that already exist', () => {
        const expected = '.rule { font-size: 75rpx; font-size: 1rem; }';
        const processed = postcss(plugin({})).process(expected).css;

        expect(processed).toBe(expected);
    });

    it('should remain unitless if 0', () => {
        const expected = '.rule { font-size: 0rpx; font-size: 0; }';
        const processed = postcss(plugin()).process(expected).css;

        expect(processed).toBe(expected);
    });
});

describe('value parsing', () => {
    it('should not replace values in double quotes or single quotes', () => {
        const rules = '.rule { content: \'75rpx\'; font-family: "75rpx"; font-size: 75rpx; }';
        const expected = '.rule { content: \'75rpx\'; font-family: "75rpx"; font-size: 1rem; }';
        const processed = postcss(plugin()).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should not replace values in `url()`', () => {
        const rules = '.rule { background: url(75rpx.jpg); font-size: 75rpx; }';
        const expected = '.rule { background: url(75rpx.jpg); font-size: 1rem; }';
        const processed = postcss(plugin()).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should not replace values with an uppercase P or X', () => {
        const rules = '.rule { margin: 75rpx calc(100% - 14PX); height: calc(100% - 93.75rpx); font-size: 12Rpx; line-height: 75rpx; }';
        const expected = '.rule { margin: 1rem calc(100% - 14PX); height: calc(100% - 1.25rem); font-size: 12Rpx; line-height: 1rem; }';
        const processed = postcss(plugin()).process(rules).css;

        expect(processed).toBe(expected);
    });
});

describe('proportion', () => {
    it('should replace using a root value of 10', () => {
        const expected = '.rule { font-size: 2rem }';
        const options = {
            proportion: 100 / 750
        };
        const processed = postcss(plugin(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });
});

describe('unitPrecision', () => {
    it('should replace using a decimal of 2 places', () => {
        const input = '.rule { font-size: 20rpx }';
        const expected = '.rule { font-size: 0.27rem }';
        const options = {
            unitPrecision: 2
        };
        const processed = postcss(plugin(options)).process(input).css;

        expect(processed).toBe(expected);
    });
});

describe('replace', () => {
    it('should leave fallback pixel unit with root em value', () => {
        const options = {
            replace: false
        };
        const processed = postcss(plugin(options)).process(basicCSS).css;
        const expected = '.rule { font-size: 15rpx; font-size: 0.2rem }';

        expect(processed).toBe(expected);
    });
});

describe('mediaQuery', () => {
    it('should replace px in media queries', () => {
        const input = '@media (min-width: 500rpx) { .rule { font-size: 75rpx } }';
        const expected = '@media (min-width: 6.66667rem) { .rule { font-size: 1rem } }';
        const options = {
            mediaQuery: true
        };
        const processed = postcss(plugin(options)).process(input).css;

        expect(processed).toBe(expected);
    });
});

describe('targetUnit', () => {
    it('should replace targetUnit with outputUnit', () => {
        const input = '.rule { font-size: 15xxx }';
        const expected = '.rule { font-size: 0.2vw }';
        const options = {
            targetUnit: 'xxx',
            outputUnit: 'vw'
        };
        const processed = postcss(plugin(options)).process(input).css;

        expect(processed).toBe(expected);
    });
});
