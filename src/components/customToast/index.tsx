import React, { useEffect, useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { s } from './styles'

type ValueToastVariant = {
	backgroundColor: string
	icon: keyof typeof Feather.glyphMap
}

const toastVariants: Record<any, ValueToastVariant> = {
	success: { backgroundColor: '#38C793', icon: 'check-circle' },
	error: { backgroundColor: '#DF1C41', icon: 'alert-circle' },
	info: { backgroundColor: '#F2AE40', icon: 'info' },
}

type CustomToastProps = {
	id: number
	title: string
	message: string
	type: keyof typeof toastVariants
	onHide: (id: number) => void
	duration?: number
}

export function CustomToast({ id, title, message, type = 'info', onHide, duration = 3000 }: CustomToastProps) {
	const opacity = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.sequence([
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}),
			Animated.delay(duration - 1000),
			Animated.timing(opacity, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}),
		]).start(() => onHide(id))
	}, [duration])

	const iconName = toastVariants[type].icon

	return (
		<Animated.View
			style={[
				s.toastContainer,
				toastVariants[type],
				{
					opacity,
					transform: [
						{
							translateY: opacity.interpolate({
								inputRange: [0, 2],
								outputRange: [-30, 0],
							}),
						},
					],
				},
			]}
		>
			<View style={s.contentContainer}>
				<Feather name={iconName} size={20} color='#FFFFFF' style={s.icon} />
				<View style={s.textContainer}>
					<Text style={s.title}>{title}</Text>
					<Text style={s.message}>{message}</Text>
				</View>
			</View>
		</Animated.View>
	)
}
