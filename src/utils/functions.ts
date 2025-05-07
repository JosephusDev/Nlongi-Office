import { IAlunoNotas } from '@/types'
import * as LocalAuthentication from 'expo-local-authentication'

// Definition: Essa função recebe um nome e retorna o primeiro e último nome formatados.
export const formatName = (name: string) => {
	const [firstName, ...rest] = name.split(' ')
	const lastName = rest.pop() || ''
	return capitalizeName(`${firstName} ${lastName}`.trim())
}

export async function checkBiometricAvailability() {
	const isHardwareAvailable = await LocalAuthentication.hasHardwareAsync()
	const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
	const hasBiometrics = await LocalAuthentication.isEnrolledAsync()

	console.log('Hardware disponível:', isHardwareAvailable)
	console.log('Tipos suportados:', supportedAuthTypes)
	console.log('Usuário tem biometria cadastrada:', hasBiometrics)

	return isHardwareAvailable && hasBiometrics
}

// Função para calcular a média (MT)
export const calculateAverage = (data: IAlunoNotas[]): IAlunoNotas[] => {
	return data.map(item => {
		const average = (item.mac + item.pp + item.pt) / 3
		const result = { ...item, mt: parseFloat(average.toFixed(1)) }
		return result
	})
}

export const capitalizeText = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalizeName = (name: string) => {
	return name
		.split(' ')
		.map(value => capitalizeText(value))
		.join(' ')
		.trim()
}
