import React, { createContext, useState } from "react";

const VALID_USER = {
  name: "강우현",
  studentId: "202404178",
};

const UserContext = createContext({
  user: null,
  login: () => false,
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = 로그아웃 상태

  // 이름과 학번이 모두 맞으면 로그인 성공(true), 아니면 실패(false)
  const login = (name, studentId) => {
    if (name.trim() === VALID_USER.name && studentId.trim() === VALID_USER.studentId) {
      setUser({ name: VALID_USER.name, studentId: VALID_USER.studentId });
      return true;
    }
    return false;
  };

  // user를 null로 되돌리면 처음 화면으로 돌아감
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;