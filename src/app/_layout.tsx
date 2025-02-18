import { colors } from '@/styles/theme'
import { useFonts, Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold, Rubik_700Bold } from '@expo-google-fonts/rubik'
import { Loading } from '@/components/Loading'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'react-native'
import { AuthProvider } from '@/context/AuthContext'
import { SQLiteProvider } from 'expo-sqlite'
import { createUsuarioTable } from '@/services/database'
import Toast from 'react-native-toast-message'
import { Stack } from 'expo-router'

export default function Layout() {
	const [fontsLoaded] = useFonts({
		Rubik_400Regular,
		Rubik_500Medium,
		Rubik_600SemiBold,
		Rubik_700Bold,
	})

	if (!fontsLoaded) return <Loading />

	return (
		<SQLiteProvider databaseName='longi.db' onInit={createUsuarioTable}>
			<AuthProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<StatusBar barStyle={'light-content'} backgroundColor={colors.red.base} />
					<Stack
						screenOptions={{
							headerShown: false,
						}}
						initialRouteName='(auth)'
					>
						<Stack.Screen name='(auth)' />
						<Stack.Screen name='(private)/home' />
					</Stack>
					<Toast />
				</GestureHandlerRootView>
			</AuthProvider>
		</SQLiteProvider>
	)
}
