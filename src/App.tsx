import React, { useState } from 'react';
import { Database, Settings, Brain, LogOut, FileText, BarChart2, Users, HelpCircle, Home } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DataCenter from './components/DataCenter';
import DeviceManagement from './components/DeviceManagement';
import AlgorithmConfig from './components/AlgorithmConfig';
import LogManagement from './components/LogManagement';
import PerformanceMonitor from './components/PerformanceMonitor';
import UserManagement from './components/UserManagement';
import HelpDocs from './components/HelpDocs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('首页');
  const [userRole, setUserRole] = useState('user');

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername(username);
      setUserRole('admin');
    } else if (username === 'user' && password === 'user') {
      setIsLoggedIn(true);
      setUsername(username);
      setUserRole('user');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('user');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const menuItems = [
    { name: '首页', icon: Home, role: 'user' },
    { name: '数据中心', icon: Database, role: 'user' },
    { name: '设备管理', icon: Settings, role: 'user' },
    { name: '算法配置', icon: Brain, role: 'user' },
    { name: '日志管理', icon: FileText, role: 'user' },
    { name: '性能监控', icon: BarChart2, role: 'user' },
    { name: '用户权限管理', icon: Users, role: 'admin' },
    { name: '帮助文档', icon: HelpCircle, role: 'user' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧导航栏 */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">环浔智能控制</h2>
          <p className="text-sm text-gray-600 mt-2">欢迎，{username}</p>
        </div>
        <ul className="mt-8">
          {menuItems.map(({ name, icon: Icon, role }) => (
            (userRole === 'admin' || role === 'user') && (
              <li
                key={name}
                className={`px-4 py-2 cursor-pointer flex items-center ${
                  activeTab === name ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(name)}
              >
                <Icon size={18} className="mr-2" />
                {name}
              </li>
            )
          ))}
        </ul>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center justify-center"
          >
            <LogOut size={18} className="mr-2" />
            登出
          </button>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === '首页' && <Dashboard />}
        {activeTab === '数据中心' && <DataCenter />}
        {activeTab === '设备管理' && <DeviceManagement />}
        {activeTab === '算法配置' && <AlgorithmConfig />}
        {activeTab === '日志管理' && <LogManagement />}
        {activeTab === '性能监控' && <PerformanceMonitor />}
        {activeTab === '用户权限管理' && userRole === 'admin' && <UserManagement />}
        {activeTab === '帮助文档' && <HelpDocs />}
      </main>
    </div>
  );
}

export default App;