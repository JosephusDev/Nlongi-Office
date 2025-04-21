import { fontFamily } from '@/styles/font-family'
import { StyleSheet } from 'react-native'
import { colors } from '@/styles/theme'

export const styles = StyleSheet.create({
	selector: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		borderWidth: 1,
		borderColor: colors.gray[300],
		borderRadius: 8,
		backgroundColor: colors.light,
		width: '100%',
	},
	text: {
		fontSize: 14,
		fontFamily: fontFamily.bold,
		color: colors.gray[400],
	},
	placeholder: {
		color: colors.gray[400],
	},
	arrow: { color: colors.gray[400] },
	modalOverlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContainer: {
		backgroundColor: 'white',
		maxHeight: '60%',
	},
	modalTitle: {
		fontSize: 16,
		fontFamily: fontFamily.bold,
		margin: 20,
		textAlign: 'center',
	},
	option: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	selectedOption: {
		backgroundColor: '#f0f0f0',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	optionText: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
	},
	checkmark: {
		color: colors.red.base,
	},
	closeButton: {
		padding: 15,
		alignItems: 'center',
	},
	closeText: {
		color: colors.red.base,
		fontSize: 16,
		fontFamily: fontFamily.bold,
	},
})
