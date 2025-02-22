import { fontFamily } from '@/styles/font-family'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
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
	contentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	title: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		color: '#FFFFFF',
		marginBottom: 4,
	},
	message: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: '#FFFFFF',
	},
})
