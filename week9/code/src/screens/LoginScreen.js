import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import Hangul from "hangul-js";
import UserContext from "../contexts/UserContext";

// 위 절반: 이미지
const TopHalf = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 50%;
  height: 50%;
`;

// 아래 절반: 로그인 폼 (위쪽부터 배치)
const BottomHalf = styled.View`
  flex: 1;
  padding: 0 30px;
  justify-content: flex-start;
`;

const SubTitle = styled.Text`
  font-size: 12px;
  color: #888888;
  letter-spacing: 2px;
  margin-bottom: 4px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 4px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #aaaaaa;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: #3d5a99;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const joinHangul = (text) => Hangul.assemble(Hangul.disassemble(text));

// 팝업 알림: 폰/에뮬레이터는 Alert, 웹(컴퓨터 브라우저)은 window.alert
const showPopup = (title, message) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const LoginScreen = () => {
  const { login } = useContext(UserContext);
  const { height } = useWindowDimensions();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => sub.remove();
  }, []);

  const handleLogin = () => {
    const success = login(name, studentId);
    if (!success) {
      showPopup("로그인 실패", "이름 또는 학번이 올바르지 않습니다.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior="padding"
    >
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height }}
      >
        <TopHalf>
          <Logo
            source={require("../../assets/kangnam.png")}
            resizeMode="contain"
          />
        </TopHalf>

        <BottomHalf>
          <SubTitle>WELCOME BACK</SubTitle>
          <Title>로그인</Title>

          <Label>이름</Label>
          <Input
            value={name}
            onChangeText={(text) => setName(joinHangul(text))}
            placeholder="이름을 입력하세요"
            autoCorrect={false}
            spellCheck={false}
            autoCapitalize="none"
            importantForAutofill="no"
          />

          <Label>학번</Label>
          <Input
            value={studentId}
            onChangeText={setStudentId}
            placeholder="학번을 입력하세요"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
            importantForAutofill="no"
          />

          <LoginButton onPress={handleLogin}>
            <ButtonText>로그인</ButtonText>
          </LoginButton>
        </BottomHalf>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;