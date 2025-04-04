import { fontFamily, colors } from '@/styles/theme'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		marginBottom: 80,
	},
	title: {
		fontSize: 18,
		fontFamily: fontFamily.bold,
		color: colors.gray[500],
		textAlign: 'center',
		marginBottom: 10,
	},
	chart: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},
	legendsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 10,
	},
	icon_legend: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 5,
	},
	legends: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: colors.gray[600],
	},
	topLabels: {
		fontSize: 12,
		fontFamily: fontFamily.bold,
		color: colors.gray[500],
	},
})
