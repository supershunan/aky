import React, { useState } from "react";
import { Layout, Row, Col, Card, Typography, Progress, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const DataItem = ({
    label,
    value,
    unit = "",
}: {
    label: string;
    value: string | number;
    unit?: string;
}) => (
    <div style={{ marginBottom: "8px" }}>
        <Text strong>{label}:</Text>{" "}
        <Text>
            {value} {unit}
        </Text>
    </div>
);

const FaultItem = ({
    label,
    content = "",
}: {
    label: string;
    content?: string;
}) => (
    <div style={{ marginBottom: "8px" }}>
        <Collapse
            size="small"
            bordered={false}
            expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            items={[{ key: "1", label, children: <p>{content}</p> }]}
        />
    </div>
);

export default function BatteryManagementPage() {
    const [title, setTitle] = useState([
        {
            key: 0,
            name: "通讯状态：",
            vlaue: "正常",
        },
        {
            key: 1,
            name: "允许充电：",
            vlaue: "正常",
        },
        {
            key: 2,
            name: "允许放电：",
            vlaue: "正常",
        },
        {
            key: 3,
            name: "欠压电申请充电：",
            vlaue: "正常",
        },
        {
            key: 4,
            name: "EMS_SN：",
            vlaue: "正常",
        },
    ]);
    const [faultInformation, setFaultInformation] = useState([
        {
            key: 0,
            name: "故障信息",
            content: "无",
        },
        {
            key: 1,
            name: "告警信息",
            content: "无",
        },
    ]);

    return (
        <Layout style={{ background: "#001529" }}>
            <Header
                style={{
                    background: "#002140",
                    padding: "0 25px",
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                {title.map((item) => (
                    <Title
                        key={item.key}
                        level={5}
                        style={{ color: "white", margin: "16px 0" }}
                    >
                        {item.name}
                    </Title>
                ))}
            </Header>
            <Content style={{ padding: "24px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={5}>
                        <Card bordered={false} style={{ background: "#15395b" }}>
                            <DataItem label="通讯状态" value="正常" />
                            <DataItem label="电池堆总电压" value="400" unit="V" />
                            <DataItem label="电池堆总电流" value="100" unit="A" />
                            <DataItem label="SOH" value="95" unit="%" />
                            <DataItem label="累计充电量" value="1000" unit="kWh" />
                            <DataItem label="累计放电量" value="950" unit="kWh" />
                            <DataItem label="绝缘电阻" value="500" unit="kΩ" />
                            <DataItem label="环境温度" value="25" unit="°C" />
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card bordered={false} style={{ background: "#15395b" }}>
                            <DataItem label="单体最低电压" value="3.2" unit="V" />
                            <DataItem label="单体最低电压序号" value="12" />
                            <DataItem label="单体最低电压电池号" value="1-12" />
                            <DataItem label="单体最低温度" value="20" unit="°C" />
                            <DataItem label="单体最低温度序号" value="5" />
                            <DataItem label="单体最低温度电池号" value="1-5" />
                            <DataItem label="最低极柱温度" value="22" unit="°C" />
                            <DataItem label="最低极柱温度序号" value="3" />
                            <DataItem label="最低极柱温度电池号" value="1-3" />
                            <DataItem label="最低极柱温度监测点" value="1" />
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card bordered={false} style={{ background: "#15395b" }}>
                            <DataItem label="单体最高电压" value="3.6" unit="V" />
                            <DataItem label="单体最高电压序号" value="24" />
                            <DataItem label="单体最高电压电池号" value="2-24" />
                            <DataItem label="单体最高温度" value="30" unit="°C" />
                            <DataItem label="单体最高温度序号" value="15" />
                            <DataItem label="单体最高温度电池号" value="2-15" />
                            <DataItem label="最高极柱温度" value="28" unit="°C" />
                            <DataItem label="最高极柱温度序号" value="7" />
                            <DataItem label="最高极柱温度电池号" value="2-7" />
                            <DataItem label="最高极柱温度监测点" value="2" />
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card bordered={false} style={{ background: "#15395b" }}>
                            <DataItem label="充许充电" value="是" />
                            <DataItem label="充许放电" value="是" />
                            <DataItem label="欠压申请充电" value="否" />
                            <DataItem label="主继电器状态" value="闭合" />
                            <DataItem label="SOC需要校准状态" value="否" />
                            <DataItem label="DI开关量输入状态" value="正常" />
                            <DataItem label="DO开关量输出状态" value="正常" />
                            <DataItem label="电池堆最大允许功率" value="50" unit="kW" />
                            <DataItem label="BMS最大允许放电功率" value="45" unit="kW" />
                            <DataItem label="BMS最大允许充电功率" value="40" unit="kW" />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card
                            bordered={false}
                            style={{ background: "#15395b", textAlign: "center" }}
                        >
                            <Title level={4} style={{ color: "white" }}>
                                EMS_SN:
                            </Title>
                            <Progress
                                type="circle"
                                percent={75}
                                format={(percent) => `${percent}% SOC`}
                                strokeColor="#52c41a"
                                trailColor="#001529"
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                    <Col span={24}>
                        <Card bordered={false} style={{ background: "#15395b" }}>
                            <Row>
                                {faultInformation.map((item, index) => (
                                    <Col span={4} key={item.key}>
                                        <FaultItem
                                            label={item.name + (index + 1) + "："}
                                            content={item.content}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
