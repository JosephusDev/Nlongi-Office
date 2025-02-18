import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#F2F2F2',
		width: '100%',
		borderRadius: 10,
		padding: 20,
		marginTop: 20,
		borderWidth: 2,
	},
	title: {
		color: colors.gray[400],
		fontFamily: fontFamily.bold,
		fontSize: 16,
		marginBottom: 10,
		marginTop: 10,
	},
})
