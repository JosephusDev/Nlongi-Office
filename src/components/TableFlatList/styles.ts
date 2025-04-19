import { fontFamily } from '@/styles/font-family'
import { StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'

export const s = StyleSheet.create({
	main: {
		marginTop: 20,
		backgroundColor: colors.light,
		width: '100%',
		borderColor: colors.gray[200],
		borderWidth: 0.5,
		borderRadius: 8,
	},
	thead: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: colors.light,
	},
	th: {
		fontSize: 15,
		fontFamily: fontFamily.bold,
		textAlign: 'center',
		padding: 10,
	},
	tbody: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
		borderBottomColor: '#f2f2f2',
		borderBottomWidth: 1,
		borderRadius: 3,
		backgroundColor: '#fff',
	},
	td: {
		fontSize: 15,
		textAlign: 'center',
		padding: 10,
		fontFamily: fontFamily.regular,
	},
})
