import React from 'react'
import { Server, Activity, ArrowDownToLine, Settings } from 'lucide-react'

export default function InputForm({ data, onChange }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === 'number') {
      newValue = parseInt(value, 10);
    } else if (type === 'range') {
      newValue = parseFloat(value);
    }
    onChange({ ...data, [name]: newValue });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-500" />
        Configuration
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-500" /> Number of Replicas
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{data.replicas}</span>
          </label>
          <input 
            type="number" 
            name="replicas" 
            min="1" 
            max="100" 
            value={data.replicas} 
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" /> SLA Target (%)
            </span>
            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded text-xs font-bold">
              {data.slaPercentage}%
            </span>
          </label>
          <input 
            type="range" 
            name="slaPercentage" 
            min="0" 
            max="100" 
            step="0.01"
            value={data.slaPercentage} 
            onChange={handleChange}
            className="w-full appearance-none bg-slate-200 dark:bg-slate-700 h-2 rounded-full outline-none accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>0%</span>
            <span>90%</span>
            <span>99%</span>
            <span>99.9%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              Workload Type
          </label>
          <select 
            name="workloadType" 
            value={data.workloadType} 
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="stateless">Stateless (Deployment)</option>
            <option value="stateful">Stateful (StatefulSet)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
