import { useEffect } from 'react';
import { useRoutes, RouteObject, useNavigate } from 'react-router-dom';

export default function RouteGuard({ routes }: { routes: RouteObject[] }) {
    const hasToken = window.localStorage.getItem('TOKEN_KEY');
    const navigate = useNavigate();
    const RouteElement = useRoutes(routes);

    useEffect(() => {
        const processLogin = () => {
            if (!hasToken) {
                if (window.location.pathname !== '/login') {
                    navigate('/login');
                }
            } else {
                if (window.location.pathname === '/login') {
                    navigate('/');
                }
            }
        };

        processLogin();
    }, [hasToken, navigate]);

    return RouteElement;
}
