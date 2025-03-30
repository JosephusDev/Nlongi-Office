import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '../theme'
import { DEFAULT_STYLE } from '@/constants/styles'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: colors.light,
	},
	card: {
		padding: 15,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		borderRadius: 10,
		width: '100%',
		marginTop: 20,
		height: 110,
	},
	flatList: {
		paddingTop: 10,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		borderRadius: 10,
		width: '100%',
		marginTop: 10,
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
	item: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginBottom: 10,
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
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: colors.gray[500],
		width: '55%',
	},
	label: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginBottom: 10,
	},
	labelModal: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginTop: 10,
		color: colors.gray[500],
	},
	toolbar: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 7,
	},
	subtitle: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		paddingHorizontal: 30,
		marginTop: 15,
		marginBottom: 15,
		textAlign: 'center',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: DEFAULT_STYLE.radius,
		height: 45,
		paddingHorizontal: 8,
		marginTop: 5,
		borderColor: '#ccc',
	},
	input: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		flex: 1,
		color: colors.gray[500],
	},
	error: {
		color: colors.red.base,
		fontSize: 13,
		marginTop: 5,
		fontFamily: fontFamily.regular,
		textAlign: 'left',
	},
})
