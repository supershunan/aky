import React, { useMemo, useState } from "react";
import { TreeSelect } from "antd";
import "./index.less";
import { DeviceStatusEnum } from "./index.type";
import PCS from "./components/EMD1/PCS";

const treeData = [
    {
        title: "Node1",
        value: "0-0",
        disabled: true,
        children: [
            {
                title: "Child Node1",
                value: "0-0-1",
            },
            {
                title: "Child Node2",
                value: "0-0-2",
            },
        ],
    },
    {
        title: "Node2",
        value: "0-1",
    },
];

export default function SingleSiteSummary() {
    const [value, setValue] = useState<string>("0-0-1");
    const [deviceStatus, setDeviceStatus] = useState([
        {
            key: "communicationStatus",
            name: "通讯状态",
            status: DeviceStatusEnum.normal,
        },
        {
            key: "PCS",
            name: "PCS",
            status: DeviceStatusEnum.abnormal,
        },
        {
            key: "BMS",
            name: "BMS",
            status: DeviceStatusEnum.normal,
        },
    ]);

    const onChange = (newValue: string) => {
        console.log(newValue);
        setValue(newValue);
    };

    const deviceStatusEl = useMemo(() => {
        return deviceStatus.map((item) => {
            return (
                <div className="device-status-item" key={item.key}>
                    <div className="device-status-item-name">{item.name}</div>
                    <div
                        className="device-status-item-value"
                        style={{
                            background:
                                item.status === DeviceStatusEnum.normal ? "#00FF00" : "#FF0000",
                        }}
                    ></div>
                </div>
            );
        });
    }, [deviceStatus]);

    return (
        <div className="single-site-summary">
            <div className="single-site-top">
                <div className="site-left">
                    <TreeSelect
                        style={{ width: "200px" }}
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        treeData={treeData}
                        placeholder="Please select"
                        treeDefaultExpandAll
                        onChange={onChange}
                    />
                </div>
                <div className="site-right">{deviceStatusEl}</div>
            </div>
            <div className="single-site-content">
                <PCS />
            </div>
        </div>
    );
}
