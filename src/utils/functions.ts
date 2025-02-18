import * as LocalAuthentication from 'expo-local-authentication'

// Definition: Essa função recebe um nome e retorna o primeiro e último nome formatados.
export const formatName = (name: string) => {
	const [firstName, ...rest] = name.split(' ')
	const lastName = rest.pop() || ''
	return `${firstName} ${lastName}`.trim()
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
