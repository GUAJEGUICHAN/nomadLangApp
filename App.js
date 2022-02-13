import React, { useState, useRef } from 'react';

import { Animated, TouchableOpacity, Easing, Pressable, Dimensions, PanResponder } from 'react-native';

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

  // const x = useRef(0)
  // const y = useRef(0)
  const POSITION = useRef(new Animated.ValueXY({
    x: 0,
    y: 0
  })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        POSITION.setOffset({
          x: POSITION.x._value,
          y: POSITION.y._value
        })
      },
      onPanResponderMove: (_, { dx, dy }) => {
        POSITION.setValue({
          x: dx,
          y: dy,
        })
      },
      onPanResponderRelease: () => {
        POSITION.flattenOffset()
      }
      // onPanResponderRelease: () => {
      //   Animated.spring(POSITION, {
      //     toValue: {
      //       x: 0,
      //       y: 0
      //     },
      //     bounciness: 200,
      //     useNativeDriver: false,
      //   }).start()
      // }
    })
  ).current;

  const moveUp = () => {

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
          {...panResponder.panHandlers}
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
