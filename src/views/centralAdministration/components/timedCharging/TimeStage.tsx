import {
    DatePicker,
    Row,
    Col,
    InputNumber,
    Radio,
    Button,
    Flex,
    Form,
} from "antd";
import dayjs from "dayjs";


const { RangePicker } = DatePicker;

type timeSetting = {
    key: number;
    time: string[];
    power: number;
    status: string; // 0:放电 1:充电
};

interface TimeStageProps {
    data: timeSetting;
    deleteTimeSetting: (key: number) => void;
    saveTimeSetting: (key: number, values: timeSetting) => void;
}

export default function TimeStage(props: TimeStageProps) {
    const { data, deleteTimeSetting, saveTimeSetting } = props;
    const [form] = Form.useForm();
    const rangeConfig = {
        rules: [
            {
                type: "array" as const,
                required: true,
                message: "Please select time!",
            },
        ],
    };

    const saveForm = () => {
        form.validateFields().then(() => {
            const fieldsValue = form.getFieldsValue();
            const rangeTimeValue = form.getFieldValue("time");
            const values = {
                ...fieldsValue,
                time: [
                    rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
                    rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
                ],
            };
            saveTimeSetting(data.key, { ...values, key: data.key });
        });
    };

    return (
        <div className="time-setting" style={{ marginBottom: 20 }}>
            <Form
                form={form}
                initialValues={{
                    power: data.power,
                    time: data.time.length ? [dayjs(data.time[0]), dayjs(data.time[1])] : [],
                    status: data.status,
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={10}>
                        <Form.Item name="time" label="时间选择" {...rangeConfig}>
                            <RangePicker
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(value, dateString) => {
                                    console.log("Selected Time: ", value);
                                    console.log("Formatted Selected Time: ", dateString);
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="power" label="功率(kW)">
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="status">
                            <Radio.Group>
                                <Radio value="1">充电</Radio>
                                <Radio value="0">放电</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Flex gap="small" wrap>
                            <Button type="primary" onClick={saveForm}>
                                保存
                            </Button>
                            <Button
                                type="primary"
                                danger
                                onClick={() => deleteTimeSetting(data.key)}
                            >
                                删除
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
