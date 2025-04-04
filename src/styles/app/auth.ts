import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'
import { DEFAULT_STYLE } from '@/constants/styles'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: colors.light,
		paddingTop: 50,
	},
	containerIconHome: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 100,
		borderColor: colors.red.base,
		width: 80,
		height: 80,
		marginBottom: 20,
	},
	image: {
		width: 80,
		height: 80,
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		fontFamily: fontFamily.bold,
		marginBottom: 20,
	},
	subtitle: {
		fontSize: 15,
		fontFamily: fontFamily.bold,
		paddingHorizontal: 30,
		marginTop: 15,
		marginBottom: 15,
		textAlign: 'center',
	},
	label: {
		marginTop: 5,
		fontFamily: fontFamily.semiBold,
		color: colors.gray[400],
		marginHorizontal: 30,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: DEFAULT_STYLE.radius,
		marginHorizontal: 30,
		height: 45,
		paddingHorizontal: 8,
		marginTop: 5,
		borderColor: colors.gray[400],
		gap: 5,
	},
	input: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		flex: 1,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30,
		gap: 5,
	},
	titleLink: {
		color: colors.gray[400],
		fontFamily: fontFamily.regular,
		fontSize: 15,
		textAlign: 'center',
	},
	link: {
		color: colors.gray[100],
		fontFamily: fontFamily.bold,
		fontSize: 15,
		textAlign: 'center',
	},
	genero: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		color: colors.gray[500],
	},
	error: {
		color: colors.red.base,
		fontSize: 13,
		marginTop: 5,
		marginHorizontal: 30,
		fontFamily: fontFamily.regular,
	},
})
