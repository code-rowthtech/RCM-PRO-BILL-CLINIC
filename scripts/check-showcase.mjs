import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const moduleUrls = new Map();
async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(entry => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    }));
    return nested.flat();
}
// Load only the cleaned, dependency-free adapter modules, resolving their
// extensionless imports without loading the React application or build tooling.
async function moduleUrl(file) {
    if (moduleUrls.has(file)) return moduleUrls.get(file);
    let source = await readFile(file, 'utf8');
    const imports = [...source.matchAll(/from ['"]([^'"]+)['"]/g)];
    for (const match of imports) {
        assert.ok(match[1].startsWith('.'), `Unexpected adapter dependency in ${file}`);
        const dependency = path.resolve(path.dirname(file), `${match[1]}.js`);
        source = source.replace(match[0], `from '${await moduleUrl(dependency)}'`);
    }
    const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
    moduleUrls.set(file, url);
    return url;
}

let networkCalls = 0;
globalThis.fetch = () => { networkCalls++; throw new Error('Unexpected network request'); };
globalThis.localStorage = globalThis.sessionStorage = {
    getItem() { throw new Error('Production session must not be restored'); },
    setItem() { throw new Error('Production session must not be written'); },
};
const files = await walk(path.join(root, 'src'));
const helpers = await import(await moduleUrl(path.join(root, 'src/helpers/showcase.js')));
const adapters = files.filter(file => file.includes(`${path.sep}redux${path.sep}`) && path.basename(file) === 'api.js');
adapters.push(path.join(root, 'src/helpers/api/auth.js'));
let exportsChecked = 0;
for (const file of adapters) {
    const module = await import(await moduleUrl(file));
    assert.ok(Object.keys(module).length, `Empty adapter: ${file}`);
    for (const operation of Object.values(module)) {
        await assert.rejects(operation({ privateData: 'must not be sent' }), error => error === helpers.SHOWCASE_MESSAGE);
        exportsChecked++;
    }
}
const { APICore, setAuthorization } = await import(await moduleUrl(path.join(root, 'src/helpers/api/apiCore.js')));
const api = new APICore();
for (const name of ['get', 'getFile', 'getMultiple', 'create', 'updatePatch', 'update', 'delete', 'createWithFile', 'updateWithFile']) {
    await assert.rejects(api[name]('/private', { secret: 'must not be sent' }), error => error === helpers.SHOWCASE_MESSAGE);
}
assert.equal(api.getLoggedInUser(), null);
assert.equal(api.isUserAuthenticated(), false);
api.setLoggedInUser({ token: 'must not persist' });
api.setUserInSession({ token: 'must not persist' });
setAuthorization('must not be sent');
const { encryptMessage, decryptMessage } = await import(await moduleUrl(path.join(root, 'src/cryptoUtils.js')));
assert.equal(encryptMessage('private data'), 'SHOWCASE_DISABLED');
assert.equal(decryptMessage('ciphertext'), '{}');
assert.equal(networkCalls, 0);

for (const file of files.filter(file => file.endsWith('.js'))) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /a0_0x|ETH_RPC_URL|node:child_process|createRequire/, file);
    assert.doesNotMatch(source, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, file);
    assert.doesNotMatch(source, /\bfetch\s*\(|\baxios\s*[.(]|XMLHttpRequest|WebSocket/, file);
}
console.log(`Passed: ${exportsChecked} disabled API exports, 9 transport methods, session isolation, crypto placeholders, and source checks.`);
