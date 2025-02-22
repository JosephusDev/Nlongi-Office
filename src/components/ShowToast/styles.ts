import { fontFamily } from '@/styles/font-family'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	toastContainer: {
		margin: 10,
		padding: 16,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	toastWrapper: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	title: {
		fontSize: 16,
		fontFamily: fontFamily.bold,
		color: '#FFFFFF',
		marginBottom: 4,
	},
	message: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: '#FFFFFF',
	},
	progressContainer: {
		marginTop: 8,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#FFFFFF',
		opacity: 0.3,
	},
	progressBar: {
		height: '100%',
		borderRadius: 2,
		backgroundColor: '#FFFFFF',
	},
})
