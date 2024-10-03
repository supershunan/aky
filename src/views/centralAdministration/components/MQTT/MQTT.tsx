import { useState } from 'react';
import { Form, Input, Button, Card, Space, Table } from 'antd';

export default function MQTTSettings() {
  const [form] = Form.useForm();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ sn: number; ts: string; a: string; b: string; c: string }[]>([]);

  const handleConnect = () => {
    // Implement MQTT connection logic here
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // Implement MQTT disconnection logic here
    setIsConnected(false);
  };

  const handleSubscribe = (values: { topic: string }) => {
    // Implement MQTT subscription logic here
    console.log('Subscribed to:', values.topic);
  };

  const handlePublish = (values: { topic: string; message: string }) => {
    // Implement MQTT publish logic here
    console.log('Published to:', values.topic, 'Message:', values.message);
  };

  const columns = [
    { title: 'sn', dataIndex: 'sn', key: 'sn' },
    { title: 'ts', dataIndex: 'ts', key: 'ts' },
    { title: 'a', dataIndex: 'a', key: 'a' },
    { title: 'b', dataIndex: 'b', key: 'b' },
    { title: 'c', dataIndex: 'c', key: 'c' },
  ];

  return (
    <Card title="MQTT 服务器设置">
      <Form form={form} layout="vertical" initialValues={{ port: '8083', path: '/mqtt' }}>
        <Form.Item name="address" label="服务器地址" rules={[{ required: true }]}>
          <Input placeholder="ws://broker.emqx.io" />
        </Form.Item>
        <Form.Item name="port" label="服务器端口" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="path" label="服务器路径" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="clientId" label="客户端 ID" rules={[{ required: true }]}>
          <Input placeholder="clientID_60a4b1e6" />
        </Form.Item>
        <Form.Item name="username" label="用户名">
          <Input placeholder="test" />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input.Password placeholder="•••" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleConnect} disabled={isConnected}>
              连接
            </Button>
            <Button onClick={handleDisconnect} disabled={!isConnected}>
              断开
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Card title="MQTT 订阅" size="small" style={{ marginTop: 16 }}>
        <Form onFinish={handleSubscribe}>
          <Space>
            <Form.Item name="topic" rules={[{ required: true }]}>
              <Input placeholder="test" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                订阅
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Card title="MQTT 消息发送" size="small" style={{ marginTop: 16 }}>
        <Form onFinish={handlePublish}>
          <Space>
            <Form.Item name="topic" rules={[{ required: true }]}>
              <Input placeholder="Topic" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="message" rules={[{ required: true }]}>
              <Input placeholder="Message" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                发送
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Card title="消息框" size="small" style={{ marginTop: 16 }}>
        <Input.TextArea rows={4} readOnly value={messages.map(m => JSON.stringify(m)).join('\n')} />
      </Card>

      <Card title="数据表格" size="small" style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={messages} pagination={false} size="small" />
      </Card>
    </Card>
  );
}