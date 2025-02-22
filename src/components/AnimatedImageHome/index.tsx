import React, { useEffect } from 'react'
import { View, Image } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withSequence,
	withTiming,
	Easing,
} from 'react-native-reanimated'
import { s } from './styles'

const AnimatedImage = Animated.createAnimatedComponent(Image)

export default function AnimatedImageHome() {
	const translateY = useSharedValue(20) // Posição inicial

	useEffect(() => {
		translateY.value = withRepeat(
			withSequence(
				withTiming(40, { duration: 2000, easing: Easing.ease }), // Desce
				withTiming(20, { duration: 2000, easing: Easing.ease }), // Sobe
			),
			-1, // Repete infinitamente
			true, // Alterna os valores automaticamente
		)
	}, [])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}))

	return (
		<View>
			<AnimatedImage style={[s.image, animatedStyle]} source={require('@/assets/images/icon.png')} />
		</View>
	)
}
