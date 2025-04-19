import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '../theme'
import { DEFAULT_STYLE } from '@/constants/styles'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: '#F2F2F2',
	},
	card: {
		padding: 15,
		borderColor: colors.gray[200],
		borderWidth: 1,
		borderRadius: 10,
		width: '100%',
		marginTop: 20,
		backgroundColor: colors.light,
	},
	label: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginVertical: 10,
		color: colors.gray[500],
	},
	flatList: {
		paddingTop: 10,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		borderRadius: 10,
		width: '100%',
		marginTop: 20,
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 7,
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: DEFAULT_STYLE.radius,
		height: 45,
		paddingHorizontal: 8,
		marginTop: 20,
		borderColor: colors.gray[400],
	},
	input: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		flex: 1,
	},
	error: {
		color: colors.red.base,
		fontSize: 13,
		marginTop: 5,
		fontFamily: fontFamily.regular,
		textAlign: 'left',
	},
	button: {
		marginBottom: 50,
	},
})
