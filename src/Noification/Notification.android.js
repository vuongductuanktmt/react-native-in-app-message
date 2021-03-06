import React, { Fragment } from 'react'
import {
  Animated,
  View,
  Text,
  StatusBar
} from 'react-native'
import {
  PanGestureHandler,
  TapGestureHandler
} from 'react-native-gesture-handler'
import { NotificationBase } from './NotificationBase'
import { androidStyle } from './androidStyle'

const MIN_VELOCITY_TO_FLING = -2106
const BOUNCE_OFFSET = 150

export class Notification extends NotificationBase {

  static defaultProps = {
    duration: 2000,
    autohide: true,
    showKnob: true,
  }

  offset = StatusBar.currentHeight

  onHandlerStateChange = (event) => {
    const { velocityY, translationY, numberOfPointers, state } = event.nativeEvent

    if (this.props.onDragGestureHandlerStateChange) {
      this.props.onDragGestureHandlerStateChange(event)
    }
    console.log(velocityY, MIN_VELOCITY_TO_FLING, numberOfPointers)
    if (velocityY < MIN_VELOCITY_TO_FLING && numberOfPointers === 1) {
      Animated.spring(this.translateY, {
        toValue: (this.viewHeight + BOUNCE_OFFSET + this.offset * 2) * -1,
        useNativeDriver: true,
        velocity: velocityY,
      }).start()
      return
    }
    if (translationY > ((this.viewHeight / 2) * -1)) {
      this.show()
    } else {
      this.hide()
    }
  }

  renderOwnComponent () {
    const { textColor, text } = this.props
    return <Text style={[androidStyle.text, { color: textColor }]}>{text}</Text>
  }

  render () {

    const {
      customComponent,
      onPress,
      style,
      showKnob
    } = this.props

    const animatedStyle = [
      androidStyle.notification,
      style,
      {
        top: this.offset,
        transform: [{ translateY: this.translateY }],
        borderRadius: 10,
        backgroundColor: `rgba(255,255,255,${this.props.blurAmount / 100})`
      },
    ]

    return (
      <Fragment>
        <PanGestureHandler
          onHandlerStateChange={this.onHandlerStateChange}
          onGestureEvent={this.onGestureEvent}>

          <Animated.View
            onLayout={this.handleOnLayout}
            style={animatedStyle}>

            <TapGestureHandler
              style={androidStyle.container}
              onHandlerStateChange={this.onTapHandlerStateChange}>
              <View style={androidStyle.content}>
                {customComponent ? customComponent : this.renderOwnComponent()}
                {showKnob && <View style={androidStyle.knob}/>}
              </View>
            </TapGestureHandler>

          </Animated.View>

        </PanGestureHandler>
      </Fragment>
    )
  }
}
