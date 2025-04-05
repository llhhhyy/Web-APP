import { ConfigProvider, theme } from 'antd';
// import AppRouter from './components/router';
import LoginPage from "./page/login";

function App() {
  const themeToken = {
    colorPrimary: "#1DA57A",
    colorInfo: "#1DA57A"
  }
  return <ConfigProvider theme={{
    algorithm: theme.defaultAlgorithm,
    token: themeToken
  }} >
    <LoginPage />
  </ConfigProvider>
}

export default App;