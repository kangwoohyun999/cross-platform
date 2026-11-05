import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, Keyboard,
  KeyboardAvoidingView, Linking, Platform, StyleSheet, useWindowDimensions,
} from "react-native";
import Hangul from "hangul-js";
import UserContext from "./UserContext";

const logo = require("../assets/kangnam.png");

// ------------------------ //
//   데이터 (본인 정보로 수정해서 사용)
// ------------------------ //
const PROJECTS = [
  { id: "1", emoji: "🧠", title: "딥러닝 이미지 분류", desc: "CNN 모델로 이미지를 분류하는 프로젝트입니다." },
  { id: "2", emoji: "📱", title: "포트폴리오 앱", desc: "React Native + React Navigation으로 만든 앱입니다." },
  { id: "3", emoji: "🔐", title: "로그인 화면", desc: "Context API로 로그인 상태를 관리합니다." },
];
const POSTS = [
  { id: "1", emoji: "🧭", title: "React Navigation 정리", desc: "Stack / Tab / Drawer 내비게이션의 차이와 사용법" },
  { id: "2", emoji: "🗂️", title: "Context API 사용하기", desc: "앱 전체에서 로그인 상태를 공유하는 방법" },
  { id: "3", emoji: "📊", title: "딥러닝 입문", desc: "CNN의 기본 구조와 학습 과정" },
];
const CONTACTS = [
  { emoji: "📧", label: "이메일", value: "example@kangnam.ac.kr", url: "mailto:example@kangnam.ac.kr" },
  { emoji: "💻", label: "GitHub", value: "github.com/username", url: "https://github.com/username" },
  { emoji: "🏫", label: "학교", value: "강남대학교 컴퓨터공학부" },
];

// ------------------------ //
//   공통 컴포넌트
// ------------------------ //
// 파란 배경의 "OO로 이동" 버튼
const MoveButton = ({ title, onPress }) => (
  <TouchableOpacity style={s.moveBtn} onPress={onPress}>
    <Text style={s.moveBtnText}>{title}</Text>
  </TouchableOpacity>
);

// 포트폴리오/블로그 공통 목록 화면: 항목 누르면 Detail을 스택에 쌓음(push)
const ListScreen = ({ navigation, items, next, nextTitle }) => (
  <View style={s.listContainer}>
    <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} style={s.card} onPress={() => navigation.navigate("Detail", item)}>
          <Text style={s.cardTitle}>{item.emoji} {item.title}</Text>
          <Text style={s.cardDesc}>{item.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    <View style={s.footer}>
      <MoveButton title={nextTitle} onPress={() => navigation.navigate(next)} />
    </View>
  </View>
);

// ------------------------ //
//   로그인 화면
// ------------------------ //
const joinHangul = (text) => Hangul.assemble(Hangul.disassemble(text));
const showPopup = (title, msg) =>
  Platform.OS === "web" ? window.alert(`${title}\n${msg}`) : Alert.alert(title, msg);

export const LoginScreen = () => {
  const { login } = useContext(UserContext);
  const { height } = useWindowDimensions();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () =>
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100));
    return () => sub.remove();
  }, []);

  const handleLogin = () => {
    if (!login(name, studentId)) showPopup("로그인 실패", "이름 또는 학번이 올바르지 않습니다.");
  };

  const inputProps = { style: s.input, autoCorrect: false, spellCheck: false, importantForAutofill: "no" };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior="padding">
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false} contentContainerStyle={{ height }}>
        <View style={s.loginTop}>
          <Image source={logo} style={{ width: "50%", height: "50%" }} resizeMode="contain" />
        </View>
        <View style={s.loginBottom}>
          <Text style={s.subTitle}>WELCOME BACK</Text>
          <Text style={s.loginTitle}>로그인</Text>
          <Text style={s.label}>이름</Text>
          <TextInput {...inputProps} value={name} onChangeText={(t) => setName(joinHangul(t))}
            placeholder="이름을 입력하세요" autoCapitalize="none" />
          <Text style={s.label}>학번</Text>
          <TextInput {...inputProps} value={studentId} onChangeText={setStudentId}
            placeholder="학번을 입력하세요" keyboardType="numeric" />
          <TouchableOpacity style={s.loginBtn} onPress={handleLogin}>
            <Text style={s.loginBtnText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ------------------------ //
//   탭 화면 4개 + 상세 화면
// ------------------------ //
export const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  return (
    <View style={s.center}>
      <Image source={logo} style={s.logo} resizeMode="contain" />
      <Text style={s.title}>👤 프로필</Text>
      <Text style={s.info}>이름 : {user.name}</Text>
      <Text style={s.info}>학번 : {user.studentId}</Text>
      <Text style={s.tags}>딥러닝 · 리액트 네이티브 · 컴퓨터 공학</Text>
      <MoveButton title="연락처로 이동" onPress={() => navigation.navigate("Contact")} />
    </View>
  );
};

export const PortfolioScreen = ({ navigation }) => (
  <ListScreen navigation={navigation} items={PROJECTS} next="Blog" nextTitle="블로그로 이동" />
);

export const BlogScreen = ({ navigation }) => (
  <ListScreen navigation={navigation} items={POSTS} next="Contact" nextTitle="연락처로 이동" />
);

export const ContactScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  return (
    <View style={[s.center, { paddingHorizontal: 24 }]}>
      <Text style={s.title}>📞 {user.name}의 연락처</Text>
      {CONTACTS.map((c) => (
        <TouchableOpacity key={c.label} style={s.row} disabled={!c.url} onPress={() => Linking.openURL(c.url)}>
          <Text style={s.rowLabel}>{c.emoji} {c.label}</Text>
          <Text style={s.rowValue}>{c.value}</Text>
        </TouchableOpacity>
      ))}
      <MoveButton title="프로필로 이동" onPress={() => navigation.navigate("Profile")} />
    </View>
  );
};

export const DetailScreen = ({ route, navigation }) => {
  const { emoji, title, desc } = route.params ?? {};
  return (
    <View style={[s.center, { backgroundColor: "#F1F5F9", paddingBottom: 0, padding: 24 }]}>
      <Text style={{ fontSize: 60, marginBottom: 12 }}>{emoji}</Text>
      <Text style={s.title}>{title}</Text>
      <Text style={[s.info, { textAlign: "center" }]}>{desc}</Text>
      <MoveButton title="뒤로가기" onPress={() => navigation.goBack()} />
    </View>
  );
};

// ------------------------ //
//   스타일
// ------------------------ //
const s = StyleSheet.create({
  // 공통 (paddingBottom으로 화면 중앙보다 조금 위에 배치)
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", paddingBottom: 80 },
  logo: { width: 150, height: 150, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0F172A", marginBottom: 12 },
  info: { fontSize: 16, color: "#333", marginBottom: 6 },
  tags: { fontSize: 14, color: "#2563EB", marginTop: 8 },
  moveBtn: { backgroundColor: "#2563EB", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8, marginTop: 24 },
  moveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // 목록
  listContainer: { flex: 1, backgroundColor: "#F1F5F9" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginVertical: 8, marginHorizontal: 16 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#0F172A", marginBottom: 4 },
  cardDesc: { fontSize: 14, color: "#555" },
  footer: { alignItems: "center", paddingBottom: 20 },

  // 연락처
  row: { width: "100%", flexDirection: "row", backgroundColor: "#F1F5F9", borderRadius: 10, padding: 14, marginBottom: 10 },
  rowLabel: { width: 90, fontSize: 15, fontWeight: "bold", color: "#0F172A" },
  rowValue: { flex: 1, fontSize: 15, color: "#333" },

  // 로그인
  loginTop: { flex: 1, justifyContent: "center", alignItems: "center" },
  loginBottom: { flex: 1, paddingHorizontal: 30 },
  subTitle: { fontSize: 12, color: "#888", letterSpacing: 2, marginBottom: 4 },
  loginTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  label: { fontSize: 12, marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, padding: 10, fontSize: 16 },
  loginBtn: { backgroundColor: "#3D5A99", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  loginBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
