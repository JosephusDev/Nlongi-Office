import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'
import { DEFAULT_STYLE } from '@/constants/styles'

export const s = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: colors.gray[200],
		borderRadius: DEFAULT_STYLE.radius,
		color: colors.gray[100],
		paddingVertical: 16,
		paddingHorizontal: 10,
		fontFamily: fontFamily.regular,
	},
	inputFocused: {
		color: colors.gray[100],
	},
})
