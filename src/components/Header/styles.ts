import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	header: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 30,
	},
	title: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		color: colors.red.base,
		flex: 1,
	},
})
