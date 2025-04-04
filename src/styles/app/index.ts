import { StyleSheet } from 'react-native'
import { colors } from '../colors'
import { fontFamily } from '../font-family'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		paddingTop: 32,
		backgroundColor: colors.light,
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 7,
		marginTop: 30,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 50,
		borderColor: colors.gray[300],
		borderWidth: 1,
	},
	user: {
		flex: 1,
		justifyContent: 'center',
	},
	hi: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
	},
	username: {
		fontSize: 16,
		fontFamily: fontFamily.bold,
		color: colors.red.base,
	},
})
