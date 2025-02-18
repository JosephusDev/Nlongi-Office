import { colors, fontFamily } from '@/styles/theme'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	container: {
		borderWidth: 2,
		borderColor: '#F2F2F2',
		paddingBottom: 40,
		borderRadius: 10,
		marginTop: 30,
		justifyContent: 'center',
		width: '100%',
	},
	title: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		marginBottom: 10,
		textAlign: 'center',
	},
	chart: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginTop: 24,
		width: '100%',
	},
	labels: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: colors.gray[400],
	},
	topLabels: {
		fontSize: 10,
		fontFamily: fontFamily.bold,
		color: colors.gray[400],
	},
	legendsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '50%',
	},
	legends: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: colors.gray[100],
		height: 20,
	},
	icon_legend: {
		height: 12,
		width: 12,
		borderRadius: 6,
		marginRight: 8,
	},
})
