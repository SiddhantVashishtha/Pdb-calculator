import React, { useState, useEffect } from 'react'
import InputForm from './components/InputForm'
import OutputView from './components/OutputView'
import SlaGraph from './components/SlaGraph'
import { calculatePdb } from './api'
import { Moon, Sun } from 'lucide-react'

function App() {
  const [theme, setTheme] = useState('light')
  const [data, setData] = useState({
    replicas: 5,
    slaPercentage: 99.9,
    workloadType: 'stateless',
    failureTolerance: 1
  })
  
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Calculate whenever data changes (debounced by React state updates)
  useEffect(() => {
    let active = true;
    const fetchPdb = async () => {
      try {
        const res = await calculatePdb(data);
        if (active) {
          setResult(res);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          setResult(null);
        }
      }
    };
    fetchPdb();
    return () => { active = false; };
  }, [data]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center selection:bg-indigo-500/30">
      <div className="w-full max-w-5xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              PDB Calculator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Optimize your Kubernetes Pod Disruption Budgets
            </p>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-indigo-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <InputForm data={data} onChange={setData} />
            <OutputView result={result} />
          </div>
          <div className="lg:col-span-7">
            <SlaGraph replicas={data.replicas} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
