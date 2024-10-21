import React, { useState, useEffect } from 'react';
import { Download, Database, Table, Check, X } from 'lucide-react';

interface MongoDBConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

const DataCenter: React.FC = () => {
  const [databases, setDatabases] = useState<MongoDBConfig[]>([
    {
      name: '双馈氧调控数据库',
      host: 'localhost',
      port: 27017,
      username: 'oxygen_user',
      password: 'oxygen_pass'
    },
    {
      name: '空压机智能调控数据库',
      host: 'localhost',
      port: 27018,
      username: 'compressor_user',
      password: 'compressor_pass'
    }
  ]);
  const [newDatabase, setNewDatabase] = useState<MongoDBConfig>({
    name: '',
    host: 'localhost',
    port: 27017,
    username: '',
    password: '',
  });
  const [selectedDatabase, setSelectedDatabase] = useState<MongoDBConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (databases.length > 0) {
      handleSelectDatabase(databases[0]);
    }
  }, []);

  const handleCreateDatabase = () => {
    if (newDatabase.name) {
      setDatabases([...databases, newDatabase]);
      setNewDatabase({
        name: '',
        host: 'localhost',
        port: 27017,
        username: '',
        password: '',
      });
    }
  };

  const handleSelectDatabase = (db: MongoDBConfig) => {
    setSelectedDatabase(db);
    setIsEditing(false);
    setConnectionStatus(null);
    // 模拟获取表名列表
    if (db.name === '双馈氧调控数据库') {
      setTables(['氧气浓度', '流量数据', '能耗数据']);
    } else if (db.name === '空压机智能调控数据库') {
      setTables(['压力数据', '功率数据', '温度数据']);
    } else {
      setTables(['表1', '表2', '表3']);
    }
    // 默认选择第一个表
    setSelectedTable(tables[0] || null);
  };

  const handleEditDatabase = () => {
    setIsEditing(true);
  };

  const handleSaveDatabase = () => {
    if (selectedDatabase) {
      setDatabases(databases.map(db => db.name === selectedDatabase.name ? selectedDatabase : db));
      setIsEditing(false);
    }
  };

  const handleTestConnection = () => {
    // 模拟测试连接
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.5 ? 'connected' : 'disconnected');
    }, 1000);
  };

  const handleSelectTable = (table: string) => {
    setSelectedTable(table);
  };

  const handleDownloadCSV = () => {
    if (selectedDatabase && selectedTable && startDate && endDate) {
      console.log(`Downloading CSV for ${selectedDatabase.name}.${selectedTable} from ${startDate} to ${endDate}`);
      // 这里应该调用后端 API 来实际下载数据
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">MongoDB 数据库管理</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newDatabase.name}
            onChange={(e) => setNewDatabase({...newDatabase, name: e.target.value})}
            placeholder="新数据库名称"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            value={newDatabase.host}
            onChange={(e) => setNewDatabase({...newDatabase, host: e.target.value})}
            placeholder="主机地址"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={newDatabase.port}
            onChange={(e) => setNewDatabase({...newDatabase, port: parseInt(e.target.value)})}
            placeholder="端口"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            value={newDatabase.username}
            onChange={(e) => setNewDatabase({...newDatabase, username: e.target.value})}
            placeholder="用户名"
            className="border rounded px-3 py-2"
          />
          <input
            type="password"
            value={newDatabase.password}
            onChange={(e) => setNewDatabase({...newDatabase, password: e.target.value})}
            placeholder="密码"
            className="border rounded px-3 py-2"
          />
          <button
            onClick={handleCreateDatabase}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            创建数据库
          </button>
        </div>
        {databases.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {databases.map((db) => (
              <div
                key={db.name}
                onClick={() => handleSelectDatabase(db)}
                className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                  selectedDatabase?.name === db.name ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <Database size={20} className="mr-2 text-blue-500" />
                <span>{db.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">暂无数据库，请创建新的数据库。</p>
        )}
      </div>

      {selectedDatabase && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">数据库: {selectedDatabase.name}</h4>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={selectedDatabase.host}
                onChange={(e) => setSelectedDatabase({...selectedDatabase, host: e.target.value})}
                placeholder="主机地址"
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                value={selectedDatabase.port}
                onChange={(e) => setSelectedDatabase({...selectedDatabase, port: parseInt(e.target.value)})}
                placeholder="端口"
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                value={selectedDatabase.username}
                onChange={(e) => setSelectedDatabase({...selectedDatabase, username: e.target.value})}
                placeholder="用户名"
                className="border rounded px-3 py-2"
              />
              <input
                type="password"
                value={selectedDatabase.password}
                onChange={(e) => setSelectedDatabase({...selectedDatabase, password: e.target.value})}
                placeholder="密码"
                className="border rounded px-3 py-2"
              />
              <button
                onClick={handleSaveDatabase}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                保存更改
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <p>主机: {selectedDatabase.host}</p>
              <p>端口: {selectedDatabase.port}</p>
              <p>用户名: {selectedDatabase.username}</p>
              <div className="mt-2">
                <button
                  onClick={handleEditDatabase}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                >
                  编辑
                </button>
                <button
                  onClick={handleTestConnection}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                >
                  测试连接
                </button>
              </div>
            </div>
          )}
          {connectionStatus && (
            <div className={`mb-4 ${connectionStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
              {connectionStatus === 'connected' ? (
                <div className="flex items-center">
                  <Check size={20} className="mr-2" />
                  连接成功
                </div>
              ) : (
                <div className="flex items-center">
                  <X size={20} className="mr-2" />
                  连接失败
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table}
                onClick={() => handleSelectTable(table)}
                className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                  selectedTable === table ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <Table size={20} className="mr-2 text-green-500" />
                <span>{table}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTable && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">表格: {selectedTable}</h4>
          <div className="mb-4 flex flex-wrap gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <button
              onClick={handleDownloadCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
            >
              <Download size={18} className="mr-2" />
              下载CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCenter;