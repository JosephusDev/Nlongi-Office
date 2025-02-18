import { colors } from '@/styles/colors'
import { StyleSheet } from 'react-native'

export const s = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 30,
	},
	header: {
		width: '100%',
		flexDirection: 'row',
	},
	back: {
		backgroundColor: colors.red.base,
		padding: 12,
		height: 42,
		width: 42,
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
	},
	option: {
		flex: 1,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		gap: 7,
	},
})
