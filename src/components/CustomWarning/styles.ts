import { DEFAULT_STYLE } from '@/constants/styles'
import { fontFamily, colors } from '@/styles/theme'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	alertContainer: {
		backgroundColor: colors.red.transparent,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderRadius: DEFAULT_STYLE.radius,
		marginTop: 20,
		marginBottom: 10,
		gap: 5,
		padding: 10,
	},
	alert: {
		color: colors.red.base,
		fontSize: 13,
		fontFamily: fontFamily.bold,
	},
})
