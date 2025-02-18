import { DrawerToggleButton } from '@react-navigation/drawer'
import { Text, View } from 'react-native'
import { s } from './styles'

type HeaderProps = {
	title: string
}

export default function Header({ title }: HeaderProps) {
	return (
		<View style={s.header}>
			<Text style={s.title}>{title}</Text>
			<DrawerToggleButton />
		</View>
	)
}
