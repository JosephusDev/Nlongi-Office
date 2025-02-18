import { Pressable, View } from 'react-native'
import { s } from './styles'
import { Feather } from '@expo/vector-icons'
import Option from '../Option'
import { useState } from 'react'
import { colors } from '@/styles/colors'
import ReportsComponent from '../Reports'
import MiniPautas from '../MiniPautas'
import { useAuth } from '@/context/AuthContext'
import Notifications from '../Notifications'
export default function NavBar() {
	const { signOut } = useAuth()
	const [option, setOption] = useState<'reports' | 'docs' | 'notifications'>('reports')

	return (
		<View style={s.container}>
			<View style={s.header}>
				<View style={s.option}>
					<Option
						isSelected={option === 'reports'}
						icon='pie-chart'
						title='Estatísticas'
						onPress={() => setOption('reports')}
					/>
					<Option
						isSelected={option === 'docs'}
						icon='file-text'
						title='Mini-Pautas'
						onPress={() => setOption('docs')}
					/>
					<Option
						isSelected={option === 'notifications'}
						icon='bell'
						title='Notificações'
						onPress={() => setOption('notifications')}
						badge={3}
					/>
				</View>
				<Pressable style={s.back} onPress={signOut}>
					<Feather name='log-out' size={18} color={colors.light} />
				</Pressable>
			</View>
			{option === 'reports' && <ReportsComponent />}
			{option === 'docs' && <MiniPautas />}
			{option === 'notifications' && <Notifications />}
		</View>
	)
}
