
import './App.css';
import SideBar from './SideBar.jsx';
import ChatWindow from './ChatWindow.jsx';
import ChatProvider from './MyContext.jsx';
import Login from './Login.jsx';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="app">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={
                  <>
                    <SideBar />
                    <ChatWindow />
                  </>
                }
              />
            </Route>

            {/* Redirect unknown routes */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
