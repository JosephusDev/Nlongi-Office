import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 10,
		width: '80%',
		height: 40,
		paddingHorizontal: 8,
		borderColor: colors.gray[200],
		marginTop: 20,
		gap: 5,
		backgroundColor: colors.light,
	},
	inputSearch: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		alignItems: 'center',
		borderRadius: 20,
		width: '95%',
		color: colors.gray[400],
	},
	toolbar: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 7,
	},
	addButton: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: colors.red.base,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
})
