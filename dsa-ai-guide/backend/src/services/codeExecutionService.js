/**
 * Code Execution Service (Bridge to Judge0 Sandbox)
 * Dispatches code execution exclusively to the sandboxed Judge0 runner.
 * No local exec() or eval() is ever used.
 */

const Judge0Service = require('./judge0Service');

const judge0Instance = new Judge0Service();

module.exports = judge0Instance;
