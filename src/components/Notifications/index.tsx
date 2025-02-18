import { ScrollView, Text, View } from 'react-native'
import { s } from './styles'
import { notifications } from '@/mocks'

export default function Notifications() {
	return (
		<ScrollView style={s.container}>
			{notifications.map((notification, index) => (
				<View style={s.card} key={index}>
					<Text style={s.title}>{notification.title}</Text>
					<Text style={s.description}>{notification.description}</Text>
				</View>
			))}
		</ScrollView>
	)
}
