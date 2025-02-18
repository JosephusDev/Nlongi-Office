import { colors } from '@/styles/colors'
import { fontFamily } from '@/styles/font-family'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F2F2F2',
		height: 42,
		padding: 5,
		borderRadius: 7,
		overflow: 'hidden',
		gap: 7,
	},
	title: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
	},
	containerIcon: {
		position: 'relative',
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	badgeContainer: {
		position: 'absolute',
		right: -4,
		top: -4,
		backgroundColor: colors.red.base,
		borderRadius: 10,
		width: 18,
		height: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	badgeText: {
		color: colors.light,
		fontSize: 12,
		fontFamily: fontFamily.bold,
	},
})
