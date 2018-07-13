const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const plugin = require('./');

function run(input, output, opts) {
    return postcss([plugin(opts)]).process(input)
        .then((result) => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

const testDir = path.resolve(__dirname, 'test');

function readTestFile(p) {
    return fs.readFileSync(path.resolve(testDir, p), { encoding: 'utf8' });
}

/* Write tests here

it('does something', () => {
    return run('a{ }', 'a{ }', { });
});

*/

it('does something', () => run(
    readTestFile('assets/test.css'), readTestFile('output/test.css'),
    { }
));
