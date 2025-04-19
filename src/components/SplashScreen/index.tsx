import { View, StyleSheet, Dimensions, Text, Image } from 'react-native'
import LottieView from 'lottie-react-native'
import { colors } from '@/styles/colors'
import { StatusBar } from 'expo-status-bar'
import { Fragment, useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'

const { width, height } = Dimensions.get('window')

export const SplashScreenComponent = () => {
	useEffect(() => {
		async function handleNavigationBar() {
			await NavigationBar.setVisibilityAsync('hidden')
		}
		handleNavigationBar()

		return () => {
			NavigationBar.setVisibilityAsync('visible')
		}
	}, [])
	return (
		<Fragment>
			<StatusBar hidden />
			<View style={styles.container}>
				<Image source={require('@/assets/images/banner.png')} style={styles.logo} />
				<LottieView
					source={require('@/assets/lottie/rocket-splash.json')}
					autoPlay
					loop={false}
					style={styles.animation}
				/>
			</View>
		</Fragment>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.red.base,
	},
	animation: {
		width: width * 0.8,
		height: height * 0.4,
	},
	logo: {
		width: width * 0.8,
		height: height * 0.2,
	},
})
