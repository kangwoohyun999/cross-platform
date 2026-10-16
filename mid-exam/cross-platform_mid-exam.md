# 크로스플랫폼 프로그래밍 중간고사 대비 정리

> 시험: 2026년 10월 22일 / 후 103 / 범위: 강의자료 2주 ~ 7주
> 업로드 자료 기준 정리 (2·3·7주 강의 PDF + 2·3·5·6·7주 과제 코드). 4~6주 강의 PDF는 자료에 없어서 과제 코드에 나온 컴포넌트 중심으로 정리함.

---

## 0. 한눈에 보는 필수 코드 틀

```javascript
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 30 },
});
```

외워둘 포인트:
- 컴포넌트는 `react-native`에서 import (`View`, `Text`, `TextInput`, `Button`, `Pressable`, `Image`, `Switch`, `ScrollView` …)
- Hook은 `react`에서 import (`useState`, `useRef`, `useEffect`, `useMemo`)
- `StatusBar`는 `expo-status-bar`에서 import
- `export default function App()` → 앱 진입 컴포넌트
- `return ( ... )` 안은 **최상위 요소 1개**로 감싸야 함
- 스타일 값: 숫자는 단위 없이(`fontSize: 30`), `fontWeight`는 **문자열**(`'600'`), 색상도 문자열

---

## 1. 2주차 – React Native 개발환경

### 개념 요약
- **React Native**: JavaScript/TypeScript + React 문법으로 iOS·Android 앱을 함께 만드는 프레임워크
  - 장점: 크로스플랫폼(코드 하나로 iOS/Android), React 기반, 빠른 개발, 커뮤니티 풍부, 카메라·위치·알림 등 네이티브 기능 사용
  - 단점: 고성능 그래픽·복잡한 네이티브 기능은 별도 개발 필요, iOS/Android 설정 지식 필요할 때 있음, 외부 패키지 호환성 문제, 순수 네이티브보다 성능 최적화 어려움
- **Watchman**: 페이스북이 만든 파일 변경 감지 도구 → 소스 변경 감지 후 자동 빌드 (Mac)
- **Node.js**: JS를 서버 사이드에서 쓰게 해주는 플랫폼
  - Chrome **V8 엔진** 기반 / **비동기 I/O(non-blocking)** / **단일 스레드 이벤트 루프** / **npm** 기본 포함
- **IDE**: 통합 개발 환경 (Mac: Xcode, Windows: VS Code)
- **JDK 21** 설치 → 환경변수 `JAVA_HOME`, Path에 `%JAVA_HOME%\bin`
- **Android Studio** 환경변수: `ANDROID_HOME`, `ANDROID_SDK_ROOT` = `%LOCALAPPDATA%\Android\Sdk`, Path에 `...\Sdk\platform-tools`
- **Expo** 핵심: React Native 기반 / 개발환경 간편화 / **Expo Go** 앱으로 빌드 없이 실행 / 내장 API(카메라, 센서, 푸시, 위치) / **EAS**로 빌드·배포

### 프로젝트 생성 명령어 (순서 문제 대비)
```
npm install -g expo-cli    // 1. expo 설치
expo init myApp            // 2. 프로젝트 생성 (blank 템플릿)
cd myApp                   // 3. 폴더 이동
code .                     // 4. VS Code 실행
npm start                  // 5. 실행
```

### 과제 코드: 학과/학번/이름 출력
```javascript
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>전공: 인공지능</Text>
      <Text style={styles.text}>학번: 202404178</Text>
      <Text style={styles.text}>이름: 강우현</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    marginBottom: 8,
  },
});
```

---

## 2. 3주차 – 스타일링

### 2-1. 정렬 속성 (객관식 단골)

| 속성 | 의미 | 값 |
|---|---|---|
| `flexDirection` | 주축 방향 | `column`(기본값), `column-reverse`, `row`, `row-reverse` |
| `justifyContent` | **주축** 방향 정렬 | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` |
| `alignItems` | **교차축** 방향 정렬 | `flex-start`, `flex-end`, `center`, `stretch`, `baseline` |

- `space-between`: 요소 **사이** 간격만 동일 (양끝 여백 없음)
- `space-around`: 각 요소 **주변** 간격 동일 (양끝은 사이 간격의 절반)
- `space-evenly`: 사이 + 양 끝 **모두 동일**
- `stretch`: 교차축 방향으로 늘림 / `baseline`: 텍스트 기준선 정렬
- ⚠️ 기본 `flexDirection`이 **column**이므로 기본 상태에서 `justifyContent` = 세로, `alignItems` = 가로. `row`로 바꾸면 반대가 됨.

### 2-2. 줄바꿈과 주석
```javascript
<Text>학과: 소프트웨어공학{"\n"}학번: 123456{"\n"}이름: 홍길동</Text>
```
```javascript
{/* JSX 안에서의 주석은 이렇게 */}
// JSX 밖(JS 영역)은 일반 주석
/* 여러 줄 주석 */
```

### 2-3. 스타일 적용 4가지 방식

**① 인라인 스타일** – 중괄호 두 개 `{{ }}`
```javascript
<Text style={{ padding: 10, fontSize: 26, fontWeight: "600", color: "black" }}>
  Inline Styling - Text
</Text>
```

**② 클래스(StyleSheet) 스타일**
```javascript
<Text style={styles.text}>Text</Text>
<Text style={styles.error}>Error</Text>

const styles = StyleSheet.create({
  text:  { padding: 10, fontSize: 26, fontWeight: '600', color: 'black' },
  error: { padding: 10, fontSize: 26, fontWeight: '400', color: 'red' },
});
```

**③ 여러 스타일 적용 – 배열 `[ ]`** (뒤에 오는 스타일이 덮어씀)
```javascript
<Text style={[styles.text, styles.error]}>Error</Text>

const styles = StyleSheet.create({
  text:  { padding: 10, fontSize: 26, fontWeight: '600', color: 'black' },
  error: { fontWeight: '400', color: 'red' },   // text를 덮어써서 빨간색, 400
});
```
→ 결과: padding 10, fontSize 26, **fontWeight '400', color 'red'**

**④ 외부 스타일 파일** (`src/styles.js`)
```javascript
// src/styles.js
import { StyleSheet } from "react-native";
export const viewStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
export const textStyles = StyleSheet.create({
  text:  { padding: 10, fontSize: 26, fontWeight: '600', color: 'black' },
  error: { fontWeight: '400', color: 'red' },
});
```
```javascript
// App.js
import { viewStyles, textStyles } from "./src/styles";
<View style={viewStyles.container}>
  <Text style={textStyles.text}>Text</Text>
</View>
```
- `export const` 로 내보냈으면 → `import { 이름 }` (중괄호 필요)
- `export default` 로 내보냈으면 → `import 이름` (중괄호 없음)

### 2-4. flex 비율 계산 (계산 문제 대비)
```javascript
header:   { flex: 1 },   // 1 / (1+3+1) = 20%
contents: { flex: 3 },   // 3 / 5      = 60%
footer:   { flex: 1 },   // 1 / 5      = 20%
```
가로 분할은 부모에 `flexDirection: "row"`:
```javascript
contents:      { flex: 2, flexDirection: "row" },
contentsLeft:  { flex: 1, backgroundColor: "#16a085" },  // 가로 50%
contentsRight: { flex: 1, backgroundColor: "#27ae60" },  // 가로 50%
```

### 2-5. 과제 코드: 강남대 컬러 그리드 (중첩 flex)
구조:
```
container (column)
├─ titleBox   flex 29
├─ gridBox    flex 45, row
│   ├─ leftColumn  flex 2 (column) : 노랑 5 / 흰 6 / 파랑 4
│   └─ rightColumn flex 7 (column)
│       ├─ redBox     flex 11 (학교·학과·학번·이름)
│       └─ subjectRow flex 4, row
│            ├─ subjectTextBox flex 7 (과목)
│            └─ smallColumn    flex 1 : 흰 1 / 노랑 1
└─ footer     flex 26
```
핵심 코드:
```javascript
<View style={styles.gridBox}>
  <View style={styles.leftColumn}>
    <View style={[styles.cell, styles.yellowBox]} />
    <View style={[styles.cell, styles.whiteBox]} />
    <View style={[styles.cell, styles.blueBox]} />
  </View>
  <View style={styles.rightColumn}>
    <View style={[styles.cell, styles.redBox]}>
      <Text style={styles.schoolText}>강남대학교</Text>
      <Text style={styles.infoText}>학과: 인공지능</Text>
    </View>
    <View style={styles.subjectRow}>
      <View style={[styles.cell, styles.subjectTextBox]}>
        <Text style={styles.subjectText}>과목: 크로스 플랫폼</Text>
      </View>
      <View style={styles.smallColumn}>
        <View style={[styles.cell, styles.smallWhite]} />
        <View style={[styles.cell, styles.smallYellow]} />
      </View>
    </View>
  </View>
</View>
```
```javascript
gridBox:     { flex: 45, flexDirection: 'row' },
cell:        { borderWidth: 2, borderColor: '#000' },   // 공통 테두리 → 배열로 합침
leftColumn:  { flex: 2 },
rightColumn: { flex: 7 },
redBox:      { flex: 11, backgroundColor: '#FF1621', alignItems: 'flex-start',
               justifyContent: 'center', paddingLeft: 14 },
subjectRow:  { flex: 4, flexDirection: 'row' },
```
- 왼쪽 노랑(5)+흰(6) = 11 = 빨강(11) → 높이가 맞음 (양쪽 합 모두 15)
- 가로 비율: 왼쪽 2/9, 오른쪽 7/9

---

## 3. 5주차 – Image, Switch, 조건부 스타일 (과제 기준)

### 개념 요약
- **Image**: 로컬 이미지는 `source={require('./assets/logo.png')}`, **width/height 지정 필수**
  - (참고) 웹 이미지: `source={{ uri: 'https://...' }}`
- **Switch**: `value`(현재값), `onValueChange`(바뀔 때 호출), `trackColor={{ false: ..., true: ... }}`, `thumbColor`
- **삼항 연산자**로 상태에 따라 스타일/텍스트 변경 → `조건 ? 참 : 거짓`
- 스타일 배열에 **정적 스타일 + 동적 객체** 섞어 쓰기

### 과제 코드: 다크모드 스위치
```javascript
import React, { useState } from 'react';
import { View, Text, Image, Switch, StyleSheet } from 'react-native';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const textColor = { color: darkMode ? 'white' : 'black' };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? 'black' : 'white' }]}>
      <View style={styles.top}>
        <Image source={require('./assets/logo.png')} style={styles.image} />
      </View>

      <View style={styles.center}>
        <Text style={[styles.switchText, textColor]}>
          {darkMode ? '스위치: ON' : '스위치: OFF'}
        </Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={styles.bottom}>
        <Text style={[styles.info, textColor]}>학과: 인공지능융합공학부</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  top:    { flex: 1, justifyContent: 'flex-end',   alignItems: 'center', paddingBottom: 20 },
  center: { alignItems: 'center' },
  bottom: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 },
  image:  { width: 200, height: 200 },
});
```
포인트:
- `onValueChange={setDarkMode}` → Switch가 새 값(true/false)을 넘겨주므로 setter를 그대로 넣어도 됨
- `top`은 `flex-end`(아래 붙음), `bottom`은 `flex-start`(위 붙음) → 스위치를 중심으로 위아래 대칭 배치

---

## 4. 6주차 – TextInput, Button, Alert, Keyboard, Animated (과제 기준)

### 개념 요약

| 컴포넌트/API | 용도 · 주요 속성 |
|---|---|
| `TextInput` | 입력창. `value`, `onChangeText`, `placeholder`, `keyboardType`(`numeric`, `number-pad`), `returnKeyType`(`next`, `done`), `onSubmitEditing`(엔터 시) |
| `Button` | `title`, `onPress`, `color` (style 속성 없음!) |
| `Alert.alert(제목, 내용)` | 팝업 경고창 |
| `Keyboard.dismiss()` | 키보드 내리기 |
| `TouchableWithoutFeedback` | 빈 화면 터치 시 동작 (예: 키보드 내리기) |
| `KeyboardAvoidingView` | 키보드가 입력창 가리지 않게. `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}` |
| `Platform.OS` | `'ios'` / `'android'` 구분 |
| `Animated.Value` | 애니메이션 값 (`useRef(new Animated.Value(1)).current`) |
| `Animated.timing` | 값을 `toValue`까지 `duration`(ms) 동안 변화 |
| `Animated.parallel([...])` | 여러 애니메이션 **동시** 실행 |
| `Animated.delay(ms)` | 대기 |
| `useNativeDriver: true` | 네이티브에서 실행 (opacity, transform만 가능) |

### 과제 핵심 코드: 입력 → 검증 → 애니메이션
```javascript
const [studentId, setStudentId] = useState('');
const [name, setName] = useState('');
const nameRef = useRef(null);
const formAnim   = useRef(new Animated.Value(1)).current;  // 입력화면 투명도
const resultAnim = useRef(new Animated.Value(0)).current;  // 결과박스 투명도

const handleConfirm = () => {
  if (!studentId.trim() || !name.trim()) {
    Alert.alert('알림', '학번과 이름을 모두 입력해주세요.');
    return;
  }
  Keyboard.dismiss();

  Animated.parallel([
    Animated.timing(formAnim,   { toValue: 0, duration: 1200, useNativeDriver: true }),
    Animated.timing(resultAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
  ]).start(() => {
    Animated.delay(5000).start(() => {   // 5초 유지 후 원상복귀
      setStudentId(''); setName('');
      Animated.parallel([
        Animated.timing(resultAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        Animated.timing(formAnim,   { toValue: 1, duration: 1500, useNativeDriver: true }),
      ]).start();
    });
  });
};
```
```javascript
<TextInput
  placeholder="학번"
  keyboardType="number-pad"
  returnKeyType="next"
  value={studentId}
  onChangeText={(t) => setStudentId(t.replace(/[^0-9]/g, ''))}   // 숫자만 허용
  onSubmitEditing={() => nameRef.current?.focus()}               // 엔터 → 이름칸 이동
/>
<TextInput
  ref={nameRef}
  placeholder="이름"
  returnKeyType="done"
  value={name}
  onChangeText={setName}
  onSubmitEditing={handleConfirm}
/>
<Button title="확인" color="#2196F3" onPress={handleConfirm} />

<Animated.View style={{ opacity: resultAnim }}>
  <Text>{`학번 : ${studentId}\n성명 : ${name}`}</Text>
</Animated.View>
```
포인트:
- 애니메이션 대상은 일반 `View`가 아니라 **`Animated.View`**
- `.start(콜백)` → 애니메이션 끝난 뒤 다음 동작 실행 (순차 실행)
- 템플릿 리터럴: `` `학번 : ${studentId}` ``

---

## 5. 7주차 – Hook ⭐ (가장 중요)

### 5-0. Hook 규칙
- 함수형 컴포넌트에서 **state / 생명주기** 기능을 쓰게 해주는 특별한 함수
- **함수 컴포넌트와 커스텀 Hook에서만** 사용
- **함수 최상위에서만** 사용 (if, for, 중첩 함수 안 ✕)
- 이름은 항상 **`use`로 시작**

| Hook | 분류 | 역할 |
|---|---|---|
| `useState` | 상태 관리 | 값 저장·업데이트 → **바뀌면 리렌더링** |
| `useRef` | 참조 관리 | 요소나 값을 직접 제어 → **바뀌어도 리렌더링 X** |
| `useEffect` | 생명주기 제어 | 실행·변경·종료 시 코드 실행 |
| `useMemo` | 참조 관리 | 계산 결과 기억 → **불필요한 재계산 방지** |

---

### 5-1. useState
```javascript
const [state, setState] = useState(initialState);
//     현재값   변경함수            초기값
```
- `setState`로 값을 바꾸면 화면이 **자동으로 다시 렌더링**
- 직접 대입(`count = 5`)하면 화면 갱신 ✕

**예제 1: 카운터 (Pressable)**
```javascript
const [count, setCount] = useState(0);

<Text style={styles.text}>현재 카운트: {count}</Text>
<Pressable style={styles.button} onPress={() => setCount(count + 1)}>
  <Text style={styles.buttonText}>+1 증가</Text>
</Pressable>
<Pressable style={styles.button} onPress={() => setCount(count - 1)}>
  <Text style={styles.buttonText}>-1 감소</Text>
</Pressable>
```
- `Pressable`은 `style` 지정 가능, 안에 `Text`를 넣어야 글자가 보임
- `Button`은 `title`로 글자 지정, `style` 속성 없음

**예제 2: A × B 계산기**
```javascript
const [a, setA] = useState('');
const [b, setB] = useState('');
const [result, setResult] = useState(null);

const multiply = () => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) {
    setResult('숫자를 입력하세요!');
  } else {
    setResult(numA * numB);
  }
};

<TextInput keyboardType="numeric" placeholder="A 입력" value={a} onChangeText={setA} />
<TextInput keyboardType="numeric" placeholder="B 입력" value={b} onChangeText={setB} />
<Button title="A × B 계산" onPress={multiply} />
{result !== null && <Text>결과: {result}</Text>}
```
포인트:
- TextInput 값은 **항상 문자열** → `parseFloat()`로 숫자 변환 필수
  - 변환 안 하고 `a * b`는 JS가 자동 변환해서 곱셈은 되지만, `a + b`는 **문자열 연결**("3"+"4"="34")이 됨
- `isNaN()`: 숫자가 아니면 true
- `{조건 && <컴포넌트>}` → **조건부 렌더링** (result가 null이면 안 보임)
- `onChangeText={setA}` = `onChangeText={(text) => setA(text)}` 와 같음

---

### 5-2. useRef
```javascript
const ref = useRef(initialValue);
// ref.current 로 접근 / 값이 바뀌어도 리렌더링되지 않음
```

**예제 1: useRef vs 일반 변수 vs 리렌더 ⭐ (출력 예측 문제 단골)**
```javascript
const [render, setRender] = useState(false);
const countRef = useRef(0);
let countVar = 5;

const handleClick = () => {
  countRef.current += 1;
  countVar += 1;
  console.log('현재 count:', countRef.current, ": ", countVar);
};
const doRender = () => { setRender(!render); };

<Text>결과값 CountRef:{countRef.current}, {"\n"}결과값 CountVar: {countVar}</Text>
<Button title="클릭" onPress={handleClick} />
<Button title="리랜더" onPress={doRender} />
```

| 동작 | 콘솔 출력 | 화면 표시 |
|---|---|---|
| 처음 | – | CountRef:0, CountVar: 5 |
| 클릭 | 현재 count: 1 : 6 | 변화 없음 (0, 5) |
| 클릭 | 현재 count: 2 : 7 | 변화 없음 (0, 5) |
| 클릭 | 현재 count: 3 : 8 | 변화 없음 (0, 5) |
| **리랜더** | – | **CountRef:3, CountVar: 5** |
| 클릭 | 현재 count: 4 : 6 | 변화 없음 (3, 5) |

이유:
- `useRef` 값은 바뀌어도 리렌더링 X → 화면 그대로. 하지만 **리렌더링 후에도 값이 유지**됨 (3)
- 일반 변수 `let countVar`는 **렌더링마다 함수가 다시 실행되어 5로 초기화**됨
- `useState`(render)를 바꿔야 리렌더링이 일어남

**예제 2: 포커스 이동**
```javascript
const inputRef = useRef(null);
const focusInput = () => {
  inputRef.current.focus();      // TextInput에 포커스
};

<TextInput ref={inputRef} placeholder="이름을 입력하세요" />
<Button title="포커스 이동" onPress={focusInput} />
```
- `ref={inputRef}`로 컴포넌트와 연결 → `inputRef.current`가 그 TextInput을 가리킴

**예제 3: 계산 후 A 입력창으로 포커스**
```javascript
const focusInput = () => {
  inputRef.current?.focus();    // ?. : ref가 있을 때만 실행 (옵셔널 체이닝)
};
const handlePress = () => {
  multiply();     // 계산
  focusInput();   // A 입력창으로 포커스
};

<TextInput ref={inputRef} placeholder="A 입력" returnKeyType="next" ... />
<Button title="A × B 계산" onPress={handlePress} />
```
- `?.` (옵셔널 체이닝): `current`가 null이면 에러 없이 넘어감

---

### 5-3. useEffect
```javascript
useEffect(() => {
  // 실행할 코드
}, [dependency]);   // 어떤 값이 바뀔 때 다시 실행할지
```

| 두 번째 인자 | 실행 시점 |
|---|---|
| `[]` (빈 배열) | **최초 1회**만 (마운트 시) |
| `[count]` | 처음 + **count가 바뀔 때마다** |
| 생략 | **렌더링될 때마다** |
| `return () => {...}` | 컴포넌트 종료(언마운트) 시 정리(cleanup) |

**예제 1: 최초 1회**
```javascript
useEffect(() => {
  console.log("앱이 실행되었습니다! (처음 한 번만)");
}, []);
```

**예제 2: count 변경 시마다**
```javascript
const [count, setCount] = useState(0);
useEffect(() => {
  console.log("count 값이 바뀌었습니다:", count);
}, [count]);

<Text>현재 값: {count}</Text>
<Button title="+1 증가" onPress={() => setCount(count + 1)} />
```
버튼 3번 → 콘솔: `…: 0`(처음) → `…: 1` → `…: 2` → `…: 3`

---

### 5-4. useMemo
```javascript
const memoizedValue = useMemo(() => {
  return 계산식;        // 반환값을 기억
}, [dependency]);        // 이 값이 바뀔 때만 다시 계산
```

**예제: count와 text 분리 ⭐**
```javascript
const [count, setCount] = useState(0);
const [text, setText] = useState("");

const double = useMemo(() => {
  console.log("double 계산 실행!");
  return count * 2;
}, [count]);

<Text>Count: {count}</Text>
<Text>Double: {double}</Text>
<Button title="카운트 +1" onPress={() => setCount(count + 1)} />
<Button title="텍스트 추가" onPress={() => setText(text + '강남대 ')} />
<Text>Character: {text}</Text>
```

| 동작 | 화면 | 콘솔 "double 계산 실행!" |
|---|---|---|
| 처음 | Count 0 / Double 0 | ✅ 출력 |
| 카운트 +1 | Count 1 / Double 2 | ✅ 출력 |
| 텍스트 추가 | Character: 강남대 | ❌ **출력 안 됨** (리렌더링은 되지만 count가 안 바뀌어서 재계산 X) |
| 텍스트 추가 | Character: 강남대 강남대 | ❌ |
| 카운트 +1 | Count 2 / Double 4 | ✅ 출력 |

→ useMemo 없이 `const double = count * 2;`였다면 **텍스트 추가할 때도 매번 계산**됨

### 5-5. useEffect vs useMemo 구분
| | useEffect | useMemo |
|---|---|---|
| 목적 | 부수 효과 실행 (로그, 데이터 요청 등) | **값 계산 결과 기억** |
| 반환값 | 없음 (cleanup 함수만) | 계산된 값 |
| 실행 시점 | 렌더링 **후** | 렌더링 **중** |

---

### 5-6. 7주차 실습: 계산기 UI
조건: 배경 `black`, displayText `white`/`84`/`right`, 버튼 높이 64, 숫자 `#2f2f2f`, 연산자 `#F5A623`, 유틸 `#555`, 버튼글자 `white`/`30`/`'500'`

```javascript
const [num, setNum] = useState('');
const inputRef = useRef(null);

useEffect(() => { console.log('현재 입력값:', num); }, [num]);
const display = useMemo(() => num, [num]);

const press = (value) => {
  setNum(prev => prev + value);    // 함수형 업데이트: 이전 값 기반
};

const buttons = [
  ['AC', '⌫', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];
```
```javascript
<ScrollView
  ref={inputRef}
  contentContainerStyle={styles.scrollContent}
  onContentSizeChange={() => inputRef.current?.scrollToEnd({ animated: true })}
>
  <Text style={styles.displayText}>{display}</Text>
</ScrollView>

{buttons.map((row, i) => (
  <View key={i} style={styles.row}>
    {row.map((value) => (
      <Pressable
        key={value}
        style={[
          styles.button,
          ['AC', '⌫'].includes(value)
            ? styles.utilityButton
            : ['+', '-', '×', '÷', '='].includes(value)
            ? styles.operatorButton
            : styles.numberButton,
          value === '0' && styles.zeroButton,
        ]}
        onPress={() => press(value)}
      >
        <Text style={styles.buttonText}>{value}</Text>
      </Pressable>
    ))}
  </View>
))}
```
```javascript
container:      { flex: 1, backgroundColor: 'black', justifyContent: 'flex-end' },
displayText:    { color: 'white', fontSize: 84, textAlign: 'right' },
row:            { flexDirection: 'row', gap: 10 },
button:         { flex: 1, height: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
numberButton:   { backgroundColor: '#2f2f2f' },
operatorButton: { backgroundColor: '#F5A623' },
utilityButton:  { backgroundColor: '#555' },
zeroButton:     { flexGrow: 2 },    // 0 버튼만 2칸
buttonText:     { color: 'white', fontSize: 30, fontWeight: '500' },
```
포인트:
- **`map()`으로 반복 렌더링 + `key` 필수** (2중 map: 행 → 버튼)
- `.includes(value)`로 버튼 종류 판별 → 중첩 삼항으로 스타일 선택
- `value === '0' && styles.zeroButton` → 조건이 false면 `false`가 들어가고 무시됨
- `setNum(prev => prev + value)` → **함수형 업데이트** (이전 상태 기반 안전하게 갱신)
- `useRef`를 ScrollView에 연결해 `scrollToEnd()` 호출 → 숫자가 길어지면 끝으로 자동 스크롤

(응용 대비) AC·⌫·= 동작까지 넣는다면:
```javascript
const press = (value) => {
  if (value === 'AC') return setNum('');
  if (value === '⌫') return setNum(prev => prev.slice(0, -1));
  if (value === '=') {
    const expr = num.replace(/×/g, '*').replace(/÷/g, '/');
    return setNum(String(eval(expr)));
  }
  setNum(prev => prev + value);
};
```

---

## 6. 시험 직전 체크리스트

**빈칸/코드 작성 대비**
- [ ] `import React, { useState } from 'react';` / `import { ... } from 'react-native';`
- [ ] `const styles = StyleSheet.create({ ... });`
- [ ] 인라인 `style={{ }}` / 클래스 `style={styles.x}` / 여러 개 `style={[a, b]}`
- [ ] `const [x, setX] = useState(초기값);`
- [ ] `const ref = useRef(null);` + `ref={ref}` + `ref.current.focus()`
- [ ] `useEffect(() => {...}, [])` / `[dep]` / 생략 차이
- [ ] `useMemo(() => 계산, [dep])`
- [ ] `parseFloat`, `isNaN`, `{조건 && <Text/>}`, 삼항 연산자
- [ ] `{"\n"}` 줄바꿈, `{/* */}` JSX 주석
- [ ] `require('./assets/logo.png')` + width/height

**자주 틀리는 것**
- `fontWeight: 600` ✕ → `fontWeight: '600'` ○ (문자열)
- `style={styles.text, styles.error}` ✕ → `style={[styles.text, styles.error]}` ○
- 인라인 스타일 `style={flex: 1}` ✕ → `style={{ flex: 1 }}` ○
- `Button`에 `style` ✕ → `title`, `color`, `onPress` 사용
- `onPress={setCount(count + 1)}` ✕ (렌더링 시 즉시 실행됨) → `onPress={() => setCount(count + 1)}` ○
- useRef 값 변경 → **화면 안 바뀜**, useState 변경 → **화면 바뀜**
- 일반 `let` 변수는 리렌더링되면 **초기값으로 리셋**
- Hook은 `if` 안에서 호출 ✕
- `flexDirection` 기본값은 **column** (웹 CSS는 row)
