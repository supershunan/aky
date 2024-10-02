import { BrowserRouter } from 'react-router-dom'
import { routes as InitRoutes } from '@src/router/index'
import RouteGuard from '@src/router/routeGurad/routeGurad'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <RouteGuard routes={InitRoutes}></RouteGuard>
    </BrowserRouter>
  )
}

export default App


