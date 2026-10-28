/**
 * Dedicated Judge0 Code Execution Adapter
 * Implements isolated, sandboxed execution following Progress Report 03 (Layer 5 Security).
 * 
 * Capabilities:
 * - Explicit language ID configuration
 * - Submits code and test cases to Judge0 REST API
 * - Handles: Queued, Processing, Accepted, Wrong Answer, Compilation Error, Time Limit Exceeded, Runtime Error
 * - Enforces CPU time and memory limits
 * - Never executes user code via exec() or eval()
 * - Honest error reporting when sandbox is unconfigured or unreachable (no fabricated results)
 */

const LANGUAGE_IDS = {
  python: parseInt(process.env.JUDGE0_PYTHON_ID || '71', 10),      // Python 3.8+
  cpp: parseInt(process.env.JUDGE0_CPP_ID || '54', 10),            // C++ (GCC 9.2+)
  java: parseInt(process.env.JUDGE0_JAVA_ID || '62', 10),          // Java (OpenJDK)
  javascript: parseInt(process.env.JUDGE0_JS_ID || '63', 10)      // JavaScript (Node.js)
};

const STATUS_MAP = {
  1: { status: 'Queued', isTerminal: false },
  2: { status: 'Processing', isTerminal: false },
  3: { status: 'Accepted', isTerminal: true },
  4: { status: 'Wrong Answer', isTerminal: true },
  5: { status: 'Time Limit Exceeded', isTerminal: true },
  6: { status: 'Compilation Error', isTerminal: true },
  7: { status: 'Runtime Error', isTerminal: true },
  8: { status: 'Runtime Error', isTerminal: true },
  9: { status: 'Runtime Error', isTerminal: true },
  10: { status: 'Runtime Error', isTerminal: true },
  11: { status: 'Runtime Error', isTerminal: true },
  12: { status: 'Runtime Error', isTerminal: true },
  13: { status: 'Service Error', isTerminal: true },
  14: { status: 'Compilation Error', isTerminal: true }
};

class Judge0Service {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || process.env.JUDGE0_API_URL || 'http://localhost:2358';
    this.apiKey = options.apiKey || process.env.JUDGE0_API_KEY || '';
    this.apiHost = options.apiHost || process.env.JUDGE0_API_HOST || '';
    this.fetchClient = options.fetchClient || global.fetch;
    this.defaultCpuTimeLimit = parseFloat(process.env.JUDGE0_CPU_TIME_LIMIT || '2.0');
    this.defaultMemoryLimitKb = parseInt(process.env.JUDGE0_MEMORY_LIMIT_KB || '128000', 10);
    this.timeoutMs = parseInt(process.env.CODE_EXEC_TIMEOUT_MS || '5000', 10);
  }

  getLanguageId(language) {
    const lang = (language || '').toLowerCase().trim();
    if (lang === 'c++') return LANGUAGE_IDS.cpp;
    if (lang === 'js' || lang === 'node') return LANGUAGE_IDS.javascript;
    if (lang === 'py') return LANGUAGE_IDS.python;
    return LANGUAGE_IDS[lang] || null;
  }

  _getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['X-RapidAPI-Key'] = this.apiKey;
      headers['X-Auth-Token'] = this.apiKey;
    }
    if (this.apiHost) {
      headers['X-RapidAPI-Host'] = this.apiHost;
    }
    return headers;
  }

  /**
   * Submits a single test case to Judge0 with wait=true.
   */
  async submitSingleTestCase({ sourceCode, languageId, stdin, expectedOutput, cpuTimeLimit, memoryLimitKb }) {
    const endpoint = `${this.apiUrl}/submissions?base64_encoded=false&wait=true`;
    const payload = {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin || '',
      expected_output: expectedOutput || '',
      cpu_time_limit: cpuTimeLimit || this.defaultCpuTimeLimit,
      memory_limit: memoryLimitKb || this.defaultMemoryLimitKb
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchClient(endpoint, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          status: 'Service Error',
          passed: false,
          error: `Judge0 API error (${response.status}): ${errorText}`,
          runtimeMs: 0,
          memoryKb: 0
        };
      }

      const data = await response.json();
      return this.parseJudge0Result(data);
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        return {
          status: 'Time Limit Exceeded',
          passed: false,
          error: `Execution timed out after ${this.timeoutMs}ms`,
          runtimeMs: this.timeoutMs,
          memoryKb: 0
        };
      }
      return {
        status: 'Service Error',
        passed: false,
        error: `Failed to connect to Judge0 at ${this.apiUrl}: ${err.message}`,
        runtimeMs: 0,
        memoryKb: 0
      };
    }
  }

  parseJudge0Result(data) {
    const statusId = data.status_id || (data.status && data.status.id) || 13;
    const mapping = STATUS_MAP[statusId] || { status: 'Service Error', isTerminal: true };
    const passed = statusId === 3; // 3 = Accepted

    const time = parseFloat(data.time || '0') * 1000; // convert to ms
    const memory = parseInt(data.memory || '0', 10);
    const compileOutput = data.compile_output || '';
    const stdout = data.stdout || '';
    const stderr = data.stderr || '';

    return {
      status: mapping.status,
      passed,
      runtimeMs: Math.round(time),
      memoryKb: memory,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      compileOutput: compileOutput.trim(),
      error: compileOutput || stderr || (passed ? null : mapping.status)
    };
  }

  /**
   * Evaluates submitted code across all problem test cases sequentially.
   */
  async executeCode({ language, code, testCases = [] }) {
    if (!code || code.trim().length === 0) {
      return {
        status: 'Compilation Error',
        isAvailable: true,
        message: 'Submitted code cannot be empty.',
        testCasesPassed: 0,
        totalTestCases: testCases.length,
        runtimeMs: 0,
        memoryKb: 0,
        results: []
      };
    }

    const langId = this.getLanguageId(language);
    if (!langId) {
      return {
        status: 'Compilation Error',
        isAvailable: true,
        message: `Unsupported language '${language}'. Supported languages: python, cpp, java, javascript.`,
        testCasesPassed: 0,
        totalTestCases: testCases.length,
        runtimeMs: 0,
        memoryKb: 0,
        results: []
      };
    }

    if (testCases.length === 0) {
      return {
        status: 'Accepted',
        isAvailable: true,
        message: 'No test cases specified for evaluation.',
        testCasesPassed: 0,
        totalTestCases: 0,
        runtimeMs: 0,
        memoryKb: 0,
        results: []
      };
    }

    let passedCount = 0;
    let maxRuntime = 0;
    let maxMemory = 0;
    let terminalStatus = 'Accepted';
    const testResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const result = await this.submitSingleTestCase({
        sourceCode: code,
        languageId: langId,
        stdin: tc.input,
        expectedOutput: tc.output
      });

      if (result.runtimeMs > maxRuntime) maxRuntime = result.runtimeMs;
      if (result.memoryKb > maxMemory) maxMemory = result.memoryKb;

      testResults.push({
        testCaseIndex: i + 1,
        passed: result.passed,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: result.stdout || '',
        error: result.error || null
      });

      if (result.passed) {
        passedCount++;
      } else {
        // If first non-accepted status encountered, capture terminal failure
        if (terminalStatus === 'Accepted') {
          terminalStatus = result.status;
        }
      }

      // Short circuit compilation error or service error
      if (result.status === 'Compilation Error' || result.status === 'Service Error') {
        terminalStatus = result.status;
        break;
      }
    }

    const isSandboxDown = terminalStatus === 'Service Error';

    return {
      status: terminalStatus,
      isAvailable: !isSandboxDown,
      message: isSandboxDown
        ? `Judge0 sandbox unreachable at ${this.apiUrl}. Please verify sandbox container deployment.`
        : `Execution completed: ${passedCount}/${testCases.length} test cases passed.`,
      testCasesPassed: passedCount,
      totalTestCases: testCases.length,
      runtimeMs: maxRuntime,
      memoryKb: maxMemory,
      results: testResults
    };
  }
}

module.exports = Judge0Service;
