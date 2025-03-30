import { fontFamily } from '@/styles/font-family'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	selector: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		backgroundColor: 'white',
		width: '100%',
	},
	text: {
		fontSize: 14,
		fontFamily: fontFamily.regular,
		color: '#333',
	},
	placeholder: {
		color: '#999',
	},
	arrow: { color: '#666' },
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
		color: '#007AFF',
	},
	closeButton: {
		padding: 15,
		alignItems: 'center',
	},
	closeText: {
		color: '#007AFF',
		fontSize: 16,
		fontFamily: fontFamily.bold,
	},
})
