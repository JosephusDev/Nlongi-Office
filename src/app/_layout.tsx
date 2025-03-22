import { colors, fontFamily } from '@/styles/theme'
import { useFonts, Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold, Rubik_700Bold } from '@expo-google-fonts/rubik'
import { Loading } from '@/components/Loading'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar, Text } from 'react-native'
import { AuthProvider } from '@/context/AuthContext'
import { SQLiteProvider } from 'expo-sqlite'
import { createUsuarioTable } from '@/services/database'
import { Stack } from 'expo-router'
import { ToastProvider } from '@/context/ToastContext'
import BackButton from '@/components/BackButton'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
})

export default function Layout() {
	const [fontsLoaded] = useFonts({
		Rubik_400Regular,
		Rubik_500Medium,
		Rubik_600SemiBold,
		Rubik_700Bold,
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
						<StatusBar barStyle={'light-content'} backgroundColor={colors.red.base} />
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
