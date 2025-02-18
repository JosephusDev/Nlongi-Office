import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	button: {
		backgroundColor: colors.red.base,
		paddingVertical: 10,
		paddingHorizontal: 16,
		alignItems: 'center',
		borderRadius: 20,
		marginHorizontal: 30,
		marginTop: 20,
	},
	buttonText: {
		fontFamily: fontFamily.semiBold,
		fontSize: 16,
		color: colors.light,
		paddingHorizontal: 5,
	},
})
