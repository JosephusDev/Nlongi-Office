import { Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { s } from './styles'

export default function CustomWarning({ message }: { message: string }) {
	return (
		<View style={s.alertContainer}>
			<Feather size={15} name='alert-circle' color={colors.red.base} />
			<Text style={s.alert}>{message}</Text>
		</View>
	)
}
