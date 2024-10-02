import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@src/enum/global';
import i18n from '@src/locales/i18n';

const { Title, Text } = Typography;
const currentLanguage = window.localStorage.getItem('i18next-language');

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values: { username: string; password: string }) => {
        setLoading(true);
        // 模拟 API 调用
        setTimeout(() => {
            if (values.username === 'admin' && values.password === '123456') {
                window.localStorage.setItem('TOKEN_KEY', 'your_token_here')
                navigate('/')
                message.success(t('登录成功'));
            } else {
                message.error(t('用户名或密码错误'));
            }
            setLoading(false);
        }, 1000);
    };

    const handleChange = (value: LanguageEnum) => {
        i18n.changeLanguage(value);
        window.localStorage.setItem('i18next-language', value);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 390, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <div
                    className="langue"
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                    }}
                >
                    <Select
                        defaultValue={currentLanguage ? currentLanguage : LanguageEnum.CN}
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: LanguageEnum.CN, label: '中文' },
                            { value: LanguageEnum.EN, label: 'English' },
                            { value: LanguageEnum.JP, label: '日本語' },
                        ]}
                    />
                </div>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>{t('登录')}</Title>
                    <Text type="secondary">{t('请输入您的用户名和密码登录您的账户')}</Text>
                </div>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: t('请输入您的用户名') }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder={t('用户名')}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: t('请输入您的密码') }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder={t('密码')}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            {t('登录')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}