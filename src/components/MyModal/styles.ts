import { StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/styles/theme'

export const s = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.40)',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2, // Para Android
	},
	modalView: {
		width: '100%',
		backgroundColor: '#EDEDED',
		borderTopLeftRadius: 20, // Bordas arredondadas apenas na parte superior
		borderTopRightRadius: 20,
		padding: 25,
		alignItems: 'center',
		position: 'absolute',
		bottom: 0, // Mantendo no fundo da tela
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -3 }, // Sombra para diferenciar do fundo
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5, // Para Android
	},
	modalTitle: {
		textAlign: 'center',
		fontFamily: fontFamily.bold,
		fontSize: 18,
		marginBottom: 20,
		color: colors.gray[500],
	},
	modalSubtitle: {
		marginTop: 15,
		marginBottom: 15,
		textAlign: 'center',
		color: colors.gray[600],
		fontFamily: fontFamily.regular,
		fontSize: 12,
	},
	closeButton: {
		position: 'absolute',
		top: 10,
		right: 20,
	},
})
