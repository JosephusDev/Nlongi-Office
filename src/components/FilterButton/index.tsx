import { colors } from '@/styles/colors'
import { IconFilter } from '@tabler/icons-react-native'
import { Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native'
import { s } from './styles'
import { TouchableOpacityProps } from 'react-native-gesture-handler'

interface FilterButtonProps extends TouchableOpacityProps {
	style?: StyleProp<ViewStyle>
}

export default function FilterButton({ onPress, style, ...props }: FilterButtonProps) {
	return (
		<TouchableOpacity style={[s.searchButton, style]} onPress={onPress} {...props}>
			<IconFilter color={colors.gray[500]} size={20} />
			<Text style={s.searchLabel}>Clique aqui para filtrar</Text>
		</TouchableOpacity>
	)
}
