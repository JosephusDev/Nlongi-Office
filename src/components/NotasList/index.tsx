import { FlatList, Text, TextInput, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { s } from './styles'
import { colors } from '@/styles/colors'
import { formatName } from '@/utils/functions'
import { useRef } from 'react'
import { IAluno, INota } from '@/types'

export default function NotasList({
	alunos,
	onNotaChange,
}: {
	alunos: IAluno[]
	onNotaChange: (id: number, nota: string) => void
}) {
	const inputRefs = useRef<(TextInput | null)[]>([])

	return (
		<View style={s.card}>
			<View style={s.header}>
				<Text style={s.title}>Nome Completo</Text>
				<Text style={s.title}>Nota</Text>
			</View>
			<FlatList
				scrollEnabled={false}
				data={alunos}
				keyExtractor={item => item.id?.toString() ?? ''}
				renderItem={({ item, index }) => {
					return (
						<View style={s.row} key={index}>
							<View style={s.avatar}>
								<Feather name='user' size={18} color={colors.red.base} />
							</View>
							<Text ellipsizeMode='tail' numberOfLines={1} style={s.name}>
								{formatName(item.nome ?? '')}
							</Text>
							<TextInput
								ref={ref => (inputRefs.current[index] = ref)}
								style={s.inputNota}
								keyboardType='numeric'
								returnKeyType='next'
								onChangeText={text => onNotaChange(item.id!, text)}
								onSubmitEditing={() => {
									if (index < alunos.length - 1) {
										inputRefs.current[index + 1]?.focus()
									}
								}}
							/>
						</View>
					)
				}}
			/>
		</View>
	)
}
