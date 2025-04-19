import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'
import { DEFAULT_STYLE } from '@/constants/styles'

export const s = StyleSheet.create({
	card: {
		padding: 15,
		borderColor: colors.gray[200],
		backgroundColor: colors.light,
		borderWidth: 1,
		borderRadius: 10,
		justifyContent: 'center',
		width: '100%',
		marginTop: 20,
	},
	title: {
		fontSize: 15,
		fontFamily: fontFamily.bold,
		marginBottom: 10,
		color: colors.gray[500],
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	name: {
		fontSize: 16,
		fontFamily: fontFamily.regular,
		color: colors.gray[500],
		width: '60%',
	},
	inputNota: {
		width: 50,
		height: 50,
		borderWidth: 1,
		borderRadius: DEFAULT_STYLE.radius,
		textAlign: 'center',
		borderColor: colors.gray[300],
		fontSize: 15,
		fontFamily: fontFamily.regular,
	},
	header: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 5,
		borderBottomWidth: 1,
		borderBottomColor: colors.gray[300],
		marginBottom: 5,
	},
})
