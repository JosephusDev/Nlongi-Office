import { colors, fontFamily } from '@/styles/theme'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	container: {
		padding: 20,
		borderWidth: 2,
		borderColor: '#F2F2F2',
		paddingBottom: 40,
		borderRadius: 10,
		marginTop: 15,
		justifyContent: 'center',
	},
	title: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginBottom: 10,
		textAlign: 'center',
	},
	labels: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.gray[400],
	},
	topLabels: {
		fontSize: 10,
		fontFamily: fontFamily.bold,
		color: colors.gray[400],
	},
})
