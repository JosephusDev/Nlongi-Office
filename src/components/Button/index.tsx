import { TouchableOpacity, Text, View, TouchableOpacityProps } from 'react-native'
import { s } from './styles'
import { colors } from '@/styles/theme'
import { Feather } from '@expo/vector-icons'

interface IButtonProps extends TouchableOpacityProps {
	onClick?: () => void
	title?: string
	icon?: keyof typeof Feather.glyphMap | React.ReactElement
	disabled?: boolean
}

export default function Button({ onClick, title, icon: Icon, disabled = false, style }: IButtonProps) {
	return (
		<TouchableOpacity style={[s.button, style]} onPress={onClick} disabled={disabled}>
			<View style={s.container}>
				{typeof Icon === 'string' ? <Feather name={Icon} size={20} color={colors.light} /> : Icon}
				{title && <Text style={s.buttonText}>{title}</Text>}
			</View>
		</TouchableOpacity>
	)
}
