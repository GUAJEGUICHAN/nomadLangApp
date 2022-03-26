import React, { useRef, useState } from "react";
import { Animated, PanResponder, Pressable, Text, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons'

const Container = styled.View`
  background-color: #00a8ff;
  flex:1;
  justify-content:center;
  align-items:center;
`

const AnimatedCard = styled(Animated.createAnimatedComponent(View))`
  background-color:white;
  position:absolute;
  width:250px;
  height:250px;
  justify-content:center;
  align-items:center;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.2); 
  border-radius:12px;
`

const BtnContainer = styled.View`
flex:1;
  transform: translate(0, -100px);
  display:flex;
  flex-direction:row;
`
const Btn = styled(Animated.createAnimatedComponent(View))`
  margin:10px;
`

const CardContainer = styled.View`
  flex:3;
  justify-content:center;
  align-items:center;
`

export default function App() {
  const scale = useRef(new Animated.Value(1)).current
  const POSITION = useRef(new Animated.Value(0)).current;
  const checkButtonPosition = useRef(new Animated.Value(0)).current

  const constrainedX = checkButtonPosition.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 50],
    extrapolate: 'clamp'
  })
  const swipeSpeed = checkButtonPosition.interpolate({
    inputRange: [0, 50],
    outputRange: [400, 100],
    extrapolate: 'clamp'
  })

  const closeButtonPosition = useRef(new Animated.Value(0)).current
  const secondScale = POSITION.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp'
  })
  const rotation = POSITION.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-100deg", "100deg"],
    extrapolate: 'clamp'
  })

  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    setIndex(prev => 1 + prev)
    POSITION.setValue(0)
  }
  const onPressIn = () => { Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start() }
  const onPressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start() }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, test) => {
        console.log('POSITION', POSITION)
        console.log('POSITION.setOffset(POSITION._value)', POSITION._value)
        // POSITION.setOffset(POSITION._value);
        // POSITION.setValue(0)
        console.log('POSITION', POSITION)
        console.log('POSITION.setOffset(POSITION._value)', POSITION._value)
        onPressIn()
        // console.log("grant\tPOSITION\t", POSITION)
        // console.log("grant\tPOSITION._value\t", POSITION._value)
      },
      onPanResponderMove: (_, { dx }) => {
        POSITION.setValue(dx)
        // console.log('setValue(dx)\t\t', dx)
        // console.log('Move\tPOSITION\t', POSITION)
        // console.log('Move\tPOSITION.value\t', POSITION._value)
      },
      onPanResponderRelease: (_, { dx }) => {
        console.log('Release POSITION', typeof POSITION)
        console.log('Release POSITION._value', POSITION._value)
        POSITION.flattenOffset()
        if (POSITION._value > 150) {
          bounceTotheRightOut()
        } else if (POSITION._value < -150) {
          bounceTotheLeftOut()
        } else {
          bounceBack()
        }
        onPressOut()
      },
    })
  ).current
  let LEVEL = 0
  const panResponderForBtn = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, test) => {
        console.log('눌렀음')
        checkPress(1000)
      },
      onPanResponderMove: (_, { dx }) => {
        // console.log(dx)
        console.log('dx', dx)
        console.log('constrainedX', typeof constrainedX)
        console.log('constrainedX', typeof constrainedX.__getValue())
        checkButtonPosition.setValue(dx)
        console.log(LEVEL)
        if (constrainedX.__getValue() < 10) {
          if (LEVEL === 0) {
            return
          } else {
            LEVEL = 0
            stopLoop()
            checkPress(1000)
          }
        } else if (constrainedX.__getValue() < 25) {
          if (LEVEL === 1) {
            return
          } else {
            LEVEL = 1
            stopLoop()
            checkPress(500)
          }
        } else if (constrainedX.__getValue() < 40) {
          if (LEVEL === 2) {
            return
          } else {
            LEVEL = 2
            stopLoop()
            checkPress(300)
          }
        } else {

          if (LEVEL === 3) {
            return
          } else {
            LEVEL = 3
            stopLoop()
            checkPress(100)
          }
        }
      },
      onPanResponderRelease: () => {
        console.log('놨음')
        stopLoop()
        Animated.spring(checkButtonPosition, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      }
    })
  ).current

  const bounceTotheLeftOut = () => {
    Animated.spring(POSITION, {
      toValue: -400,
      useNativeDriver: true,
      restDisplacementThreshold: 100,
      restSpeedThreshold: 100,
    }).start(() => {
      // POSITION.setValue(-400)
      // POSITION.flattenOffset()
      onDismiss()
      // POSITION.flattenOffset()
    })
  }
  const bounceTotheRightOut = () => {
    // console.log('bounceTotheRightOut start POSITION', POSITION)
    Animated.spring(POSITION, {
      toValue: 400,
      useNativeDriver: true,
      restDisplacementThreshold: 100,
      restSpeedThreshold: 100,
    }).start(() => {
      // console.log('bounceTotheRightOut end POSITION', POSITION)
      // console.log('bounceTotheRightOut POSITION', POSITION)
      // POSITION.setValue(400)
      // POSITION.flattenOffset()
      onDismiss()
    })
  }
  const bounceBack = () => {
    // console.log('bounceBack start POSITION', POSITION)

    Animated.spring(POSITION, {
      toValue: 0,
      bounciness: 10,
      useNativeDriver: true
    }).start(() => {
      console.log('bounceBack end POSITION', POSITION)
      POSITION.setValue(0)
      POSITION.flattenOffset()
    })
  }



  function closePress() {
    bounceTotheLeftOut()
    const loopId = setInterval(bounceTotheLeftOut, 100)
    setLoop(loopId)
    console.log('loop', loop)

  }

  const [level, setLevel] = useState(0)
  function level1() {
  }

  let LOOPIDLET
  function checkPress(speed) {
    bounceTotheRightOut()
    // LOOPIDLET = setInterval(bounceTotheRightOut, 200)
    console.log(swipeSpeed.__getValue(), typeof swipeSpeed)
    LOOPIDLET = setInterval(bounceTotheRightOut, speed)
    console.log('LOOPIDLET', LOOPIDLET)
    // const loopId = setInterval(bounceTotheRightOut, 200)
    // console.log('checkPress loop', loopId)
    // setLoop(loopId)
    // console.log('loop', loop)
  }

  function stopLoop() {
    // console.log('i want to stop!', loop)
    // clearInterval(loop)
    console.log('i want to stop!', LOOPIDLET)
    clearInterval(LOOPIDLET)
  }

  return (
    <Container>
      <CardContainer>
        <AnimatedCard
          style={{
            transform: [{ scale: secondScale },]
          }}
        >
          <Text
            style={{
              fontSize: 80,
              fontWeight: '900'
            }}
          >{index + 1}</Text>
          {/* <Ionicons name="open" size={98} /> */}
        </AnimatedCard>
        <AnimatedCard
          {...panResponder.panHandlers}
          style={{
            transform: [{ scale }, { translateX: POSITION }, { rotateZ: rotation }]
          }}
        >
          <Text
            style={{
              fontSize: 80,
              fontWeight: '900'
            }}
          >{index}</Text>
          {/* <Ionicons name="pizza" size={98} /> */}
        </AnimatedCard>
      </CardContainer>
      <BtnContainer>
        <Btn onPressIn={closePress} onPressOut={stopLoop}>
          <Ionicons name="close-circle" color="white" size={58} />
        </Btn>
        <Btn
          {...panResponderForBtn.panHandlers}
          style={{
            transform: [{
              translateX: constrainedX
            }]
          }}
        // onPressIn={checkPress}
        // onPressOut={stopLoop}
        >
          <Ionicons name="checkmark-circle" color="white" size={58} />
        </Btn>
      </BtnContainer>
    </Container >
  );
}

