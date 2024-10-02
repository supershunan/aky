import { Navigate } from 'react-router-dom';
import { BaseRouter } from './type/index'
import { lazyLoad } from './util/lazyLoad';
import Home from '@src/layout/index';
import {
    HomeOutlined,
    SettingOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

export const routes: BaseRouter[] = [
	{
		path: '/login',
		element: lazyLoad(() => import('@src/views/login/Login')),
	},
	{
		path: '/',
		element: <Navigate to='/home' replace />
	},
	{
		path: '/home',
		name: 'home',
		element: <Home />,
		meta: {
			title: '首页',
			isShow: true,
			icon: HomeOutlined
		},
		onlyFirstMenu: true,
		children: [
			{
				path: '',
				meta: {
					title: '首页',
					isShow: false,
				},
				element: lazyLoad(() => import('@src/views/home/index')),
			}
		]
	},
	{
		path: '/exhibition-center',
		element: <Home />,
		name: 'exhibition-center',
		meta: {
			title: '展示中心',
			isShow: true,
			icon: UnorderedListOutlined
		},
		children: [
			{
				path: '/exhibition-center/singleSite-summary',
				name: 'singleSite-summary',
				meta: {
					title: '单站概括',
					isShow: true,
				},
				element: lazyLoad(() => import('@src/views/exhibitionCenter/singleSiteSummary/index')),
			}
		]
	},
	{
		path: '/central-administration',
		name: 'central-administration',
		element: <Home />,
		meta: {
			title: '管理中心',
			isShow: true,
			icon: SettingOutlined
		},
		onlyFirstMenu: true,
		children: [
			{
				path: '',
				meta: {
					title: '管理中心',
					isShow: false,
				},
				element: lazyLoad(() => import('@src/views/centralAdministration/index')),
			}
		]
	},
	{
		path: '*',
		meta: {
			title: '404',
			isShow: false,
		},
		element: lazyLoad(() => import('@src/views/404')),
	}
]

export default routes;
