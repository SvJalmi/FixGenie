import * as monaco from 'monaco-editor';

// Simple worker configuration that doesn't cause issues
if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker: function () {
      // Use a simple fallback that doesn't require worker modules
      return {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        terminate: () => {}
      };
    }
  };
}

// Configure Monaco Editor themes and languages
export const configureMonaco = () => {
  // Define FixGenie dark theme
  monaco.editor.defineTheme('fixgenie-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'C792EA' },
      { token: 'string', foreground: '98C379' },
      { token: 'number', foreground: 'F78C6C' },
      { token: 'type', foreground: '82AAFF' },
      { token: 'function', foreground: '82AAFF' },
      { token: 'variable', foreground: 'F07178' },
    ],
    colors: {
      'editor.background': '#0D1117',
      'editor.foreground': '#F0F6FC',
      'editor.selectionBackground': '#2F81F730',
      'editor.lineHighlightBackground': '#161B22',
      'editorLineNumber.foreground': '#8B949E',
      'editorLineNumber.activeForeground': '#F0F6FC',
      'editor.cursor': '#2F81F7',
      'editorError.foreground': '#F85149',
      'editorWarning.foreground': '#E3B341',
      'editorInfo.foreground': '#56D364',
    },
  });

  // Set default theme
  monaco.editor.setTheme('fixgenie-dark');
};

export const createErrorMarkers = (errors: any[]): monaco.editor.IMarkerData[] => {
  return errors.map(error => ({
    startLineNumber: error.line,
    startColumn: error.column || 1,
    endLineNumber: error.line,
    endColumn: error.column ? error.column + 10 : 100,
    message: error.message,
    severity: getSeverity(error.severity),
    source: 'FixGenie',
  }));
};

const getSeverity = (severity: string): monaco.MarkerSeverity => {
  switch (severity) {
    case 'error':
      return monaco.MarkerSeverity.Error;
    case 'warning':
      return monaco.MarkerSeverity.Warning;
    case 'info':
      return monaco.MarkerSeverity.Info;
    default:
      return monaco.MarkerSeverity.Hint;
  }
};

export const getLanguageConfig = (languageId: string) => {
  const configs = {
    javascript: {
      comments: { lineComment: '//', blockComment: ['/*', '*/'] },
      brackets: [['(', ')'], ['[', ']'], ['{', '}']],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '`', close: '`' },
      ],
    },
    python: {
      comments: { lineComment: '#' },
      brackets: [['(', ')'], ['[', ']'], ['{', '}']],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    },
    // Add more language configurations as needed
  };

  return configs[languageId] || configs.javascript;
};
