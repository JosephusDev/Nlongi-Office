import { ActivityIndicator } from 'react-native'
import { s } from './styles'
import { colors } from '@/styles/theme'

export function Loading() {
	return <ActivityIndicator size={'large'} style={s.container} color={colors.red.base} />
}
