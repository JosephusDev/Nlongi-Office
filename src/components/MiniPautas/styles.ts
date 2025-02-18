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
		marginTop: 20,
	},
	label: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginVertical: 10,
	},
	input: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		flex: 1,
		marginTop: 10,
	},
	option: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		color: colors.gray[500],
	},
	btnPrint: {
		borderRadius: 8,
		height: 40,
	},
})
