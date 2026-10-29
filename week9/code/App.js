import React, { useContext } from "react";
import { UserProvider } from "./src/contexts/UserContext";
import UserContext from "./src/contexts/UserContext";
import LoginScreen from "./src/screens/LoginScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";

// Provider 안쪽에서 user 값에 따라 화면을 바꿔 주는 컴포넌트
const Main = () => {
  const { user } = useContext(UserContext);
  // user가 있으면 환영 화면, 없으면 로그인 화면
  return user ? <WelcomeScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    // 앱 전체를 Provider로 감싸서 어디서든 user/login/logout 사용 가능
    <UserProvider>
      <Main />
    </UserProvider>
  );
}