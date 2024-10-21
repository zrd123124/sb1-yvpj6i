import React from 'react';
import { Book, FileText, HelpCircle } from 'lucide-react';

const HelpDocs: React.FC = () => {
  const helpSections = [
    {
      title: '系统概述',
      icon: <Book size={24} className="text-blue-500" />,
      content: '环浔智能控制系统是一个综合性的工业控制平台，集成了数据中心、设备管理、算法配置等多个模块，旨在提高生产效率和优化资源利用。'
    },
    {
      title: '模块说明',
      icon: <FileText size={24} className="text-green-500" />,
      content: (
        <ul className="list-disc list-inside">
          <li>数据中心：管理和分析生产数据</li>
          <li>设备管理：监控和控制工业设备</li>
          <li>算法配置：优化控制算法参数</li>
          <li>日志管理：查看系统运行日志</li>
          <li>性能监控：实时监控系统性能</li>
          <li>用户权限管理：管理用户访问权限</li>
        </ul>
      )
    },
    {
      title: '常见问题',
      icon: <HelpCircle size={24} className="text-yellow-500" />,
      content: (
        <div>
          <p className="font-semibold">1. 如何添加新设备？</p>
          <p>进入设备管理模块，点击"添加设备"按钮，填写设备信息后保存即可。</p>
          <p className="font-semibold mt-2">2. 如何调整算法参数？</p>
          <p>在算法配置模块中，选择需要调整的算法，修改参数值后点击"保存配置"。</p>
          <p className="font-semibold mt-2">3. 如何查看历史数据？</p>
          <p>在数据中心模块，使用日期选择器选择时间范围，然后点击"查询"即可查看历史数据。</p>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">帮助文档</h2>
      {helpSections.map((section, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            {section.icon}
            <h3 className="text-xl font-semibold ml-2">{section.title}</h3>
          </div>
          <div className="text-gray-600">
            {typeof section.content === 'string' ? <p>{section.content}</p> : section.content}
          </div>
        </div>
      ))}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">联系支持</h3>
        <p className="text-gray-600">如果您在使用过程中遇到任何问题或需要进一步的帮助，请联系我们的技术支持团队：</p>
        <ul className="list-disc list-inside mt-2 text-gray-600">
          <li>电子邮件：support@huanxun.com</li>
          <li>电话：400-123-4567</li>
          <li>工作时间：周一至周五 9:00-18:00</li>
        </ul>
      </div>
    </div>
  );
};

export default HelpDocs;