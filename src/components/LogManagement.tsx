import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw } from 'lucide-react';

interface Log {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  module: string;
}

const LogManagement: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error'>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, filterLevel]);

  const fetchLogs = async () => {
    // 模拟从后端获取日志数据
    const mockLogs: Log[] = [
      { id: 1, timestamp: '2023-05-01 10:00:00', level: 'info', message: '系统启动', module: '主程序' },
      { id: 2, timestamp: '2023-05-01 10:05:00', level: 'warning', message: '设备连接超时', module: '设备管理' },
      { id: 3, timestamp: '2023-05-01 10:10:00', level: 'error', message: '数据库连接失败', module: '数据中心' },
      // ... 更多模拟日志数据
    ];
    setLogs(mockLogs);
  };

  const filterLogs = () => {
    let filtered = logs;
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }
    setFilteredLogs(filtered);
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Timestamp,Level,Message,Module\n"
      + filteredLogs.map(log => `${log.id},${log.timestamp},${log.level},${log.message},${log.module}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">日志管理</h2>
      <div className="flex space-x-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="搜索日志..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as 'all' | 'info' | 'warning' | 'error')}
          className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">所有级别</option>
          <option value="info">信息</option>
          <option value="warning">警告</option>
          <option value="error">错误</option>
        </select>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <Download size={20} className="mr-2" />
          导出日志
        </button>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <RefreshCw size={20} className="mr-2" />
          刷新
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间戳</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">级别</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">模块</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.level === 'info' ? 'bg-green-100 text-green-800' :
                    log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.module}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogManagement;