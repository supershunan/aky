import React, { useState } from "react";
import {
    Card,
    Button,
} from "antd";
import TimeStage from './TimeStage'

type timeSetting = {
    key: number;
    time: string[];
    power: number;
    status: string; // 0:放电 1:充电
};

interface TimedChargingProps {
    timeSettingAry: timeSetting[];
}

export default function TimedCharging(props: TimedChargingProps) {
    const { timeSettingAry } = props;
    const [newTimeSettingAry, setNewTimeSettingAry] = useState(timeSettingAry);

    const addTimeSetting = () => {
        setNewTimeSettingAry([
            ...newTimeSettingAry,
            { time: [], power: 0, status: '0', key: Math.random() },
        ]);
    };

    const deleteTimeSetting = (key: number) => {
        setNewTimeSettingAry(newTimeSettingAry.filter((item) => item.key !== key));
    };

    const saveTimeSetting = (key: number, values: timeSetting) => {
        console.log("saveTimeSetting: ", key, values);
    };

    return (
        <Card title="时间段设置" style={{ marginTop: 20 }}>
            {newTimeSettingAry.map((item: timeSetting) => (
                <TimeStage
                    key={item.key}
                    data={item}
                    deleteTimeSetting={deleteTimeSetting}
                    saveTimeSetting={saveTimeSetting}
                />
            ))}
            <Button type="primary" style={{ marginTop: 20 }} onClick={addTimeSetting}>
                添加时间段
            </Button>
        </Card>
    );
}
