import { DEFAULT_STYLE } from '@/constants/styles'
import { fontFamily, colors } from '@/styles/theme'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	alertContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderRadius: DEFAULT_STYLE.radius,
		marginTop: 20,
		marginBottom: 10,
		gap: 5,
	},
	alert: {
		color: colors.gray[400],
		fontSize: 13,
		fontFamily: fontFamily.regular,
	},
})
