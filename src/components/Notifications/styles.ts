import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	container: {
		marginTop: 20,
		width: '100%',
	},
	card: {
		padding: 15,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		borderRadius: 10,
		justifyContent: 'center',
		width: '100%',
		marginTop: 10,
	},
	title: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginBottom: 10,
	},
	description: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		textAlign: 'justify',
		color: colors.gray[500],
	},
})
