import { ScrollView, Text, View } from 'react-native'
import { s } from './styles'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { notifications } from '@/mocks'

export default function Notifications() {
	return (
		<ScrollView style={s.container}>
			{notifications.map((notification, index) => (
				<View style={s.card} key={index}>
					<View style={s.header}>
						<View style={s.icon}>
							<Feather name={notification.icon} size={18} color={colors.red.base} />
						</View>
						<View>
							<Text style={s.title}>{notification.title}</Text>
						</View>
					</View>
					<Text style={s.description}>{notification.description}</Text>
				</View>
			))}
		</ScrollView>
	)
}
