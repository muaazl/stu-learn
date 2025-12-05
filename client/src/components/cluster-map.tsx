'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const ClusterMap = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/graph');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center text-gray-400">Analyzing clusters...</div>;
  if (data.length < 3) return null; // Hide if not enough data

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-lg text-black font-semibold mb-4">Knowledge Map</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" hide />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border shadow-lg rounded text-sm">
                      <p className="font-bold">{payload[0].payload.title}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Notes" data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.cluster % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">
        Notes with similar colors and positions are conceptually related.
      </p>
    </div>
  );
};