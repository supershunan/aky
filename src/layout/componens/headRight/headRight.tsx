import { useCallback, useEffect, useMemo, useState } from "react";
import { BellOutlined, GlobalOutlined, UserOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, PopconfirmProps } from "antd";
import './index.less'
import i18n from "@src/locales/i18n";
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from "@src/enum/global";
import { formatDate } from "@src/utils";
import { useNavigate } from "react-router-dom";

export default function HeadRight() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 防止内存泄漏
        return () => clearInterval(intervalId);
    }, []);

    const confirm: PopconfirmProps["onConfirm"] = (e) => {
        console.log(e);
        message.success(t('已读'));
    };

    const changeLanguage = useCallback((type: LanguageEnum) => {
        i18n.changeLanguage(type)
        window.localStorage.setItem('i18next-language', type)
    }, []);

    const updatePwd = useCallback(() => {
        console.log('修改密码');
    }, []);

    const signOut = useCallback(() => {
        window.localStorage.removeItem('TOKEN_KEY');
        navigate('/login');
        message.warning(t('退出登录成功'));
    }, []);

    const languageButtons = useMemo(() => {
        return (
            <div className="btns" style={{ display: "flex", flexFlow: 'column' }}>
                <Button type="text" color="primary" onClick={() => changeLanguage(LanguageEnum.CN)}>
                    {t('切换到中文')}
                </Button>
                <Button type="text" onClick={() => changeLanguage(LanguageEnum.EN)}>
                    {t('切换到英文')}
                </Button>
            </div>
        )
    }, [t, changeLanguage])

    const personalCenterButtons = useMemo(() => {
        return (
            <div className="btns" style={{ display: "flex", flexFlow: 'column' }}>
                {/* <Button type="text" color="primary" onClick={updatePwd}>
                    {t('密码修改')}
                </Button> */}
                <Button type="text" onClick={signOut}>
                    {t('退出登录')}
                </Button>
            </div>
        )
    }, [t, signOut])

    return (
        <div className="head-right">
            <div className="time">{formatDate(currentTime)}</div>
            <div className="left-tools">
                缺少图标
            </div>
            <div className="right-tools">
                <Popconfirm
                    title={t('消息通知')}
                    description="测试信息"
                    onConfirm={confirm}
                    icon={''}
                    okText={t('全部已读')}
                    showCancel={false}
                >
                    <div className="icon">
                        <BellOutlined style={{ fontSize: "18px" }} />
                    </div>
                </Popconfirm>
                <Popconfirm
                    title={null}
                    description={languageButtons}
                    onConfirm={confirm}
                    icon={null}
                    showCancel={false}
                    okButtonProps={{
                        style: { display: 'none' }
                    }}
                >
                    <div className="icon" style={{ margin: '0 15px' }}>
                        <GlobalOutlined style={{ fontSize: "18px" }} />
                    </div>
                </Popconfirm>
                <Popconfirm
                    title={null}
                    description={personalCenterButtons}
                    onConfirm={confirm}
                    icon={null}
                    showCancel={false}
                    okButtonProps={{
                        style: { display: 'none' }
                    }}
                >
                    <div className="icon">
                        <UserOutlined style={{ fontSize: "18px" }} />
                    </div>
                </Popconfirm>
            </div>
        </div>
    );
}
