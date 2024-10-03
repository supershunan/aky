import { useCallback, useMemo, useState } from "react";
import "./index.less";
import { Button, Flex, Select } from "antd";
import TimedCharging from "./components/timedCharging/TimedCharging";
import MQTT from './components/MQTT/MQTT'

export default function CentralAdministration() {
    const [policyStatus, setPolicyStatus] = useState(0);
    const [singleNames] = useState([
        {
            key: "policyMode",
            name: "策略模式",
        },
        {
            key: "siteSettings",
            name: "站点设置",
        },
        {
            key: "MQTT",
            name: "MQTT服务器设置",
        },
    ]);
    const [singleMode, setSingleMode] = useState([true, false, false]);
    const [testData, setData] = useState([
        {
            key: 123,
            time: ["2024-10-3", "2024-10-4"],
            power: 12,
            status: "1",
        },
        {
            key: 342,
            time: ["2024-10-3", "2024-10-4"],
            power: 1,
            status: "0",
        },
    ]);
    const [currentPolicyType, setCurrentPolicyType] = useState(
        "peakShavingAndValleyFilling"
    );

    const handleChange = (value: string) => {
        setCurrentPolicyType(value);
    };

    const updateSingleMode = useCallback((index: number) => {
        const newStatus = new Array(singleMode.length).fill(false);
        newStatus[index] = true;
        setSingleMode(newStatus);
    }, [singleMode]);

    const singleBtnEl = useMemo(() =>{
        return singleNames.map((item, index) => {
            return (
                <Button
                    key={item.key}
                    color="primary"
                    variant={singleMode[index] ? "solid" : "filled"}
                    onClick={() => updateSingleMode(index)}
                >
                    {item.name}
                </Button>
            );
        })
    }, [singleNames, singleMode, updateSingleMode]);

    return (
        <div className="central-administration">
            <div className="central-top">
                <div>策略状态：</div>
                <div
                    style={{
                        backgroundColor: policyStatus === 1 ? "#056105de" : "#ff00004f",
                    }}
                    className="central-status-content"
                >
                    <div
                        className="central-status"
                        style={{
                            backgroundColor: policyStatus === 1 ? "#00ff00de" : "#FF0000",
                        }}
                    ></div>
                    <div className="central-name">
                        {policyStatus ? "策略已启动" : "策略已停止"}
                    </div>
                </div>
            </div>
            <Flex gap="small" wrap style={{ marginBottom: 10 }}>
                {singleBtnEl}
            </Flex>
            {singleMode.findIndex((item) => item) ===
                singleNames.findIndex((item) => item.key === "policyMode") && (
                    <Select
                        defaultValue={currentPolicyType}
                        style={{ width: 160 }}
                        onChange={handleChange}
                        options={[
                            { value: "peakShavingAndValleyFilling", label: "削峰填谷" },
                            { value: "peakToValleyArbitrage", label: "峰谷套利" },
                            { value: "spontaneousSelfConsumption", label: "自发自用" },
                            { value: "timedCharging", label: "定时充电" },
                            { value: "flowControl", label: "流量控制" },
                        ]}
                    />
                )}
            {currentPolicyType === "timedCharging" &&
                singleMode.findIndex((item) => item) ===
                singleNames.findIndex((item) => item.key === "policyMode") && (
                    <TimedCharging timeSettingAry={testData} />
                )}
            {
                singleMode.findIndex((item) => item) ===
                singleNames.findIndex((item) => item.key === "MQTT") &&
                <MQTT />
            }
        </div>
    );
}
