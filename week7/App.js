
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [num, setNum] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('현재 입력값:', num);
  }, [num]);

  const display = useMemo(() => {
    return num;
  }, [num]);

  const press = (value) => {
    setNum(prev => prev + value);
  };

  const buttons = [
    ['AC', '⌫', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <View style={styles.container}>

      <View style={styles.display}>
        <ScrollView
          ref={inputRef}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => {
            inputRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <Text style={styles.displayText}>
            {display}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.keypad}>
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
                  value === '0' && styles.zeroButton
                ]}
                onPress={() => press(value)}
              >
                <Text style={styles.buttonText}>
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 25
  },
  display: {
    flex: 1,
    paddingBottom: 20
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  displayText: {
    color: 'white',
    fontSize: 84,
    textAlign: 'right'
  },
  keypad: {
    gap: 10
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberButton: {
    backgroundColor: '#2f2f2f'
  },
  zeroButton: {
    flexGrow: 2,
    flexBasis: 10
  },
  operatorButton: {
    backgroundColor: '#F5A623'
  },
  utilityButton: {
    backgroundColor: '#555'
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500'
  }
});
