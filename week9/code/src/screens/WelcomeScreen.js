import React, { useContext } from "react";
import styled from "styled-components/native";
import UserContext from "../contexts/UserContext";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Welcome = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Info = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #e53935;
  padding: 10px 25px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const WelcomeScreen = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <Container>
      <Welcome>환영합니다 👋</Welcome>
      <Info>
        {user.name} ({user.studentId})
      </Info>
      <LogoutButton onPress={logout}>
        <ButtonText>로그아웃</ButtonText>
      </LogoutButton>
    </Container>
  );
};

export default WelcomeScreen;