import { DrawerToggleButton } from '@react-navigation/drawer'
import { Text, View } from 'react-native'
import { s } from './styles'

type HeaderProps = {
	title: string
	showButton?: boolean
}

export default function Header({ title, showButton = true }: HeaderProps) {
	return (
		<View style={s.header}>
			<Text style={s.title}>{title}</Text>
			{showButton && <DrawerToggleButton />}
		</View>
	)
}
