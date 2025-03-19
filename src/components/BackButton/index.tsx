import { Pressable } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'

export default function BackButton() {
	return (
		<Pressable onPress={() => router.back()}>
			<Feather name='chevron-left' size={25} color={'#FFFFFF'} />
		</Pressable>
	)
}
