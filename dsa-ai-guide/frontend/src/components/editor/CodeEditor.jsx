import React from 'react';
import Editor from '@monaco-editor/react';

export const CodeEditor = ({
  code,
  onChange,
  language = 'cpp',
  onLanguageChange,
  theme = 'vs-dark',
  fontSize = 14,
  height = '480px'
}) => {
  const languageOptions = [
    { value: 'cpp', label: 'C++ (GCC 12)' },
    { value: 'python', label: 'Python 3.11' },
    { value: 'java', label: 'Java (OpenJDK 17)' },
    { value: 'javascript', label: 'JavaScript (Node.js 20)' }
  ];

  const getMonacoLang = (lang) => {
    if (lang === 'cpp') return 'cpp';
    if (lang === 'python') return 'python';
    if (lang === 'java') return 'java';
    return 'javascript';
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
            className="bg-gray-800 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-brand-500"
          >
            {languageOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-400 font-mono">Monaco IDE</span>
        </div>
      </div>

      {/* Monaco Container */}
      <div style={{ height }}>
        <Editor
          height="100%"
          language={getMonacoLang(language)}
          theme={theme}
          value={code}
          onChange={onChange}
          options={{
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: 'on',
            renderWhitespace: 'selection'
          }}
        />
      </div>
    </div>
  );
};
