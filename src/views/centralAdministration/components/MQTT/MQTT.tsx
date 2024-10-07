import { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Card, Space, Table } from "antd";
import { MQTTClient } from "@src/utils/hooks/useMQTT";
import { MQTTStatusEnum } from "@src/enum/global";

interface MQTTMessage {
    topic?: string;
    message?: string;
    time?: string;
}

export default function MQTTSettings() {
    const [form] = Form.useForm();
    const [isConnected, setIsConnected] = useState(false);
    const mqttClient = useRef<MQTTClient>();
    const [message, setMessage] = useState<string[]>([]);
    const [mqttMsg, setMqttMsg] = useState<MQTTMessage[]>([]);


    useEffect(() => {
        if (mqttClient.current) {
            mqttClient.current.onMessage((message: MQTTMessage[]) => {
                setMqttMsg(() => [...message]);
                setMessage((preMessage) => [...preMessage, message[message.length - 1].message]);
            });
        }

        return () => {
            if (mqttClient.current) {
                mqttClient.current.onMessage(null);
            }
        };
    }, [mqttMsg]);

    useEffect(() => {
        if (mqttClient.current) {
            mqttClient.current.onStatus((message: string) => {
                setMessage((preMessage) => [...preMessage, MQTTStatusEnum[message]]);
            });
        }

        return () => {
            if (mqttClient.current) {
                mqttClient.current.onStatus(null);
            }
        };
    }, [message]);

    const handleConnect = () => {
        form.validateFields().then(() => {
            const { address, port, path, clientId, username, password } =
                form.getFieldsValue();
            const url = address + ':' + port + path;
            const options = {
                clientID: clientId,
                username,
                password
            }

            mqttClient.current = new MQTTClient({url, options});
            mqttClient.current.connect()
            setMessage([])
            setIsConnected(true);
        })
    };

    const handleDisconnect = () => {
        if (!mqttClient.current) return;

        mqttClient.current.disconnect();
        mqttClient.current = undefined;
        setIsConnected(false);
    };

    const handleSubscribe = (values: { topic: string }) => {
        if (!mqttClient.current) return;
        mqttClient.current.subscribe(values.topic)
        const msg = mqttClient.current.getMessages();
        setMqttMsg(msg);
    };

    const handlePublish = (values: { topic: string; message: string }) => {
        if (!mqttClient.current) return;
        mqttClient.current.publish(values.topic, values.message);
        const msg = mqttClient.current.getMessages();
        setMqttMsg(msg);
    };

    const columns = [
        { title: "名称", dataIndex: "topic", key: "topic" },
        { title: "值", dataIndex: "message", key: "message" },
        { title: "时间", dataIndex: "time", key: "time" },
    ];

    return (
        <Card title="MQTT 服务器设置">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    address: "ws://broker.emqx.io",
                    port: "8083",
                    path: "/mqtt",
                    clientId: "clientID_60a4b1e6",
                    username: "test",
                    password: "123",
                }}
            >
                <Form.Item
                    name="address"
                    label="服务器地址"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="port" label="服务器端口" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="path" label="服务器路径" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="clientId"
                    label="客户端 ID"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="username" label="用户名">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码">
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            onClick={handleConnect}
                            disabled={isConnected}
                        >
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
                <Input.TextArea
                    rows={4}
                    readOnly
                    value={message.map((m) => JSON.stringify(m)).join("\n")}
                />
            </Card>

            <Card title="数据表格" size="small" style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={mqttMsg}
                    pagination={false}
                    size="small"
                />
            </Card>
        </Card>
    );
}
