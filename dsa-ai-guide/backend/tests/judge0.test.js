/**
 * Unit & Integration Tests for Judge0 Execution Adapter
 * Verifies sandbox status mapping (1-14), language IDs, isolation, and error handling.
 */

const Judge0Service = require('../src/services/judge0Service');

describe('Judge0 Code Execution Adapter Tests', () => {
  let service;

  beforeEach(() => {
    service = new Judge0Service({
      apiUrl: 'http://localhost:2358',
      apiKey: 'test-key',
      timeoutMs: 1000
    });
  });

  describe('Language ID Mapping', () => {
    test('should resolve valid language identifiers to Judge0 IDs', () => {
      expect(service.getLanguageId('python')).toBe(71);
      expect(service.getLanguageId('py')).toBe(71);
      expect(service.getLanguageId('cpp')).toBe(54);
      expect(service.getLanguageId('c++')).toBe(54);
      expect(service.getLanguageId('java')).toBe(62);
      expect(service.getLanguageId('javascript')).toBe(63);
      expect(service.getLanguageId('js')).toBe(63);
      expect(service.getLanguageId('node')).toBe(63);
    });

    test('should return null for unsupported language', () => {
      expect(service.getLanguageId('ruby')).toBeNull();
      expect(service.getLanguageId('rust')).toBeNull();
      expect(service.getLanguageId('')).toBeNull();
    });
  });

  describe('Status Mapping & Parsing (Statuses 1-14)', () => {
    test('should correctly parse Accepted (status 3)', () => {
      const parsed = service.parseJudge0Result({
        status_id: 3,
        time: '0.045',
        memory: 3200,
        stdout: 'Hello World\n'
      });
      expect(parsed.status).toBe('Accepted');
      expect(parsed.passed).toBe(true);
      expect(parsed.runtimeMs).toBe(45);
      expect(parsed.memoryKb).toBe(3200);
      expect(parsed.stdout).toBe('Hello World');
      expect(parsed.error).toBeNull();
    });

    test('should correctly parse Wrong Answer (status 4)', () => {
      const parsed = service.parseJudge0Result({
        status_id: 4,
        time: '0.020',
        memory: 2800,
        stdout: 'Wrong'
      });
      expect(parsed.status).toBe('Wrong Answer');
      expect(parsed.passed).toBe(false);
      expect(parsed.error).toBe('Wrong Answer');
    });

    test('should correctly parse Time Limit Exceeded (status 5)', () => {
      const parsed = service.parseJudge0Result({
        status_id: 5,
        time: '2.000',
        memory: 4000
      });
      expect(parsed.status).toBe('Time Limit Exceeded');
      expect(parsed.passed).toBe(false);
    });

    test('should correctly parse Compilation Error (status 6 & 14)', () => {
      const parsed6 = service.parseJudge0Result({
        status_id: 6,
        compile_output: 'syntax error on line 4'
      });
      expect(parsed6.status).toBe('Compilation Error');
      expect(parsed6.passed).toBe(false);
      expect(parsed6.error).toContain('syntax error');

      const parsed14 = service.parseJudge0Result({
        status_id: 14,
        compile_output: 'linker error'
      });
      expect(parsed14.status).toBe('Compilation Error');
    });

    test('should correctly parse Runtime Errors (statuses 7-12)', () => {
      [7, 8, 9, 10, 11, 12].forEach(statusId => {
        const parsed = service.parseJudge0Result({
          status_id: statusId,
          stderr: 'Segmentation fault'
        });
        expect(parsed.status).toBe('Runtime Error');
        expect(parsed.passed).toBe(false);
      });
    });

    test('should correctly parse Service Error (status 13)', () => {
      const parsed = service.parseJudge0Result({
        status_id: 13,
        stderr: 'Sandbox failure'
      });
      expect(parsed.status).toBe('Service Error');
      expect(parsed.passed).toBe(false);
    });
  });

  describe('Validation & Edge Cases', () => {
    test('should reject empty code with Compilation Error', async () => {
      const result = await service.executeCode({
        language: 'python',
        code: '   ',
        testCases: [{ input: '1', output: '1' }]
      });
      expect(result.status).toBe('Compilation Error');
      expect(result.message).toContain('cannot be empty');
      expect(result.testCasesPassed).toBe(0);
    });

    test('should reject unsupported language with descriptive error', async () => {
      const result = await service.executeCode({
        language: 'brainfuck',
        code: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]',
        testCases: [{ input: '1', output: '1' }]
      });
      expect(result.status).toBe('Compilation Error');
      expect(result.message).toContain('Unsupported language');
    });

    test('should return Accepted when no test cases are specified', async () => {
      const result = await service.executeCode({
        language: 'python',
        code: 'print(1)',
        testCases: []
      });
      expect(result.status).toBe('Accepted');
      expect(result.totalTestCases).toBe(0);
    });
  });

  describe('Multi-Test Case Execution with Mocked Fetch', () => {
    test('should return Accepted when all test cases pass', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status_id: 3,
          time: '0.035',
          memory: 4096,
          stdout: 'output\n'
        })
      });

      const mockService = new Judge0Service({
        fetchClient: mockFetch
      });

      const result = await mockService.executeCode({
        language: 'python',
        code: 'def solve(): pass',
        testCases: [
          { input: '1', output: 'output' },
          { input: '2', output: 'output' }
        ]
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.status).toBe('Accepted');
      expect(result.testCasesPassed).toBe(2);
      expect(result.totalTestCases).toBe(2);
      expect(result.isAvailable).toBe(true);
    });

    test('should return Wrong Answer when one test case fails', async () => {
      let callCount = 0;
      const mockFetch = jest.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return {
            ok: true,
            json: async () => ({ status_id: 3, time: '0.010', memory: 2000, stdout: 'good' })
          };
        }
        return {
          ok: true,
          json: async () => ({ status_id: 4, time: '0.015', memory: 2000, stdout: 'bad' })
        };
      });

      const mockService = new Judge0Service({ fetchClient: mockFetch });
      const result = await mockService.executeCode({
        language: 'cpp',
        code: 'int main() {}',
        testCases: [
          { input: '1', output: 'good' },
          { input: '2', output: 'expected' }
        ]
      });

      expect(result.status).toBe('Wrong Answer');
      expect(result.testCasesPassed).toBe(1);
      expect(result.totalTestCases).toBe(2);
    });

    test('should short-circuit execution on Compilation Error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status_id: 6,
          compile_output: 'error: stray semicolon'
        })
      });

      const mockService = new Judge0Service({ fetchClient: mockFetch });
      const result = await mockService.executeCode({
        language: 'cpp',
        code: 'broken code',
        testCases: [
          { input: '1', output: '1' },
          { input: '2', output: '2' },
          { input: '3', output: '3' }
        ]
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('Compilation Error');
      expect(result.testCasesPassed).toBe(0);
    });

    test('should report honest unreachable error when Judge0 service fails or is offline', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED 127.0.0.1:2358'));

      const mockService = new Judge0Service({
        apiUrl: 'http://localhost:2358',
        fetchClient: mockFetch
      });

      const result = await mockService.executeCode({
        language: 'python',
        code: 'print("test")',
        testCases: [{ input: '1', output: '1' }]
      });

      expect(result.status).toBe('Service Error');
      expect(result.isAvailable).toBe(false);
      expect(result.message).toContain('Judge0 sandbox unreachable');
      expect(result.testCasesPassed).toBe(0);
    });
  });
});
