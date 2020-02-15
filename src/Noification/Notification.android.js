import React, { Fragment } from 'react';
import { Animated, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { NotificationBase } from './NotificationBase';
import { androidStyle } from "./androidStyle";

const minVelocityToFling = -250;

export class Notification extends NotificationBase {

	static defaultProps = {
		duration: 2000,
		autohide: true,
    blurAmount: 7
	};

	offset = StatusBar.currentHeight;

	onHandlerStateChange = (event) => {
		const {velocityY, translationY, numberOfPointers, state} = event.nativeEvent;

		if (this.props.onDragGestureHandlerStateChange) {
			this.props.onDragGestureHandlerStateChange(event);
		}

		if (state === 5) {
			if (velocityY < minVelocityToFling && numberOfPointers === 0) {
				Animated.spring(this.translateY, {
					toValue: (this.viewHeight + this.offset * 2) * -1,
					useNativeDriver: true,
					velocity: velocityY,
				}).start();
				return;
			}

			if (translationY > ((this.viewHeight / 2) * -1)) {
				this.show();
			} else {
				this.hide();
			}
		}
	};

	renderOwnComponent() {
		const {textColor, text} = this.props;
		return <Text style={[androidStyle.text, {color: textColor}]}>{text}</Text>;
	}

	render() {
		const {customComponent, onPress, style} = this.props;
		const animatedStyle = [androidStyle.notification,
			style, {
				top: this.offset,
				transform: [{translateY: this.translateY}],
        borderRadius: 10,
        backgroundColor: `rgba(255,255,255,${this.props.blurAmount/100})`
			}];
		return (
			<Fragment>
				<PanGestureHandler onHandlerStateChange={this.onHandlerStateChange} onGestureEvent={this.onGestureEvent}>
					<Animated.View onLayout={this.handleOnLayout} style={animatedStyle}>
						<TouchableOpacity style={[androidStyle.container]} activeOpacity={1} onPress={onPress}>
							<View style={androidStyle.content}>
								{customComponent ? this.renderCustomComponent() : this.renderOwnComponent()}
							</View>
						</TouchableOpacity>
					</Animated.View>
				</PanGestureHandler>
			</Fragment>
		)
	}
}
