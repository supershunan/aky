import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Card, Space, Table } from "antd";
import { useMQTT } from "@src/utils/hooks/useMQTT";

export default function MQTTSettings() {
    const [form] = Form.useForm();
    const [isConnected, setIsConnected] = useState(false);
    // const [tableMessages, setTableMessages] = useState<
    //     { sn: number; ts: string; a: string; b: string; c: string }[]
    // >([]);
    const [initialValues, setInitialValues] = useState({
        address: "mqtt://test.mosquitto.org",
        port: "8083",
        path: "/mqtt",
        clientId: "clientID_60a4b1e6",
        username: "test",
        password: "123456",
    });
    const [topic, setTopic] = useState("test/topic");
    const [message, setMessage] = useState("");
    const [subscriptions, setSubscriptions] = useState<string[]>([]);
    const {
        client,
        connectStatus,
        messages,
        connect: connectMQTT,
        disconnect: disconnectMQTT,
        subscribe,
        unsubscribe,
        publish,
    } = useMQTT({
        url: initialValues.address,
        options: {
            clientId: initialValues.clientId,
            //   username: initialValues.username,
            //   password: initialValues.password,
        },
    });

    useEffect(() => {
        if (connectStatus === "Connected") {
            subscriptions.forEach((topic) => subscribe(topic));
        }
    }, [connectStatus, subscribe, subscriptions]);

    const handleConnect = useCallback(() => {
        if (connectStatus === "Connected") {
            disconnectMQTT();
        } else {
            connectMQTT();
        }
        // form.validateFields().then(() => {
        //     const values = form.getFieldsValue();
        //     mqtt.connect("mqtt://test.mosquitto.org");
        //     console.log(values);
        //     setIsConnected(true);
        // });
    }, [connectStatus, connectMQTT, disconnectMQTT]);

    const handleSubscribe = useCallback(() => {
        if (!subscriptions.includes(topic)) {
            setSubscriptions((prev) => [...prev, topic]);
            if (connectStatus === "Connected") {
                subscribe(topic);
            }
        }
    }, [connectStatus, subscribe, subscriptions, topic]);

    const handleUnsubscribe = useCallback(
        (topicToRemove: string) => {
            setSubscriptions((prev) => prev.filter((t) => t !== topicToRemove));
            if (connectStatus === "Connected") {
                unsubscribe(topicToRemove);
            }
        },
        [connectStatus, unsubscribe]
    );

    const handlePublish = useCallback(() => {
        if (message && topic) {
            publish(topic, message);
            setMessage("");
        }
    }, [message, topic, publish]);

    const handleDisconnect = () => {
        setIsConnected(false);
    };

    // const handleSubscribe = (values: { topic: string }) => {
    //     console.log("Subscribed to:", values.topic);
    // };

    // const handlePublish = (values: { topic: string; message: string }) => {
    //     console.log("Published to:", values.topic, "Message:", values.message);
    // };

    const columns = [
        { title: "sn", dataIndex: "sn", key: "sn" },
        { title: "ts", dataIndex: "ts", key: "ts" },
        { title: "a", dataIndex: "a", key: "a" },
        { title: "b", dataIndex: "b", key: "b" },
        { title: "c", dataIndex: "c", key: "c" },
    ];

    return (
        <Card title="MQTT 服务器设置">
            <Form form={form} layout="vertical" initialValues={initialValues}>
                <Form.Item
                    name="address"
                    label="服务器地址"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="ws://broker.emqx.io" />
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

            {/* <Card title="MQTT 订阅" size="small" style={{ marginTop: 16 }}>
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
                    value={tableMessages.map((m) => JSON.stringify(m)).join("\n")}
                />
            </Card>

            <Card title="数据表格" size="small" style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={tableMessages}
                    pagination={false}
                    size="small"
                />
            </Card> */}
        </Card>
    );
}
