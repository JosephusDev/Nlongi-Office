import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	header: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 7,
	},
	title: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		color: colors.red.base,
		flex: 1,
	},
})
