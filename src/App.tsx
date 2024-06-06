import { Route, Routes } from 'react-router-dom';

import './App.css'
import Main from './components/main/Main';
import routes from './routes';

function App() {
  return (
    <>
      <Main />
      <main className="main-container">
        <Routes>
          {routes.map((route, index) => (
            <Route path={route.path} element={route.element} key={index}/>
          ))}
        </Routes>
      </main>
    </>
  )
}

export default App
