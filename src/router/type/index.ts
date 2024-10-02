import React, { LazyExoticComponent } from 'react';

interface metaConfig {
    // title
    title: string;
    // Whether to ignore permissions
    ignoreAuth?: boolean;
    // role info
    roles?: any;
    // Whether not to cache
    ignoreKeepAlive?: boolean;
    // Is it fixed on tab
    affix?: boolean;
    // icon on tab
    icon?:  any;

    frameSrc?: string;

    // current page transition
    transitionName?: string;

    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean;

    // Carrying parameters
    carryParam?: boolean;

    // Used internally to mark single-level menus
    single?: boolean;

    // Currently active menu
    currentActiveMenu?: string;

    // Never show in tab
    hideTab?: boolean;

    // Never show in menu
    hideMenu?: boolean;
    isShow?: boolean;
}
export interface BaseRouter {
    asyncRoutes?: object;
    path: string;
    element?: React.ReactNode | LazyExoticComponent<any>;
    component?: React.ReactNode | LazyExoticComponent<any> | any;
    meta?: metaConfig;
    children?: BaseRouter[];
    hidden?: boolean;
    redirect?: any;
    name?: string;
    redirectTo?: string;
    /** 是否只有一级菜单 */
    onlyFirstMenu?: boolean;
}