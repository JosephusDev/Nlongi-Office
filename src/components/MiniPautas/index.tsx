import { ScrollView, Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { s } from './styles'
import Button from '../Button'
import Select from '../Select'
import { disciplinas, trimestres } from '@/mocks'
import { useEffect, useState } from 'react'
import { ITurma } from '@/types'
import { getDisciplinas } from '@/models/Disciplina'
import { useSQLiteContext } from 'expo-sqlite'
import { showToast } from '../customToast'
import { useNavigation } from 'expo-router'
import { getTurmas } from '@/models/Turma'
export default function MiniPautas() {
	const db = useSQLiteContext()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [turmas, setTurmas] = useState<ITurma[]>([])

	const carregarTurmas = async () => {
		const result = await getTurmas(db)
		result.unshift({ id: 0, nome: 'Selecione a turma' })
		setTurmas(result)
		if (result.length === 0) {
			showToast({
				title: 'Longi',
				message: 'Nenhuma turma cadastrada',
				type: 'info',
			})
		}
	}

	const carregarDisciplinas = async () => {
		const result = await getDisciplinas(db)
		result.unshift({ id: 0, nome: 'Selecione a disciplina' })
		setDisciplinas(result)
		if (result.length === 0) {
			showToast({
				title: 'Longi',
				message: 'Nenhuma disciplina cadastrada',
				type: 'info',
			})
		}
	}

	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			carregarDisciplinas()
			carregarTurmas()
		})

		return unsubscribe
	}, [navigation])
	return (
		<ScrollView style={s.container}>
			<View style={s.card}>
				<Text style={s.label}>Selecione o Trimestre</Text>
				<Select data={trimestres} />
				<Text style={s.label}>Selecione a Disciplina</Text>
				<Select data={disciplinas} />
				<Text style={s.label}>Selecione a Turma</Text>
				<Select data={turmas} />
				<Button title='Visualizar' icon='search' style={s.btnPrint} />
			</View>
		</ScrollView>
	)
}
