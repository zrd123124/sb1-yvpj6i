import React, { useState, useEffect } from 'react';
import { Plus, Fan, Gauge, Thermometer, Check, X, Settings, Edit, Trash2, Save } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  type: 'blower' | 'compressor' | 'sensor';
  communicationType: 'RS485' | 'Ethernet';
  parameters: RS485Parameters | EthernetParameters;
  connectionStatus?: 'connected' | 'disconnected';
}

interface RS485Parameters {
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: 'none' | 'odd' | 'even';
  slaveAddress: number;
}

interface EthernetParameters {
  ipAddress: string;
  port: number;
}

interface ControlSystem {
  id: number;
  name: string;
  devices: Device[];
}

const DeviceManagement: React.FC = () => {
  const [controlSystems, setControlSystems] = useState<ControlSystem[]>([
    {
      id: 1,
      name: '双馈氧调控系统',
      devices: [
        {
          id: 1,
          name: '氧气浓度传感器',
          type: 'sensor',
          communicationType: 'RS485',
          parameters: {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
            slaveAddress: 1,
          },
        },
        {
          id: 2,
          name: '流量计',
          type: 'sensor',
          communicationType: 'RS485',
          parameters: {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
            slaveAddress: 2,
          },
        },
        {
          id: 3,
          name: '鼓风机',
          type: 'blower',
          communicationType: 'Ethernet',
          parameters: {
            ipAddress: '192.168.1.100',
            port: 502,
          },
        },
      ],
    },
    {
      id: 2,
      name: '空压机智能调控系统',
      devices: [
        {
          id: 4,
          name: '压力传感器',
          type: 'sensor',
          communicationType: 'RS485',
          parameters: {
            baudRate: 19200,
            dataBits: 8,
            stopBits: 1,
            parity: 'even',
            slaveAddress: 1,
          },
        },
        {
          id: 5,
          name: '温度传感器',
          type: 'sensor',
          communicationType: 'RS485',
          parameters: {
            baudRate: 19200,
            dataBits: 8,
            stopBits: 1,
            parity: 'even',
            slaveAddress: 2,
          },
        },
        {
          id: 6,
          name: '空压机',
          type: 'compressor',
          communicationType: 'Ethernet',
          parameters: {
            ipAddress: '192.168.1.200',
            port: 502,
          },
        },
      ],
    },
  ]);
  const [selectedSystem, setSelectedSystem] = useState<ControlSystem | null>(null);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editingSystemId, setEditingSystemId] = useState<number | null>(null);
  const [editingSystemName, setEditingSystemName] = useState<string>('');
  const [newDevice, setNewDevice] = useState<Omit<Device, 'id' | 'connectionStatus'>>({
    name: '',
    type: 'blower',
    communicationType: 'RS485',
    parameters: {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      slaveAddress: 1,
    },
  });

  useEffect(() => {
    if (controlSystems.length > 0) {
      handleSelectSystem(controlSystems[0]);
    }
  }, []);

  const handleAddSystem = () => {
    const newSystem: ControlSystem = {
      id: Date.now(),
      name: `新控制系统 ${controlSystems.length + 1}`,
      devices: [],
    };
    setControlSystems([...controlSystems, newSystem]);
  };

  const handleSelectSystem = (system: ControlSystem) => {
    setSelectedSystem(system);
    setIsAddingDevice(false);
    setEditingDevice(null);
    setEditingSystemId(null);
    setEditingSystemName('');
  };

  const handleUpdateSystem = (updatedSystem: ControlSystem) => {
    setControlSystems(controlSystems.map(sys =>
      sys.id === updatedSystem.id ? updatedSystem : sys
    ));
    setSelectedSystem(updatedSystem);
  };

  const handleDeleteSystem = (systemId: number) => {
    setControlSystems(controlSystems.filter(sys => sys.id !== systemId));
    if (selectedSystem && selectedSystem.id === systemId) {
      setSelectedSystem(controlSystems[0] || null);
    }
  };

  const handleEditSystemName = (system: ControlSystem) => {
    setEditingSystemId(system.id);
    setEditingSystemName(system.name);
  };

  const handleSaveSystemName = (system: ControlSystem) => {
    const updatedSystem = { ...system, name: editingSystemName };
    handleUpdateSystem(updatedSystem);
    setEditingSystemId(null);
    setEditingSystemName('');
  };

  const handleAddDevice = () => {
    if (selectedSystem) {
      const newDeviceWithId: Device = {
        ...newDevice,
        id: Date.now(),
      };
      const updatedSystem = {
        ...selectedSystem,
        devices: [...selectedSystem.devices, newDeviceWithId],
      };
      handleUpdateSystem(updatedSystem);
      setIsAddingDevice(false);
      resetNewDevice();
    }
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setIsAddingDevice(true);
    setNewDevice({
      name: device.name,
      type: device.type,
      communicationType: device.communicationType,
      parameters: device.parameters,
    });
  };

  const handleUpdateDevice = () => {
    if (selectedSystem && editingDevice) {
      const updatedDevices = selectedSystem.devices.map(device =>
        device.id === editingDevice.id
          ? { ...newDevice, id: device.id, connectionStatus: device.connectionStatus }
          : device
      );
      const updatedSystem = {
        ...selectedSystem,
        devices: updatedDevices,
      };
      handleUpdateSystem(updatedSystem);
      setIsAddingDevice(false);
      setEditingDevice(null);
      resetNewDevice();
    }
  };

  const handleDeleteDevice = (deviceId: number) => {
    if (selectedSystem) {
      const updatedDevices = selectedSystem.devices.filter(device => device.id !== deviceId);
      const updatedSystem = {
        ...selectedSystem,
        devices: updatedDevices,
      };
      handleUpdateSystem(updatedSystem);
    }
  };

  const resetNewDevice = () => {
    setNewDevice({
      name: '',
      type: 'blower',
      communicationType: 'RS485',
      parameters: {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        slaveAddress: 1,
      },
    });
  };

  const handleTestConnection = (deviceId: number) => {
    if (selectedSystem) {
      const updatedDevices = selectedSystem.devices.map(device =>
        device.id === deviceId
          ? { ...device, connectionStatus: Math.random() > 0.5 ? 'connected' : 'disconnected' }
          : device
      );
      const updatedSystem = {
        ...selectedSystem,
        devices: updatedDevices,
      };
      handleUpdateSystem(updatedSystem);
    }
  };

  const renderDeviceCard = (device: Device) => {
    const icon = device.type === 'blower' ? <Fan size={24} className="text-blue-500" /> :
                 device.type === 'compressor' ? <Gauge size={24} className="text-green-500" /> :
                 <Thermometer size={24} className="text-yellow-500" />;

    return (
      <div key={device.id} className="bg-white p-4 rounded-lg shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <h4 className="font-semibold">{device.name}</h4>
          </div>
          <span className="text-sm text-gray-500">{device.type}</span>
        </div>
        <div className="text-sm text-gray-600">
          <p>通信: {device.communicationType}</p>
          {device.communicationType === 'RS485' ? (
            <>
              <p>波特率: {(device.parameters as RS485Parameters).baudRate}</p>
              <p>从机地址: {(device.parameters as RS485Parameters).slaveAddress}</p>
            </>
          ) : (
            <>
              <p>IP: {(device.parameters as EthernetParameters).ipAddress}</p>
              <p>端口: {(device.parameters as EthernetParameters).port}</p>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="space-x-2">
            <button
              onClick={() => handleEditDevice(device)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition duration-300"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteDevice(device.id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition duration-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <button
            onClick={() => handleTestConnection(device.id)}
            className="bg-indigo-500 text-white px-2 py-1 rounded text-sm hover:bg-indigo-600 transition duration-300"
          >
            测试连接
          </button>
        </div>
        {device.connectionStatus && (
          <div className={`flex items-center ${device.connectionStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
            {device.connectionStatus === 'connected' ? <Check size={16} /> : <X size={16} />}
            <span className="ml-1">{device.connectionStatus === 'connected' ? '已连接' : '未连接'}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">控制系统管理</h3>
          <button
            onClick={handleAddSystem}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            添加控制系统
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {controlSystems.map((system) => (
            <div
              key={system.id}
              className={`p-4 border rounded-lg ${
                selectedSystem?.id === system.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSelectSystem(system)}
                >
                  <Settings size={20} className="mr-2 text-blue-500" />
                  {editingSystemId === system.id ? (
                    <input
                      type="text"
                      value={editingSystemName}
                      onChange={(e) => setEditingSystemName(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span>{system.name}</span>
                  )}
                </div>
                {editingSystemId === system.id ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveSystemName(system);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition duration-300"
                  >
                    <Save size={16} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSystemName(system);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition duration-300"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
              {selectedSystem?.id === system.id && (
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => handleDeleteSystem(system.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition duration-300"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedSystem && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">{selectedSystem.name} - 设备管理</h4>
            <button
              onClick={() => { setIsAddingDevice(true); setEditingDevice(null); resetNewDevice(); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              添加设备
            </button>
          </div>

          {isAddingDevice && (
            <form onSubmit={(e) => { e.preventDefault(); editingDevice ? handleUpdateDevice() : handleAddDevice(); }} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold mb-4">{editingDevice ? '编辑设备' : '添加新设备'}</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="设备名称"
                  className="w-full p-2 border rounded"
                  required
                />
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value as 'blower' | 'compressor' | 'sensor' })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="blower">鼓风机</option>
                  <option value="compressor">空压机</option>
                  <option value="sensor">传感器</option>
                </select>
                <select
                  value={newDevice.communicationType}
                  onChange={(e) => {
                    const communicationType = e.target.value as 'RS485' | 'Ethernet';
                    setNewDevice({
                      ...newDevice,
                      communicationType,
                      parameters: communicationType === 'RS485'
                        ? { baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none', slaveAddress: 1 }
                        : { ipAddress: '', port: 502 }
                    });
                  }}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="RS485">RS485</option>
                  <option value="Ethernet">以太网</option>
                </select>
                {newDevice.communicationType === 'RS485' ? (
                  <>
                    <input
                      type="number"
                      value={(newDevice.parameters as RS485Parameters).baudRate}
                      onChange={(e) => setNewDevice({
                        ...newDevice,
                        parameters: { ...(newDevice.parameters as RS485Parameters), baudRate: parseInt(e.target.value) }
                      })}
                      placeholder="波特率"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      value={(newDevice.parameters as RS485Parameters).slaveAddress}
                      onChange={(e) => setNewDevice({
                        ...newDevice,
                        parameters: { ...(newDevice.parameters as RS485Parameters), slaveAddress: parseInt(e.target.value) }
                      })}
                      placeholder="从机地址"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={(newDevice.parameters as EthernetParameters).ipAddress}
                      onChange={(e) => setNewDevice({
                        ...newDevice,
                        parameters: { ...(newDevice.parameters as EthernetParameters), ipAddress: e.target.value }
                      })}
                      placeholder="IP 地址"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      value={(newDevice.parameters as EthernetParameters).port}
                      onChange={(e) => setNewDevice({
                        ...newDevice,
                        parameters: { ...(newDevice.parameters as EthernetParameters), port: parseInt(e.target.value) }
                      })}
                      placeholder="端口"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => { setIsAddingDevice(false); setEditingDevice(null); resetNewDevice(); }}
                    className="px-4 py-2 border rounded hover:bg-gray-100 transition duration-300"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
                  >
                    {editingDevice ? '更新': '添加'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedSystem.devices.map(renderDeviceCard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;