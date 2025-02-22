import { colors } from '@/styles/colors'
import { IconFilter } from '@tabler/icons-react-native'
import { Pressable, Text, PressableProps, StyleProp, ViewStyle } from 'react-native'
import { s } from './styles'

interface FilterButtonProps extends PressableProps {
	style?: StyleProp<ViewStyle>
}

export default function FilterButton({ onPress, style, ...props }: FilterButtonProps) {
	return (
		<Pressable style={[s.searchButton, style]} onPress={onPress} {...props}>
			<IconFilter color={colors.gray[500]} size={20} />
			<Text style={s.searchLabel}>Clique aqui para filtrar</Text>
		</Pressable>
	)
}
