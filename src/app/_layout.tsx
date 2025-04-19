// hide warnings
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import * as SplashScreen from 'expo-splash-screen'
import {
	useFonts,
	Nunito_400Regular,
	Nunito_500Medium,
	Nunito_600SemiBold,
	Nunito_700Bold,
} from '@expo-google-fonts/nunito'

// Contextos
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

// Componentes
import BackButton from '@/components/BackButton'
import { SplashScreenComponent } from '@/components/SplashScreen'

// Utilitários
import { colors, fontFamily } from '@/styles/theme'
import { createUsuarioTable } from '@/services/database'

// Configuração inicial da splash screen
SplashScreen.preventAutoHideAsync()

export default function Layout() {
	// Estado para controle de carregamento de fontes
	const [fontsLoaded] = useFonts({
		Nunito_400Regular,
		Nunito_500Medium,
		Nunito_600SemiBold,
		Nunito_700Bold,
	})

	// Estado para controle de prontidão do app
	const [appIsReady, setAppIsReady] = useState(false)

	// Efeito para preparação inicial do app
	useEffect(() => {
		const prepareApp = async () => {
			try {
				// Esconde a splash screen nativa quando as fontes estiverem carregadas
				if (fontsLoaded) {
					await SplashScreen.hideAsync()
				}
				// Tempo mínimo da splash screen (3 segundos)
				await new Promise(resolve => setTimeout(resolve, 3000))
			} catch (error) {
				console.warn('Error during app preparation:', error)
			} finally {
				setAppIsReady(true)
			}
		}

		prepareApp()
	}, [fontsLoaded])

	// Mostra a splash screen personalizada enquanto carrega
	if (!fontsLoaded || !appIsReady) {
		return <SplashScreenComponent />
	}

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
									headerTitleStyle: {
										fontFamily: fontFamily.bold,
										color: '#FFFFFF',
										fontSize: 18,
									},
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
