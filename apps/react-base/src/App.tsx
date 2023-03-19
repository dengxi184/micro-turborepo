import { useState } from 'react';
import '@arco-design/web-react/dist/css/arco.css';

import './App.less';
import './globals';
import Login from './pages/Login';
import ChildApp from './pages/ChildApp';
import { getStorage } from './storage';

function App() {
  const [token, setToken] = useState<string | null>(
    getStorage('token') || getStorage('user-state'),
  );
  return (
    <div className="App">
      {token ? <ChildApp /> : <Login setToken={setToken} />}
    </div>
  );
}

export default App;
