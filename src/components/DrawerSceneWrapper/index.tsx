import React from 'react'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { useDrawerProgress } from '@react-navigation/drawer'

export function DrawerSceneWrapper({ children }: { children: React.ReactNode }) {
	const progress = useDrawerProgress()
	const animatedStyled = useAnimatedStyle(() => ({
		transform: [
			{
				scale: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
			},
			{
				translateX: interpolate(progress.value, [0, 1], [0, 200], Extrapolation.CLAMP),
			},
			{
				rotateY: interpolate(progress.value, [0, 1], [0, -25], Extrapolation.CLAMP) + 'deg',
			},
		],
	}))
	return <Animated.View style={[{ flex: 1 }, animatedStyled]}>{children}</Animated.View>
}
