import { View, StyleSheet, Dimensions, Text, Image } from 'react-native'
import LottieView from 'lottie-react-native'
import { colors } from '@/styles/colors'
import { StatusBar } from 'expo-status-bar'
import { Fragment, useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { fontFamily } from '@/styles/theme'
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
					loop={true}
					style={styles.animation}
				/>
			</View>
		</Fragment>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.red.base,
	},
	animation: {
		width: width * 0.6,
		height: height * 0.3,
	},
	logo: {
		width: width * 0.6,
		height: height * 0.1,
	},
	footer: {
		position: 'absolute',
		bottom: 50,
		width: '100%',
		alignItems: 'center',
		paddingBottom: 20,
	},
	footerText: {
		color: colors.light,
		textAlign: 'center',
		fontFamily: fontFamily.semiBold,
		fontSize: 18,
		marginTop: 10,
		marginBottom: 10,
	},
})
