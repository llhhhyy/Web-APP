import {ConfigProvider, theme} from 'antd';
import AppRouter from './components/router';
import {useState} from "react"; // 假设 AppRouter 在此路径
import { UserContext } from './lib/context';

function App() {
    const themeToken = {
        colorPrimary: "#1DA57A",
        colorInfo: "#1DA57A",
    };
    const [user, setUser] = useState(null); // 全局用户状态

    return (
        <UserContext.Provider value={{user, setUser}}>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: themeToken,
                }}
            >
                <AppRouter/>
            </ConfigProvider>
        </UserContext.Provider>
    );
}

export default App;