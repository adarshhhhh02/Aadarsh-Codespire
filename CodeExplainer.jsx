import React, { useState } from 'react';
import { 
  Code2, 
  Bug, 
  FileText, 
  Image as ImageIcon, 
  Terminal, 
  Zap, 
  Settings, 
  Copy, 
  Check, 
  Play, 
  Cpu,
  Loader2,
  Braces,
  PenTool,
  Laptop
} from 'lucide-react';

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_CODE = `function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
}`;

const MOCK_ERROR = `TypeError: Cannot read properties of undefined (reading 'price')
    at calculateTotal (<anonymous>:3:24)
    at Array.reduce (<anonymous>)`;

const MOCK_RESPONSES = {
  explainer: `### Code Analysis
This function \`calculateTotal\` calculates the total cost of a shopping cart.
- It takes an array of \`items\` as input.
- It uses the \`reduce\` method to iterate over the items.
- For each item, it multiplies \`price\` by \`quantity\` and adds it to the accumulator (\`acc\`).
- Returns the final total number.`,
  
  debugger: `### Bug Detected
The error suggests that one of the items in your array is \`undefined\` or missing the \`price\` property.

### Fix
Add a safety check inside the reduce function:

\`\`\`javascript
function calculateTotal(items) {
  if (!items) return 0;
  return items.reduce((acc, item) => {
    // Safety check
    if (!item || !item.price) return acc;
    return acc + (item.price * (item.quantity || 1));
  }, 0);
}
\`\`\``,

  docs: `## Function: calculateTotal

Calculates the sum total value of items in a cart.

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| \`items\` | \`Array<Object>\` | List of item objects containing \`price\` and \`quantity\`. |

### Returns
* \`number\`: The total calculated cost.

### Example
\`\`\`javascript
const cart = [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }];
const total = calculateTotal(cart); // Returns 25
\`\`\``,

  sketch: `\`\`\`jsx
// Login Component based on sketch
export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Welcome Back</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 w-full rounded-md border p-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 w-full rounded-md border p-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <button className="w-full rounded-md bg-blue-600 py-2 font-bold text-white hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
\`\`\``
};

export default function DevForge() {
  // --- STATE ---
  const [activeTool, setActiveTool] = useState('explainer');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  // Tool Inputs
  const [codeInput, setCodeInput] = useState(MOCK_CODE);
  const [errorInput, setErrorInput] = useState(MOCK_ERROR);
  const [sketchDescription, setSketchDescription] = useState('A modern login card centered on the screen. It should have an email field, a password field, and a full-width blue "Sign In" button. Add a "Welcome Back" header.');

  // --- HANDLERS ---

  const tools = [
    { id: 'explainer', name: 'Snapshot Explainer', icon: <ImageIcon className="w-4 h-4" />, desc: 'Explain code from snippets' },
    { id: 'debugger', name: 'Bug Hunter', icon: <Bug className="w-4 h-4" />, desc: 'Auto-fix & explain errors' },
    { id: 'docs', name: 'AutoDocs', icon: <FileText className="w-4 h-4" />, desc: 'Generate documentation' },
    { id: 'sketch', name: 'Sketch2Code', icon: <PenTool className="w-4 h-4" />, desc: 'UI Sketch to React Code' },
  ];

  const generateResponse = async () => {
    setIsLoading(true);
    setOutput('');

    // Mock Mode
    if (!apiKey) {
      await new Promise(r => setTimeout(r, 1500));
      setOutput(MOCK_RESPONSES[activeTool]);
      setIsLoading(false);
      return;
    }

    // Real API Call
    try {
      let prompt = '';
      if (activeTool === 'explainer') {
        prompt = `Explain this code snippet in detail for a junior developer:\n${codeInput}`;
      } else if (activeTool === 'debugger') {
        prompt = `Fix this code based on the error. \nCODE:\n${codeInput}\n\nERROR:\n${errorInput}\n\nProvide the fixed code and explain the bug.`;
      } else if (activeTool === 'docs') {
        prompt = `Generate professional Markdown documentation (JSDoc style params, returns, example) for this code:\n${codeInput}`;
      } else if (activeTool === 'sketch') {
        prompt = `Act as an expert UI Developer. Write a React functional component using Tailwind CSS based on this description of a UI sketch:\n"${sketchDescription}"\n\nReturn only the code.`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const text = data.candidates[0].content.parts[0].text;
      setOutput(text);

    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERERS ---

  const renderInputSection = () => {
    switch(activeTool) {
      case 'sketch':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Describe your UI Sketch
              </label>
              <textarea 
                value={sketchDescription}
                onChange={(e) => setSketchDescription(e.target.value)}
                className="w-full h-32 bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-sans"
                placeholder="E.g., A navbar with a logo on the left and three links on the right..."
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ImageIcon className="w-4 h-4" />
              <span>(In a real app, you would upload an image here for the multimodal AI to analyze directly)</span>
            </div>
          </div>
        );
      case 'debugger':
        return (
          <div className="grid grid-cols-1 gap-4 h-full">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Broken Code
              </label>
              <textarea 
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="flex-1 w-full bg-slate-900 text-green-400 font-mono text-sm p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col">
              <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                Error Log
              </label>
              <textarea 
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                className="h-24 w-full bg-slate-900 text-red-300 font-mono text-sm p-3 rounded-lg border border-red-900/50 focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
            </div>
          </div>
        );
      default: // explainer & docs
        return (
          <div className="h-full bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Source Code
            </label>
            <textarea 
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-blue-300 font-mono text-sm p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="// Paste your code snippet here..."
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white hidden lg:block">DevForge</span>
        </div>

        <div className="p-4 space-y-2 flex-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTool === tool.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tool.icon}
              <div className="text-left hidden lg:block">
                <div className="font-medium text-sm">{tool.name}</div>
                <div className="text-[10px] opacity-60">{tool.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              showSettings ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {tools.find(t => t.id === activeTool)?.icon}
            {tools.find(t => t.id === activeTool)?.name}
          </h2>
          
          {/* API Key Panel */}
          {showSettings && (
            <div className="absolute top-16 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-3 text-yellow-400">
                <Zap className="w-4 h-4" />
                <span className="font-bold text-sm">Gemini API Configuration</span>
              </div>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mb-2"
              />
              <p className="text-xs text-slate-500">Leave empty to use Demo Mode (Mock Data).</p>
            </div>
          )}
        </header>

        {/* Workspace */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col lg:flex-row gap-6">
          
          {/* Left Panel: Inputs */}
          <div className="flex-1 flex flex-col min-h-[300px] lg:h-full">
            {renderInputSection()}
            
            <div className="mt-4">
              <button
                onClick={generateResponse}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isLoading 
                    ? 'bg-slate-700 cursor-wait' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Run {tools.find(t => t.id === activeTool)?.name}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-inner h-full">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4" /> AI Output
              </span>
              {output && (
                <button 
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copy Output"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="animate-pulse">Forging solution...</p>
                </div>
              ) : output ? (
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                  {/* Simple syntax highlighting simulation for demo */}
                  {output.split('```').map((part, i) => 
                    i % 2 === 1 ? (
                      <div key={i} className="bg-slate-950 p-4 rounded-lg border border-slate-800 my-4 text-green-400 overflow-x-auto">
                        {part}
                      </div>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                  <Braces className="w-16 h-16 mb-4" />
                  <p>Ready to generate code.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
