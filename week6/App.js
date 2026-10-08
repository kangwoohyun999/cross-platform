import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Animated,
  Easing,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

/* =========================================================
   한글 조합 함수
   키보드가 'ㅎ ㅗ ㅇ' 처럼 자음/모음을 따로 보내줘도
   '홍' 으로 합쳐 주는 역할 (PC 키보드, 에뮬레이터 등 대응)
   ========================================================= */
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JONG_OK = 'ㄱㄲㄴㄷㄹㅁㅂㅅㅆㅇㅈㅊㅋㅌㅍㅎ'; // 받침이 될 수 있는 자음

// 겹모음 / 겹받침
const COMP_V = { ㅗㅏ: 'ㅘ', ㅗㅐ: 'ㅙ', ㅗㅣ: 'ㅚ', ㅜㅓ: 'ㅝ', ㅜㅔ: 'ㅞ', ㅜㅣ: 'ㅟ', ㅡㅣ: 'ㅢ' };
const COMP_F = { ㄱㅅ: 'ㄳ', ㄴㅈ: 'ㄵ', ㄴㅎ: 'ㄶ', ㄹㄱ: 'ㄺ', ㄹㅁ: 'ㄻ', ㄹㅂ: 'ㄼ', ㄹㅅ: 'ㄽ', ㄹㅌ: 'ㄾ', ㄹㅍ: 'ㄿ', ㄹㅎ: 'ㅀ', ㅂㅅ: 'ㅄ' };

const SPLIT = {};
Object.entries(COMP_V).forEach(([k, v]) => { SPLIT[v] = [k[0], k[1]]; });
Object.entries(COMP_F).forEach(([k, v]) => { SPLIT[v] = [k[0], k[1]]; });

const isCons = (c) => CHO.includes(c);
const isVowel = (c) => JUNG.includes(c) && !SPLIT[c];

function composeHangul(str) {
  // 1) 전부 낱개 자모로 풀기
  const jamo = [];
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const i = code - 0xac00;
      const cho = Math.floor(i / 588);
      const jung = Math.floor((i % 588) / 28);
      const jong = i % 28;
      jamo.push(CHO[cho]);
      jamo.push(...(SPLIT[JUNG[jung]] || [JUNG[jung]]));
      if (jong > 0) jamo.push(...(SPLIT[JONG[jong]] || [JONG[jong]]));
    } else if (SPLIT[ch]) {
      jamo.push(...SPLIT[ch]);
    } else {
      jamo.push(ch);
    }
  }

  // 2) 다시 글자로 합치기
  let out = '';
  let cho = null;
  let jung = null;
  let jong = [];

  const flush = () => {
    if (cho !== null && jung !== null) {
      const jongStr = jong.length === 2 ? COMP_F[jong.join('')] : jong[0] || '';
      const code =
        0xac00 + (CHO.indexOf(cho) * 21 + JUNG.indexOf(jung)) * 28 + JONG.indexOf(jongStr);
      out += String.fromCharCode(code);
    } else if (cho !== null) {
      out += cho;
    } else if (jung !== null) {
      out += jung;
    }
    cho = null;
    jung = null;
    jong = [];
  };

  for (const c of jamo) {
    if (isVowel(c)) {
      if (jung !== null && jong.length === 0) {
        const comp = COMP_V[jung + c];
        if (comp) {
          jung = comp;
        } else {
          flush();
          jung = c;
        }
      } else if (jong.length > 0) {
        const last = jong.pop(); // 받침이 다음 글자의 초성으로 이동 (한+ㅏ → 하나)
        flush();
        cho = last;
        jung = c;
      } else {
        jung = c;
      }
    } else if (isCons(c)) {
      if (cho !== null && jung !== null) {
        if (jong.length === 0) {
          if (JONG_OK.includes(c)) jong = [c];
          else { flush(); cho = c; }
        } else if (jong.length === 1 && COMP_F[jong[0] + c]) {
          jong = [jong[0], c];
        } else {
          flush();
          cho = c;
        }
      } else {
        flush();
        cho = c;
      }
    } else {
      flush();
      out += c;
    }
  }
  flush();
  return out;
}

/* =========================================================
   타이밍 설정 (ms) - 숫자만 바꾸면 속도 조절 가능
   ========================================================= */
const FORM_FADE_OUT = 1200; // 입력 화면이 사라지는 시간
const RESULT_FADE_IN = 2000; // 결과 박스가 서서히 진해지는 시간
const RESULT_HOLD = 5000; // 결과 박스가 화면에 머무는 시간 (5초)
const RESULT_FADE_OUT = 1500; // 결과 박스가 사라지는 시간
const FORM_FADE_IN = 1500; // 입력 화면이 다시 돌아오는 시간 (결과 박스가 사라질 때 겹침)

export default function App() {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resultText, setResultText] = useState(''); // 결과 박스에 보여줄 글자 (입력칸을 비워도 유지)

  const nameRef = useRef(null);

  const formAnim = useRef(new Animated.Value(1)).current; // 입력 화면 투명도
  const formScale = useRef(new Animated.Value(1)).current; // 입력 화면 크기
  const resultAnim = useRef(new Animated.Value(0)).current; // 결과 박스 투명도

  const handleConfirm = () => {
    if (submitted) return; // 애니메이션 중 중복 클릭 방지

    if (!studentId.trim() || !name.trim()) {
      Alert.alert('알림', '학번과 이름을 모두 입력해주세요.');
      return;
    }

    Keyboard.dismiss();
    setSubmitted(true); // 애니메이션 동안 입력 화면 터치 막기
    setResultText(`학번 : ${studentId}\n성명 : ${name}`);

    // 1) 입력 화면은 사라지고, 동시에 결과 박스가 올라옴 (겹침)
    Animated.parallel([
      Animated.timing(formAnim, {
        toValue: 0,
        duration: FORM_FADE_OUT,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(formScale, {
        toValue: 0.92,
        duration: FORM_FADE_OUT,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: RESULT_FADE_IN,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2) 결과 박스를 5초 동안 유지
      Animated.delay(RESULT_HOLD).start(() => {
        // 입력칸 비우기 (이 순간 입력 화면은 보이지 않는 상태)
        setStudentId('');
        setName('');

        // 3) 결과 박스는 사라지고, 동시에 입력 화면이 돌아옴 (겹침)
        Animated.parallel([
          Animated.timing(resultAnim, {
            toValue: 0,
            duration: RESULT_FADE_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(formAnim, {
            toValue: 1,
            duration: FORM_FADE_IN,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(formScale, {
            toValue: 1,
            duration: FORM_FADE_IN,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => setSubmitted(false)); // 입력 화면 다시 터치 가능
      });
    });
  };

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: formAnim, transform: [{ scale: formScale }] },
        ]}
        pointerEvents={submitted ? 'none' : 'auto'}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <View style={styles.center}>
                <View style={styles.logo}>
                  <Image source={require('./assets/logo.png')} style={styles.logo} />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="학번"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  value={studentId}
                  onChangeText={(t) => setStudentId(t.replace(/[^0-9]/g, ''))}
                  onSubmitEditing={() => nameRef.current?.focus()} // Enter → 이름 칸
                />
                <TextInput
                  ref={nameRef}
                  style={styles.input}
                  placeholder="이름"
                  autoCorrect={false}
                  autoComplete="off"
                  spellCheck={false}
                  returnKeyType="done"
                  value={name}
                  onChangeText={(t) => setName(composeHangul(t))} // 글자로 합치기
                  onSubmitEditing={handleConfirm} // Enter → 확인
                />
              </View>

              <View style={styles.bottom}>
                <Button title="확인" color="#2196F3" onPress={handleConfirm} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Animated.View>

      <View style={[StyleSheet.absoluteFill, styles.resultScreen]} pointerEvents="none">
        <Animated.View style={[styles.resultBox, { opacity: resultAnim }]}>
          <Text style={styles.resultText}>{resultText}</Text>
        </Animated.View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  bottom: {
    paddingBottom: 16,
  },

  // 결과 화면
  resultScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    backgroundColor: '#FF7A00', // 주황색
    borderRadius: 24, // 둥근 모서리
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 25,
  },
});