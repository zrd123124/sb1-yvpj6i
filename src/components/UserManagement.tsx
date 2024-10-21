import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus, Save, X } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  role: 'admin' | 'user';
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState<Omit<UserData, 'id' | 'lastLogin'>>({
    username: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    // 模拟从后端获取用户数据
    const mockUsers: UserData[] = [
      { id: 1, username: 'admin', role: 'admin', lastLogin: '2023-05-01 09:00:00' },
      { id: 2, username: 'user1', role: 'user', lastLogin: '2023-05-01 10:30:00' },
      { id: 3, username: 'user2', role: 'user', lastLogin: '2023-05-01 11:45:00' },
    ];
    setUsers(mockUsers);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleAddUser = () => {
    const newUserId = Math.max(...users.map(u => u.id)) + 1;
    const userToAdd = {
      ...newUser,
      id: newUserId,
      lastLogin: 'N/A',
    };
    setUsers([...users, userToAdd]);
    setNewUser({ username: '', role: 'user' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">用户权限管理</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">添加新用户</h3>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="用户名"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
          </select>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            添加用户
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser?.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      className="px-2 py-1 border rounded"
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="mr-2 text-gray-400" size={20} />
                      <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser?.id === user.id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'user' })}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                    </select>
                  ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingUser?.id === user.id ? (
                    <>
                      <button onClick={handleSaveUser} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingUser(null)} className="text-red-600 hover:text-red-900">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;