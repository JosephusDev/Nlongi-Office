import { colors, fontFamily } from '@/styles/theme'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 15,
		alignItems: 'center',
	},
	card: {
		margin: 20,
		borderColor: '#F2F2F2',
		padding: 20,
		borderWidth: 2,
		paddingBottom: 40,
		borderRadius: 10,
		marginTop: 15,
		justifyContent: 'center',
		width: '100%',
	},
	title: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginBottom: 10,
		textAlign: 'center',
	},
	labels: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.gray[400],
	},
	centerLabel: {
		fontSize: 22,
		color: colors.light,
		fontFamily: fontFamily.bold,
	},
	centerLabelContent: {
		fontSize: 16,
		color: colors.light,
		fontFamily: fontFamily.regular,
	},
	legendContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	legend: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 5,
	},
	legendContent: {
		color: colors.gray[400],
		fontFamily: fontFamily.regular,
	},
	dot: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 10,
	},
})
