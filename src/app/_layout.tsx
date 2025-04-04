import { colors, fontFamily } from '@/styles/theme'
import {
	useFonts,
	Nunito_400Regular,
	Nunito_500Medium,
	Nunito_600SemiBold,
	Nunito_700Bold,
} from '@expo-google-fonts/nunito'
import { Loading } from '@/components/Loading'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from '@/context/AuthContext'
import { SQLiteProvider } from 'expo-sqlite'
import { createUsuarioTable } from '@/services/database'
import { Stack } from 'expo-router'
import { ToastProvider } from '@/context/ToastContext'
import BackButton from '@/components/BackButton'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
})

export default function Layout() {
	const [fontsLoaded] = useFonts({
		Nunito_400Regular,
		Nunito_500Medium,
		Nunito_600SemiBold,
		Nunito_700Bold,
	})

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) return <Loading />

	return (
		<SQLiteProvider databaseName='longi.db' onInit={createUsuarioTable}>
			<ToastProvider>
				<AuthProvider>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<StatusBar style='dark' />
						<Stack
							screenOptions={{
								headerShown: false,
							}}
							initialRouteName='(auth)'
						>
							<Stack.Screen name='(auth)' />
							<Stack.Screen name='(drawer)/home' />
							<Stack.Screen
								name='(stack)/aluno/[...args]'
								options={{
									headerShown: true,
									headerTitle: 'Desempenho individual',
									headerTitleStyle: { fontFamily: fontFamily.bold, color: '#FFFFFF', fontSize: 18 },
									headerTintColor: '#FFFFFF',
									headerStyle: {
										backgroundColor: colors.red.base,
									},
									headerTitleAlign: 'center',
									headerLeft: () => <BackButton />,
								}}
							/>
						</Stack>
					</GestureHandlerRootView>
				</AuthProvider>
			</ToastProvider>
		</SQLiteProvider>
	)
}
