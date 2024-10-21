import React, { useState, useEffect } from 'react';
import { RefreshCw, Cpu, HardDrive, Clock, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  cpuUsage: number;
  memoryUsage: number;
  executionTime: number;
  activeAlgorithms: number;
  timestamp: number;
}

const PerformanceMonitor: React.FC = () => {
  const [currentData, setCurrentData] = useState<PerformanceData>({
    cpuUsage: 0,
    memoryUsage: 0,
    executionTime: 0,
    activeAlgorithms: 0,
    timestamp: Date.now(),
  });
  const [historicalData, setHistoricalData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 5000); // 每5秒更新一次数据
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = () => {
    // 模拟从后端获取性能数据
    const newData: PerformanceData = {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      executionTime: Math.random() * 1000,
      activeAlgorithms: Math.floor(Math.random() * 10),
      timestamp: Date.now(),
    };
    setCurrentData(newData);
    setHistoricalData(prevData => {
      const updatedData = [...prevData, newData];
      return updatedData.slice(-20); // 保留最近20个数据点
    });
  };

  const renderPerformanceCard = (title: string, value: number, unit: string, icon: React.ReactNode) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold text-indigo-600">
        {value.toFixed(2)} <span className="text-lg text-gray-500">{unit}</span>
      </div>
    </div>
  );

  const renderChart = (data: PerformanceData[], dataKey: keyof PerformanceData, color: string, unit: string) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
          formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, '']}
        />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={color} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">性能监控</h2>
        <button
          onClick={fetchPerformanceData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <RefreshCw size={20} className="mr-2" />
          刷新数据
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderPerformanceCard("CPU 使用率", currentData.cpuUsage, "%", <Cpu className="text-blue-500" size={24} />)}
        {renderPerformanceCard("内存使用率", currentData.memoryUsage, "%", <HardDrive className="text-green-500" size={24} />)}
        {renderPerformanceCard("平均执行时间", currentData.executionTime, "ms", <Clock className="text-yellow-500" size={24} />)}
        {renderPerformanceCard("活跃算法数", currentData.activeAlgorithms, "", <Activity className="text-red-500" size={24} />)}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">CPU 使用率趋势</h3>
        {renderChart(historicalData, 'cpuUsage', '#3B82F6', '%')}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">内存使用率趋势</h3>
        {renderChart(historicalData, 'memoryUsage', '#10B981', '%')}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">平均执行时间趋势</h3>
        {renderChart(historicalData, 'executionTime', '#F59E0B', 'ms')}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">活跃算法数趋势</h3>
        {renderChart(historicalData, 'activeAlgorithms', '#EF4444', '')}
      </div>
    </div>
  );
};

export default PerformanceMonitor;