import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	container: {
		marginTop: 20,
		width: '100%',
	},
	card: {
		padding: 15,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		borderRadius: 10,
		justifyContent: 'center',
		width: '100%',
		marginTop: 20,
	},
	btnPrint: {
		borderRadius: 8,
		height: 40,
	},
	label: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginVertical: 10,
		width: '100%',
	},
	input: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		flex: 1,
		marginTop: 10,
	},
	option: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		color: colors.gray[500],
	},
	searchButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		borderColor: '#F2F2F2',
		borderWidth: 2,
		padding: 10,
		borderRadius: 8,
	},
	searchLabel: {
		fontFamily: fontFamily.bold,
		fontSize: 15,
		color: colors.gray[500],
	},
})
