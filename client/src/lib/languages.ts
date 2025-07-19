export interface ProgrammingLanguage {
  id: string;
  name: string;
  category: string;
  extension: string;
  monacoId: string;
}

export const PROGRAMMING_LANGUAGES: ProgrammingLanguage[] = [
  // Compiled Languages
  { id: 'c', name: 'C', category: 'Compiled', extension: '.c', monacoId: 'c' },
  { id: 'cpp', name: 'C++', category: 'Compiled', extension: '.cpp', monacoId: 'cpp' },
  { id: 'csharp', name: 'C#', category: 'Compiled', extension: '.cs', monacoId: 'csharp' },
  { id: 'java', name: 'Java', category: 'Compiled', extension: '.java', monacoId: 'java' },
  { id: 'fortran', name: 'Fortran', category: 'Compiled', extension: '.f90', monacoId: 'fortran' },
  { id: 'algol', name: 'ALGOL', category: 'Compiled', extension: '.alg', monacoId: 'pascal' },
  { id: 'cobol', name: 'COBOL', category: 'Compiled', extension: '.cob', monacoId: 'sql' },
  { id: 'visualbasic', name: 'Visual Basic', category: 'Compiled', extension: '.vb', monacoId: 'vb' },
  { id: 'smalltalk', name: 'Smalltalk', category: 'Compiled', extension: '.st', monacoId: 'st' },

  // Interpreted Languages
  { id: 'python', name: 'Python', category: 'Interpreted', extension: '.py', monacoId: 'python' },
  { id: 'ruby', name: 'Ruby', category: 'Interpreted', extension: '.rb', monacoId: 'ruby' },
  { id: 'perl', name: 'Perl', category: 'Interpreted', extension: '.pl', monacoId: 'perl' },
  { id: 'pascal', name: 'Pascal', category: 'Interpreted', extension: '.pas', monacoId: 'pascal' },
  { id: 'lisp', name: 'Lisp', category: 'Interpreted', extension: '.lisp', monacoId: 'scheme' },
  { id: 'basic', name: 'BASIC', category: 'Interpreted', extension: '.bas', monacoId: 'vb' },
  { id: 'apl', name: 'APL', category: 'Interpreted', extension: '.apl', monacoId: 'apl' },

  // Scripting Languages
  { id: 'php', name: 'PHP', category: 'Scripting', extension: '.php', monacoId: 'php' },
  { id: 'vbscript', name: 'VBScript', category: 'Scripting', extension: '.vbs', monacoId: 'vb' },
  { id: 'powershell', name: 'PowerShell', category: 'Scripting', extension: '.ps1', monacoId: 'powershell' },
  { id: 'fscript', name: 'F-Script', category: 'Scripting', extension: '.fscript', monacoId: 'javascript' },
  { id: 'beanshell', name: 'BeanShell', category: 'Scripting', extension: '.bsh', monacoId: 'java' },
  { id: 'autoit', name: 'AutoIt', category: 'Scripting', extension: '.au3', monacoId: 'autoit' },
  { id: 'r', name: 'R', category: 'Scripting', extension: '.r', monacoId: 'r' },
  { id: 'lua', name: 'Lua', category: 'Scripting', extension: '.lua', monacoId: 'lua' },
  { id: 'bash', name: 'Bash', category: 'Scripting', extension: '.sh', monacoId: 'shell' },

  // Markup Languages
  { id: 'html', name: 'HTML', category: 'Markup', extension: '.html', monacoId: 'html' },
  { id: 'xml', name: 'XML', category: 'Markup', extension: '.xml', monacoId: 'xml' },
  { id: 'xhtml', name: 'XHTML', category: 'Markup', extension: '.xhtml', monacoId: 'html' },
  { id: 'sgml', name: 'SGML', category: 'Markup', extension: '.sgml', monacoId: 'xml' },
  { id: 'curl', name: 'Curl', category: 'Markup', extension: '.curl', monacoId: 'xml' },

  // Procedural Languages
  { id: 'hypertalk', name: 'HyperTalk', category: 'Procedural', extension: '.hc', monacoId: 'javascript' },
  { id: 'go', name: 'Go', category: 'Procedural', extension: '.go', monacoId: 'go' },
  { id: 'plc', name: 'PL/C', category: 'Procedural', extension: '.plc', monacoId: 'sql' },
  { id: 'pli', name: 'PL/I', category: 'Procedural', extension: '.pli', monacoId: 'sql' },
  { id: 'curl-proc', name: 'Curl', category: 'Procedural', extension: '.curl', monacoId: 'xml' },
  { id: 'matlab', name: 'MATLAB', category: 'Procedural', extension: '.m', monacoId: 'matlab' },

  // Pure Functional Languages
  { id: 'agda', name: 'Agda', category: 'Pure Functional', extension: '.agda', monacoId: 'haskell' },
  { id: 'sac', name: 'SAC', category: 'Pure Functional', extension: '.sac', monacoId: 'c' },
  { id: 'sasl', name: 'SASL', category: 'Pure Functional', extension: '.sasl', monacoId: 'haskell' },
  { id: 'cuneiform', name: 'Cuneiform', category: 'Pure Functional', extension: '.cf', monacoId: 'erlang' },
  { id: 'curry', name: 'Curry', category: 'Pure Functional', extension: '.curry', monacoId: 'haskell' },
  { id: 'futhark', name: 'Futhark', category: 'Pure Functional', extension: '.fut', monacoId: 'haskell' },
  { id: 'haskell', name: 'Haskell', category: 'Pure Functional', extension: '.hs', monacoId: 'haskell' },

  // Impure Functional Languages
  { id: 'apl-func', name: 'APL', category: 'Impure Functional', extension: '.apl', monacoId: 'apl' },
  { id: 'cpp-func', name: 'C++ (since C++11)', category: 'Impure Functional', extension: '.cpp', monacoId: 'cpp' },
  { id: 'csharp-func', name: 'C#', category: 'Impure Functional', extension: '.cs', monacoId: 'csharp' },
  { id: 'vbnet', name: 'VB.NET', category: 'Impure Functional', extension: '.vb', monacoId: 'vb' },
  { id: 'ceylon', name: 'Ceylon', category: 'Impure Functional', extension: '.ceylon', monacoId: 'java' },
  { id: 'kotlin', name: 'Kotlin', category: 'Impure Functional', extension: '.kt', monacoId: 'kotlin' },
  { id: 'lisp-func', name: 'LISP', category: 'Impure Functional', extension: '.lisp', monacoId: 'scheme' },
  { id: 'clojure', name: 'Clojure', category: 'Impure Functional', extension: '.clj', monacoId: 'clojure' },
  { id: 'javascript', name: 'JavaScript', category: 'Impure Functional', extension: '.js', monacoId: 'javascript' },
  { id: 'php-func', name: 'PHP', category: 'Impure Functional', extension: '.php', monacoId: 'php' },
  { id: 'python-func', name: 'Python', category: 'Impure Functional', extension: '.py', monacoId: 'python' },

  // Logic-based Programming Languages
  { id: 'prolog', name: 'Prolog', category: 'Logic-based', extension: '.pl', monacoId: 'prolog' },
  { id: 'roop', name: 'ROOP', category: 'Logic-based', extension: '.roop', monacoId: 'prolog' },
  { id: 'alf', name: 'ALF', category: 'Logic-based', extension: '.alf', monacoId: 'prolog' },
  { id: 'alma0', name: 'Alma-0', category: 'Logic-based', extension: '.alma', monacoId: 'prolog' },
  { id: 'curry-logic', name: 'Curry', category: 'Logic-based', extension: '.curry', monacoId: 'haskell' },
  { id: 'fril', name: 'Fril', category: 'Logic-based', extension: '.fril', monacoId: 'prolog' },
  { id: 'janus', name: 'Janus', category: 'Logic-based', extension: '.janus', monacoId: 'prolog' },

  // Object-Oriented Languages
  { id: 'scala', name: 'Scala', category: 'Object-Oriented', extension: '.scala', monacoId: 'scala' },
  { id: 'cpp-oop', name: 'C++', category: 'Object-Oriented', extension: '.cpp', monacoId: 'cpp' },
  { id: 'java-oop', name: 'Java', category: 'Object-Oriented', extension: '.java', monacoId: 'java' },
  { id: 'python-oop', name: 'Python', category: 'Object-Oriented', extension: '.py', monacoId: 'python' },
  { id: 'csharp-oop', name: 'C#', category: 'Object-Oriented', extension: '.cs', monacoId: 'csharp' },
  { id: 'ruby-oop', name: 'Ruby', category: 'Object-Oriented', extension: '.rb', monacoId: 'ruby' },

  // Dataflow Languages
  { id: 'analytica', name: 'Analytica', category: 'Dataflow', extension: '.ana', monacoId: 'sql' },
  { id: 'bmdfm', name: 'BMDFM', category: 'Dataflow', extension: '.bmdfm', monacoId: 'javascript' },
  { id: 'hartmann', name: 'Hartmann pipelines', category: 'Dataflow', extension: '.hart', monacoId: 'javascript' },
  { id: 'lucid', name: 'Lucid', category: 'Dataflow', extension: '.lucid', monacoId: 'haskell' },
  { id: 'max', name: 'Max', category: 'Dataflow', extension: '.maxpat', monacoId: 'json' },
  { id: 'oz', name: 'Oz', category: 'Dataflow', extension: '.oz', monacoId: 'oz' },
  { id: 'prograph', name: 'Prograph', category: 'Dataflow', extension: '.prograph', monacoId: 'javascript' },
  { id: 'puredata', name: 'Pure Data', category: 'Dataflow', extension: '.pd', monacoId: 'json' },

  // Server Side Embeddable Languages
  { id: 'php-server', name: 'PHP', category: 'Server Side Embeddable', extension: '.php', monacoId: 'php' },
  { id: 'vbscript-server', name: 'VBScript', category: 'Server Side Embeddable', extension: '.vbs', monacoId: 'vb' },
  { id: 'smx', name: 'SMX', category: 'Server Side Embeddable', extension: '.smx', monacoId: 'xml' },
  { id: 'tcl', name: 'Tcl', category: 'Server Side Embeddable', extension: '.tcl', monacoId: 'tcl' },
  { id: 'webdna', name: 'WebDNA', category: 'Server Side Embeddable', extension: '.dna', monacoId: 'html' },

  // Client Side Embeddable Languages
  { id: 'actionscript', name: 'ActionScript', category: 'Client Side Embeddable', extension: '.as', monacoId: 'actionscript' },
  { id: 'javascript-client', name: 'JavaScript', category: 'Client Side Embeddable', extension: '.js', monacoId: 'javascript' },
  { id: 'vbscript-client', name: 'VBScript', category: 'Client Side Embeddable', extension: '.vbs', monacoId: 'vb' },

  // Machine Languages
  { id: 'arm', name: 'ARM', category: 'Machine', extension: '.s', monacoId: 'arm' },
  { id: 'dec', name: 'DEC', category: 'Machine', extension: '.mac', monacoId: 'assembly' },
  { id: 'x86', name: 'x86', category: 'Machine', extension: '.asm', monacoId: 'assembly' },
  { id: 'ibm360', name: 'IBM System/360', category: 'Machine', extension: '.s360', monacoId: 'assembly' },
  { id: 'mips', name: 'MIPS', category: 'Machine', extension: '.s', monacoId: 'mips' },
  { id: 'sparc', name: 'Sun, Oracle SPARC', category: 'Machine', extension: '.s', monacoId: 'assembly' },

  // System Languages
  { id: 'ada', name: 'Ada', category: 'System', extension: '.ada', monacoId: 'ada' },
  { id: 'nim', name: 'Nim', category: 'System', extension: '.nim', monacoId: 'nim' },
  { id: 'rust', name: 'Rust', category: 'System', extension: '.rs', monacoId: 'rust' },
  { id: 'swift', name: 'Swift', category: 'System', extension: '.swift', monacoId: 'swift' },
  { id: 'espol', name: 'ESPOL', category: 'System', extension: '.espol', monacoId: 'pascal' },

  // Concurrent Languages
  { id: 'go-concurrent', name: 'Go', category: 'Concurrent', extension: '.go', monacoId: 'go' },
  { id: 'java-concurrent', name: 'Java', category: 'Concurrent', extension: '.java', monacoId: 'java' },
  { id: 'julia', name: 'Julia', category: 'Concurrent', extension: '.jl', monacoId: 'julia' },
  { id: 'clojure-concurrent', name: 'Clojure', category: 'Concurrent', extension: '.clj', monacoId: 'clojure' },
  { id: 'scala-concurrent', name: 'Scala', category: 'Concurrent', extension: '.scala', monacoId: 'scala' },

  // Multiparadigm Languages
  { id: 'ada-multi', name: 'Ada', category: 'Multiparadigm', extension: '.ada', monacoId: 'ada' },
  { id: 'apl-multi', name: 'APL', category: 'Multiparadigm', extension: '.apl', monacoId: 'apl' },
  { id: 'beta', name: 'BETA', category: 'Multiparadigm', extension: '.bet', monacoId: 'pascal' },
  { id: 'cpp-multi', name: 'C++', category: 'Multiparadigm', extension: '.cpp', monacoId: 'cpp' },
  { id: 'csharp-multi', name: 'C#', category: 'Multiparadigm', extension: '.cs', monacoId: 'csharp' },
  { id: 'cobra', name: 'Cobra', category: 'Multiparadigm', extension: '.cobra', monacoId: 'python' },

  // Extension Languages
  { id: 'autolisp', name: 'AutoLISP', category: 'Extension', extension: '.lsp', monacoId: 'scheme' },
  { id: 'beanshell-ext', name: 'BeanShell', category: 'Extension', extension: '.bsh', monacoId: 'java' },
  { id: 'perl-ext', name: 'Perl', category: 'Extension', extension: '.pl', monacoId: 'perl' },
  { id: 'pike', name: 'Pike', category: 'Extension', extension: '.pike', monacoId: 'c' },
  { id: 'ruby-ext', name: 'Ruby', category: 'Extension', extension: '.rb', monacoId: 'ruby' },

  // Hardware Description Languages
  { id: 'verilog-ams', name: 'Verilog-AMS', category: 'Hardware Description', extension: '.vams', monacoId: 'verilog' },
  { id: 'vhdl-ams', name: 'VHDL-AMS', category: 'Hardware Description', extension: '.vhams', monacoId: 'vhdl' },
  { id: 'abel', name: 'ABEL', category: 'Hardware Description', extension: '.abl', monacoId: 'verilog' },
  { id: 'ahdl', name: 'AHDL', category: 'Hardware Description', extension: '.tdf', monacoId: 'verilog' },
  { id: 'bluespec', name: 'Bluespec', category: 'Hardware Description', extension: '.bsv', monacoId: 'verilog' },
  { id: 'lava', name: 'Lava', category: 'Hardware Description', extension: '.lhs', monacoId: 'haskell' },
  { id: 'ella', name: 'ELLA', category: 'Hardware Description', extension: '.ella', monacoId: 'ada' },

  // Visual Languages
  { id: 'analytica-visual', name: 'Analytica', category: 'Visual', extension: '.ana', monacoId: 'sql' },
  { id: 'blockly', name: 'Blockly', category: 'Visual', extension: '.blockly', monacoId: 'javascript' },
  { id: 'drakon', name: 'DRAKON', category: 'Visual', extension: '.drn', monacoId: 'javascript' },
  { id: 'fabrik', name: 'Fabrik', category: 'Visual', extension: '.fab', monacoId: 'javascript' },
  { id: 'scratch', name: 'Scratch', category: 'Visual', extension: '.sb3', monacoId: 'javascript' },
  { id: 'simulink', name: 'Simulink', category: 'Visual', extension: '.slx', monacoId: 'matlab' },

  // Educational Languages
  { id: 'logo', name: 'Logo', category: 'Educational', extension: '.logo', monacoId: 'logo' },
  { id: 'scratch-edu', name: 'Scratch', category: 'Educational', extension: '.sb3', monacoId: 'javascript' },
  { id: 'alice', name: 'Alice', category: 'Educational', extension: '.a3p', monacoId: 'java' },
  { id: 'blockly-edu', name: 'Blockly', category: 'Educational', extension: '.blockly', monacoId: 'javascript' },
  { id: 'karel', name: 'Karel', category: 'Educational', extension: '.krl', monacoId: 'pascal' },

  // Non-English Languages
  { id: 'chinese-basic', name: 'Chinese BASIC', category: 'Non-English', extension: '.bas', monacoId: 'vb' },
  { id: 'fjolnir', name: 'Fjölnir (Icelandic)', category: 'Non-English', extension: '.fjo', monacoId: 'pascal' },
  { id: 'lse', name: 'Language Symbolique d\'Enseignement (French)', category: 'Non-English', extension: '.lse', monacoId: 'pascal' },
  { id: 'lexico', name: 'Lexico (Spanish)', category: 'Non-English', extension: '.lex', monacoId: 'javascript' },
  { id: 'rapira', name: 'Rapira (Russian)', category: 'Non-English', extension: '.rap', monacoId: 'pascal' },
  { id: 'chascript', name: 'ChaScript (Bengali)', category: 'Non-English', extension: '.cha', monacoId: 'javascript' },
  { id: 'ezhil', name: 'ezhil (Tamil)', category: 'Non-English', extension: '.n', monacoId: 'python' },

  // Additional Web Technologies
  { id: 'typescript', name: 'TypeScript', category: 'Web', extension: '.ts', monacoId: 'typescript' },
  { id: 'css', name: 'CSS', category: 'Web', extension: '.css', monacoId: 'css' },
  { id: 'scss', name: 'SCSS', category: 'Web', extension: '.scss', monacoId: 'scss' },
  { id: 'less', name: 'Less', category: 'Web', extension: '.less', monacoId: 'less' },

  // Query Languages
  { id: 'sql', name: 'SQL', category: 'Query', extension: '.sql', monacoId: 'sql' },
  { id: 'xpath', name: 'XPath', category: 'Query', extension: '.xpath', monacoId: 'xml' },
  { id: 'aql', name: 'AQL', category: 'Query', extension: '.aql', monacoId: 'sql' },
  { id: 'pql', name: 'PQL', category: 'Query', extension: '.pql', monacoId: 'sql' },
  { id: 'xquery', name: 'XQuery', category: 'Query', extension: '.xquery', monacoId: 'xml' },

  // Data Formats
  { id: 'json', name: 'JSON', category: 'Data', extension: '.json', monacoId: 'json' },
  { id: 'yaml', name: 'YAML', category: 'Data', extension: '.yaml', monacoId: 'yaml' },
  { id: 'toml', name: 'TOML', category: 'Data', extension: '.toml', monacoId: 'toml' },

  // 🧪 Esoteric & Experimental Languages
  { id: 'brainfuck', name: 'Brainfuck', category: 'Esoteric', extension: '.bf', monacoId: 'plaintext' },
  { id: 'lolcode', name: 'LOLCODE', category: 'Esoteric', extension: '.lol', monacoId: 'plaintext' },
  { id: 'whitespace', name: 'Whitespace', category: 'Esoteric', extension: '.ws', monacoId: 'plaintext' },
  { id: 'malbolge', name: 'Malbolge', category: 'Esoteric', extension: '.mb', monacoId: 'plaintext' },
  { id: 'befunge', name: 'Befunge', category: 'Esoteric', extension: '.bf', monacoId: 'plaintext' },
  { id: 'intercal', name: 'INTERCAL', category: 'Esoteric', extension: '.i', monacoId: 'plaintext' },
  { id: 'ook', name: 'Ook!', category: 'Esoteric', extension: '.ook', monacoId: 'plaintext' },
  { id: 'piet', name: 'Piet', category: 'Esoteric', extension: '.piet', monacoId: 'plaintext' },

  // 🧬 Scientific & Analytical Languages
  { id: 'j-lang', name: 'J', category: 'Scientific', extension: '.ijs', monacoId: 'apl' },
  { id: 'idl', name: 'IDL (Interactive Data Language)', category: 'Scientific', extension: '.pro', monacoId: 'matlab' },
  { id: 'gams', name: 'GAMS', category: 'Scientific', extension: '.gms', monacoId: 'plaintext' },
  { id: 'mathematica', name: 'Mathematica/Wolfram Language', category: 'Scientific', extension: '.m', monacoId: 'mathematica' },
  { id: 'scilab', name: 'Scilab', category: 'Scientific', extension: '.sci', monacoId: 'matlab' },
  { id: 'octave', name: 'GNU Octave', category: 'Scientific', extension: '.m', monacoId: 'matlab' },
  { id: 'sage', name: 'SageMath', category: 'Scientific', extension: '.sage', monacoId: 'python' },

  // 🧙‍♂️ Blockchain & Smart Contract Languages
  { id: 'solidity', name: 'Solidity', category: 'Blockchain', extension: '.sol', monacoId: 'solidity' },
  { id: 'vyper', name: 'Vyper', category: 'Blockchain', extension: '.vy', monacoId: 'python' },
  { id: 'move', name: 'Move', category: 'Blockchain', extension: '.move', monacoId: 'rust' },
  { id: 'cairo', name: 'Cairo', category: 'Blockchain', extension: '.cairo', monacoId: 'rust' },
  { id: 'scilla', name: 'Scilla', category: 'Blockchain', extension: '.scilla', monacoId: 'haskell' },
  { id: 'michelson', name: 'Michelson', category: 'Blockchain', extension: '.tz', monacoId: 'lisp' },
  { id: 'clarity', name: 'Clarity', category: 'Blockchain', extension: '.clar', monacoId: 'lisp' },

  // 🧰 Configuration & Build Languages
  { id: 'makefile', name: 'Makefile', category: 'Configuration', extension: '.mk', monacoId: 'makefile' },
  { id: 'hcl', name: 'HCL (HashiCorp Configuration Language)', category: 'Configuration', extension: '.hcl', monacoId: 'hcl' },
  { id: 'gradle', name: 'Gradle DSL', category: 'Configuration', extension: '.gradle', monacoId: 'groovy' },
  { id: 'cmake', name: 'CMake', category: 'Configuration', extension: '.cmake', monacoId: 'cmake' },
  { id: 'bazel', name: 'Bazel/Starlark', category: 'Configuration', extension: '.bzl', monacoId: 'python' },
  { id: 'nix', name: 'Nix', category: 'Configuration', extension: '.nix', monacoId: 'nix' },
  { id: 'dockerfile', name: 'Dockerfile', category: 'Configuration', extension: '.dockerfile', monacoId: 'dockerfile' },
  { id: 'ansible', name: 'Ansible YAML', category: 'Configuration', extension: '.yml', monacoId: 'yaml' },

  // 🧩 Emerging or Niche Languages
  { id: 'zig', name: 'Zig', category: 'Emerging', extension: '.zig', monacoId: 'zig' },
  { id: 'crystal', name: 'Crystal', category: 'Emerging', extension: '.cr', monacoId: 'ruby' },
  { id: 'bosque', name: 'Bosque', category: 'Emerging', extension: '.bsq', monacoId: 'typescript' },
  { id: 'v-lang', name: 'V', category: 'Emerging', extension: '.v', monacoId: 'go' },
  { id: 'odin', name: 'Odin', category: 'Emerging', extension: '.odin', monacoId: 'go' },
  { id: 'red', name: 'Red', category: 'Emerging', extension: '.red', monacoId: 'rebol' },
  { id: 'pony', name: 'Pony', category: 'Emerging', extension: '.pony', monacoId: 'rust' },
  { id: 'grain', name: 'Grain', category: 'Emerging', extension: '.gr', monacoId: 'ocaml' },

  // 🧠 Metaprogramming & Macro Languages
  { id: 'racket', name: 'Racket', category: 'Metaprogramming', extension: '.rkt', monacoId: 'racket' },
  { id: 'elixir', name: 'Elixir', category: 'Metaprogramming', extension: '.ex', monacoId: 'elixir' },
  { id: 'nim', name: 'Nim', category: 'Metaprogramming', extension: '.nim', monacoId: 'nim' },
  { id: 'hy', name: 'Hy', category: 'Metaprogramming', extension: '.hy', monacoId: 'lisp' },
  { id: 'clojure-macros', name: 'Clojure (with macros)', category: 'Metaprogramming', extension: '.clj', monacoId: 'clojure' },
  { id: 'template-haskell', name: 'Template Haskell', category: 'Metaprogramming', extension: '.hs', monacoId: 'haskell' },
  { id: 'rust-macros', name: 'Rust (with macros)', category: 'Metaprogramming', extension: '.rs', monacoId: 'rust' },

  // 🧑‍🏫 Educational & Localized Languages
  { id: 'kalaam', name: 'Kalaam (Hindi)', category: 'Educational', extension: '.kal', monacoId: 'plaintext' },
  { id: 'citrine', name: 'Citrine', category: 'Educational', extension: '.ctr', monacoId: 'plaintext' },
  { id: 'hedy', name: 'Hedy', category: 'Educational', extension: '.hedy', monacoId: 'python' },
  { id: 'kojo', name: 'Kojo', category: 'Educational', extension: '.kojo', monacoId: 'scala' },
  { id: 'snap', name: 'Snap!', category: 'Educational', extension: '.xml', monacoId: 'xml' },
  { id: 'turtlestitch', name: 'TurtleStitch', category: 'Educational', extension: '.xml', monacoId: 'xml' },
  { id: 'quorum', name: 'Quorum', category: 'Educational', extension: '.quorum', monacoId: 'java' },
  { id: 'greenfoot', name: 'Greenfoot Java', category: 'Educational', extension: '.java', monacoId: 'java' },
];

export const getLanguageByCategory = (category: string): ProgrammingLanguage[] => {
  return PROGRAMMING_LANGUAGES.filter(lang => lang.category === category);
};

export const getLanguageById = (id: string): ProgrammingLanguage | undefined => {
  return PROGRAMMING_LANGUAGES.find(lang => lang.id === id);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(PROGRAMMING_LANGUAGES.map(lang => lang.category));
  return Array.from(categories).sort();
};
