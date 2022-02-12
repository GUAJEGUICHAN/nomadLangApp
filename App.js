import React, { useState, useRef } from 'react';

import { Animated, TouchableOpacity, Easing, Pressable, Dimensions } from 'react-native';

import styled from 'styled-components/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box)

export default function App() {
  const [up, setUp] = useState(false);
  const POSITION = useRef(new Animated.ValueXY({ x: -SCREEN_WIDTH / 2 + 100, y: -SCREEN_HEIGHT / 2 + 100 })).current;
  const toggleUp = () => setUp((prev) => !prev)

  const topLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  const bottomLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: +SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const bottomRight = Animated.timing(POSITION, {
    toValue: {
      x: +SCREEN_WIDTH / 2 - 100,
      y: +SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const topRight = Animated.timing(POSITION, {
    toValue: {
      x: +SCREEN_WIDTH / 2 - 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });

  const moveUp = () => {
    Animated.loop(Animated.sequence([
      bottomLeft,
      bottomRight,
      topRight,
      topLeft
    ])).start()
  }

  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0]
  })

  // const rotation = POSITION.y.interpolate({
  //   inputRange: [-200, 200],
  //   outputRange: ["-360deg", "360deg"]
  // })

  const bgColor = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
  })

  return (
    <Container>
      <Pressable
        onPress={moveUp}
      >
        <AnimatedBox
          style={{
            backgroundColor: bgColor,
            transform: [
              // { rotateY: rotation },
              ...POSITION.getTranslateTransform()
            ],
            borderRadius: borderRadius
          }}
        />
      </Pressable>
    </Container>

  );
}
