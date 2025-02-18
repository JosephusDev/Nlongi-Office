import { Pressable, Text, View } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	interpolate,
	Extrapolation,
	withTiming,
} from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { s } from './styles'
import { useEffect } from 'react'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type Props = {
	title: string
	icon: keyof typeof Feather.glyphMap
	onPress?: () => void
	isSelected?: boolean
	badge?: number
}

export default function Option({ title, icon, onPress, isSelected, badge = 0 }: Props) {
	const animationStatus = useSharedValue(0)
	const animatedPressableStyled = useAnimatedStyle(() => ({
		width: interpolate(animationStatus.value, [0, 1], [42, 144], Extrapolation.CLAMP),
	}))
	const animatedTextStyle = useAnimatedStyle(() => ({
		opacity: animationStatus.value,
	}))

	useEffect(() => {
		animationStatus.value = withTiming(isSelected ? 1 : 0)
	}, [isSelected])

	return (
		<AnimatedPressable style={[s.container, animatedPressableStyled]} onPress={onPress}>
			<View style={s.containerIcon}>
				<Feather name={icon} size={24} />
				{badge > 0 && (
					<View style={s.badgeContainer}>
						<Text style={s.badgeText}>{badge}</Text>
					</View>
				)}
			</View>
			<Animated.Text style={[s.title, animatedTextStyle]}>{title}</Animated.Text>
		</AnimatedPressable>
	)
}
