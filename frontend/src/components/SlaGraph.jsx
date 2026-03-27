import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

export default function SlaGraph({ replicas }) {
  const data = useMemo(() => {
    const points = [];
    // Generate data points for SLA percentages from 50% to 100%
    for (let sla = 50; sla <= 100; sla += 2) {
      let minAvailable = Math.ceil(replicas * (sla / 100.0));
      if (minAvailable > replicas) minAvailable = replicas;
      if (minAvailable === 0 && sla > 0) minAvailable = 1;

      const maxUnavailable = replicas - minAvailable;
      
      points.push({
        sla: Math.round(sla),
        allowedDisruptions: maxUnavailable,
      });
    }
    return points;
  }, [replicas]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" />
        SLA vs Allowed Disruptions
      </h2>
      
      <div className="flex-grow w-full h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorDisruptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="sla" 
              tickFormatter={(tick) => `${tick}%`}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1', opacity: 0.5 }}
              label={{ value: 'SLA Requirement (%)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              label={{ value: 'maxUnavailable', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#818cf8' }}
              formatter={(value) => [value, 'Allowed Disruptions']}
              labelFormatter={(label) => `SLA: ${label}%`}
            />
            <Area 
              type="stepAfter" 
              dataKey="allowedDisruptions" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDisruptions)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 text-center mt-2">
        See how higher SLA requirements reduce the number of pods that can be voluntarily taken offline.
      </p>
    </div>
  );
}
