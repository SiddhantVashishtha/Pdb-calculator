import React from 'react'
import { Download, AlertTriangle, CheckCircle } from 'lucide-react'

export default function OutputView({ result }) {
  if (!result) return null;

  const handleDownload = () => {
    const blob = new Blob([result.yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdb.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-6">PDB Recommendation</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg text-center">
          <div className="text-sm text-slate-500 mb-1">minAvailable</div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.minAvailable}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg text-center">
          <div className="text-sm text-slate-500 mb-1">maxUnavailable</div>
          <div className={`text-3xl font-bold ${result.maxUnavailable === 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {result.maxUnavailable}
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg mb-6 border ${result.maxUnavailable === 0 ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 text-amber-800 dark:text-amber-200' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'}`}>
        <div className="flex gap-3">
          {result.maxUnavailable === 0 ? <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
          <div className="text-sm leading-relaxed">{result.explanation}</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Generated Kubernetes YAML</h3>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-1.5 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
        <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-800 shadow-inner">
          <pre className="text-xs text-indigo-300 font-mono">
            <code>{result.yaml}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
