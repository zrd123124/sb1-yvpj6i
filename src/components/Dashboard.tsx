import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ArrowUpDown } from 'lucide-react';

interface DatabaseData {
  id: string;
  name: string;
  data: {
    timeSeriesData: { timestamp: number; value: number }[];
    distributionData: { name: string; value: number }[];
    categoryData: { category: string; value: number }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard: React.FC = () => {
  const [databases, setDatabases] = useState<DatabaseData[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseData | null>(null);

  useEffect(() => {
    // 模拟从后端获取数据库列表和数据
    const mockDatabases: DatabaseData[] = [
      {
        id: '1',
        name: '双馈氧调控数据库',
        data: {
          timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
            timestamp: Date.now() - (23 - i) * 3600000,
            value: Math.random() * 100
          })),
          distributionData: [
            { name: '溶解氧', value: 30 },
            { name: '温度', value: 25 },
            { name: '流量', value: 45 }
          ],
          categoryData: [
            { category: '风机1', value: 400 },
            { category: '风机2', value: 300 },
            { category: '风机3', value: 200 },
            { category: '风机4', value: 100 }
          ]
        }
      },
      {
        id: '2',
        name: '空压机智能调控数据库',
        data: {
          timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
            timestamp: Date.now() - (23 - i) * 3600000,
            value: Math.random() * 100
          })),
          distributionData: [
            { name: '压力', value: 40 },
            { name: '功率', value: 30 },
            { name: '效率', value: 30 }
          ],
          categoryData: [
            { category: '空压机1', value: 500 },
            { category: '空压机2', value: 400 },
            { category: '空压机3', value: 300 },
            { category: '空压机4', value: 200 }
          ]
        }
      }
    ];

    setDatabases(mockDatabases);
    setSelectedDatabase(mockDatabases[0]);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-4 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">数据库大屏展示</h1>
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedDatabase?.id}
            onChange={(e) => setSelectedDatabase(databases.find(db => db.id === e.target.value) || null)}
          >
            {databases.map(db => (
              <option key={db.id} value={db.id}>{db.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ArrowUpDown size={20} />
          </div>
        </div>
      </div>

      {selectedDatabase && (
        <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-4 p-4">
          <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">时间序列数据</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={selectedDatabase.data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">数据分布</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={selectedDatabase.data.distributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {selectedDatabase.data.distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">类别数据</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={selectedDatabase.data.categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;