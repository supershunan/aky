import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Menu, MenuProps } from "antd";
import { BaseRouter } from '@src/router/type/index'
import { routes } from '@src/router/index';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

const App: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const hasToken = window.localStorage.getItem('TOKEN_KEY');
    const [selectedKey] = useState<Array<string>>(['/exhibition-center/singleSite-summary']);
    const [openKey, setOpenKey] = useState<Array<string>>(['/exhibition-center', '/exhibition-center/singleSite-summary']);

    const items = routes.map((item: BaseRouter) => {
        if (item.meta?.isShow) {
            return {
                key: item.path,
                icon: React.createElement(item.meta.icon),
                label: t(item.meta.title),
                children: !item.onlyFirstMenu && item.children?.map((cItem: BaseRouter) => {
                    if (cItem.meta?.isShow) {
                        return {
                            key: cItem.path,
                            label: t(cItem.meta?.title as string),
                        }
                    }
                }).filter(Boolean)
            }
        }
    }).filter(Boolean) as MenuItem[];
    const levelKeys = getLevelKeys(items as LevelKeysProps[]);

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => openKey.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setOpenKey(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setOpenKey(openKeys);
        }
    };

    const handleSelect = (e) => {
        if (!hasToken) {
            navigate('/login')
            return
        }
        if (e.keyPath.length === 1) {
            onOpenChange([e.key])
        }
        navigate(e.key)
    }

    return (
        <Menu
            theme="light"
            mode="inline"
            items={items}
            openKeys={openKey}
            defaultOpenKeys={openKey}
            defaultSelectedKeys={selectedKey}
            onSelect={handleSelect}
            onOpenChange={onOpenChange}
        />
    );
};

export default App;