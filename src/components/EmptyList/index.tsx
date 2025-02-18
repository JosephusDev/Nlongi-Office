import { Text, View } from 'react-native'
import { s } from './styles'
import { IconClipboardList } from '@tabler/icons-react-native'
import { colors } from '@/styles/colors'

export default function EmptyList({ title }: { title: string }) {
	return (
		<View style={s.container}>
			<IconClipboardList size={40} color={colors.gray[400]} />
			<Text style={s.title}>{title}</Text>
		</View>
	)
}
