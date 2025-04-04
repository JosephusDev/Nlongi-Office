import { IconSearch } from '@tabler/icons-react-native'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { s } from './styles'
import { colors } from '@/styles/colors'

interface ToolBarProps {
	onPressAdd?: () => void
	onSearch?: (text: string) => void
	valueSearch?: string
	showButton?: boolean
}

export default function ToolBar({ onPressAdd, onSearch, valueSearch, showButton = true }: ToolBarProps) {
	return (
		<View style={s.toolbar}>
			<View style={s.inputContainer}>
				<IconSearch size={18} color={colors.gray[400]} />
				<TextInput value={valueSearch} onChangeText={onSearch} style={s.inputSearch} placeholder='Pesquise...' />
			</View>
			{showButton && (
				<TouchableOpacity style={s.addButton} onPress={onPressAdd}>
					<Feather name='plus' size={20} color={colors.light} />
				</TouchableOpacity>
			)}
		</View>
	)
}
