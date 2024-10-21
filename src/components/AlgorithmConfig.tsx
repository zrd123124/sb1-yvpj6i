import React, { useState } from 'react';
import { Save, Wind, Gauge, Brain, BarChart } from 'lucide-react';

interface ControlSystem {
  name: string;
  icon: React.ReactNode;
  parameters: { [key: string]: number | string };
}

interface MLModel {
  name: string;
  icon: React.ReactNode;
  parameters: { [key: string]: number | string };
}

const AlgorithmConfig: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<'oxygen' | 'compressor'>('oxygen');
  const [activeModel, setActiveModel] = useState<'bp' | 'lstm'>('bp');
  const [oxygenSystem, setOxygenSystem] = useState<ControlSystem>({
    name: '双馈氧调控系统',
    icon: <Wind className="text-blue-500" size={24} />,
    parameters: {
      'DO中值': 5,
      'DO末值': 7,
      '溶解氧设定值': 6,
      '风机1状态': 1,
      '风机2状态': 0,
      '环境温度': 25,
      '负载状态': 80,
      '空气流量': 100,
      '进气压力': 1,
      '出气压力': 2,
    }
  });
  const [compressorSystem, setCompressorSystem] = useState<ControlSystem>({
    name: '空压机节能控制系统',
    icon: <Gauge className="text-green-500" size={24} />,
    parameters: {
      '压缩机型号': 'XYZ-1000',
      '额定功率': 75,
      '启动方式': '变频',
      '运行压力': 7,
      '空气流量': 10,
      '进气温度': 25,
      '出气温度': 80,
      '功率消耗': 60,
      '运行时间': 1000,
      '效能比': 0.85,
    }
  });
  const [bpModel, setBpModel] = useState<MLModel>({
    name: 'BP神经网络模型',
    icon: <Brain className="text-purple-500" size={24} />,
    parameters: {
      '隐藏层数量': 2,
      '每层神经元数': 64,
      '学习率': 0.001,
      '激活函数': 'ReLU',
      '优化器': 'Adam',
      '批量大小': 32,
      '训练轮数': 100,
    }
  });
  const [lstmModel, setLstmModel] = useState<MLModel>({
    name: 'LSTM模型',
    icon: <BarChart className="text-orange-500" size={24} />,
    parameters: {
      '时间步长': 10,
      'LSTM单元数': 128,
      '隐藏层数量': 2,
      '丢弃率': 0.2,
      '学习率': 0.001,
      '优化器': 'RMSprop',
      '批量大小': 64,
      '训练轮数': 50,
    }
  });

  const handleParameterChange = (
    system: 'oxygen' | 'compressor' | 'bp' | 'lstm',
    parameter: string,
    value: string
  ) => {
    const updateFunction = {
      oxygen: setOxygenSystem,
      compressor: setCompressorSystem,
      bp: setBpModel,
      lstm: setLstmModel,
    }[system];

    updateFunction((prev: any) => ({
      ...prev,
      parameters: { ...prev.parameters, [parameter]: isNaN(Number(value)) ? value : Number(value) }
    }));
  };

  const handleSave = async (system: 'oxygen' | 'compressor', model: 'bp' | 'lstm') => {
    const systemData = system === 'oxygen' ? oxygenSystem : compressorSystem;
    const modelData = model === 'bp' ? bpModel : lstmModel;
    const data = {
      system: systemData,
      model: modelData,
    };
    try {
      const response = await fetch(`/api/${system}-control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert('配置保存成功');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      alert('保存失败: ' + error);
    }
  };

  const renderParameterInputs = (params: { [key: string]: number | string }, type: 'oxygen' | 'compressor' | 'bp' | 'lstm') => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(params).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            {key}
          </label>
          <input
            type={typeof value === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleParameterChange(type, key, e.target.value)}
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}
    </div>
  );

  const renderSystemConfig = (system: ControlSystem, type: 'oxygen' | 'compressor') => (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
      <div className="flex items-center mb-6">
        {system.icon}
        <h3 className="text-2xl font-bold ml-3 text-gray-800">{system.name}</h3>
      </div>
      {renderParameterInputs(system.parameters, type)}
    </div>
  );

  const renderModelConfig = (model: MLModel, type: 'bp' | 'lstm') => (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
      <div className="flex items-center mb-6">
        {model.icon}
        <h3 className="text-2xl font-bold ml-3 text-gray-800">{model.name}</h3>
      </div>
      {renderParameterInputs(model.parameters, type)}
    </div>
  );

  return (
    <div className="space-y-8 p-8 bg-gray-100 rounded-xl">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveSystem('oxygen')}
          className={`px-6 py-3 rounded-md transition duration-300 ${
            activeSystem === 'oxygen'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          双馈氧调控系统
        </button>
        <button
          onClick={() => setActiveSystem('compressor')}
          className={`px-6 py-3 rounded-md transition duration-300 ${
            activeSystem === 'compressor'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          空压机节能控制系统
        </button>
      </div>
      {activeSystem === 'oxygen' ? renderSystemConfig(oxygenSystem, 'oxygen') : renderSystemConfig(compressorSystem, 'compressor')}
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveModel('bp')}
          className={`px-6 py-3 rounded-md transition duration-300 ${
            activeModel === 'bp'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          BP神经网络模型
        </button>
        <button
          onClick={() => setActiveModel('lstm')}
          className={`px-6 py-3 rounded-md transition duration-300 ${
            activeModel === 'lstm'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          LSTM模型
        </button>
      </div>
      {activeModel === 'bp' ? renderModelConfig(bpModel, 'bp') : renderModelConfig(lstmModel, 'lstm')}
      
      <button
        onClick={() => handleSave(activeSystem, activeModel)}
        className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300 flex items-center justify-center shadow-md"
      >
        <Save size={18} className="mr-2" />
        保存配置
      </button>
    </div>
  );
};

export default AlgorithmConfig;