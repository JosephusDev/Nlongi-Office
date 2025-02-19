import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { s } from './styles'
import Button from '../Button'
import Select from '../Select'
import { trimestres } from '@/mocks'
import { useEffect, useState } from 'react'
import { IAlunoNotas, ITurma } from '@/types'
import { getDisciplinas } from '@/models/Disciplina'
import { useSQLiteContext } from 'expo-sqlite'
import { showToast } from '../customToast'
import { getTurmas } from '@/models/Turma'
import TableFlatList from '../TableFlatList'
import MyModal from '../MyModal'
import { IconSearch } from '@tabler/icons-react-native'
import { colors } from '@/styles/colors'
import EmptyList from '../EmptyList'
import { getMiniPauta } from '@/models/Nota'
import { calculateAverage } from '@/utils/functions'
export default function MiniPautas() {
	const db = useSQLiteContext()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [turmas, setTurmas] = useState<ITurma[]>([])
	const [notas, setNotas] = useState<IAlunoNotas[]>([])
	const [visible, setVisible] = useState(false)

	// Estados para armazenar os filtros selecionados
	const [selectedTurma, setSelectedTurma] = useState(0)
	const [selectedDisciplina, setSelectedDisciplina] = useState(0)
	const [selectedTrimestre, setSelectedTrimestre] = useState('')

	const columns = [
		{ key: 'NOME', label: 'NOME', width: 200 },
		{ key: 'MAC', label: 'MAC', width: 100 },
		{ key: 'PP', label: 'PP', width: 100 },
		{ key: 'PT', label: 'PT', width: 100 },
		{ key: 'MT', label: 'MT', width: 100 },
	]

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

	const handleFilter = async () => {
		const result = await getMiniPauta(db, selectedTrimestre, selectedDisciplina, selectedTurma)

		setNotas(calculateAverage(result))
		if (result.length === 0) {
			showToast({
				title: 'Longi',
				message: 'Nenhuma nota cadastrada',
				type: 'info',
			})
		}
		setVisible(false)
	}

	useEffect(() => {
		carregarDisciplinas()
		carregarTurmas()
	}, [])
	return (
		<SafeAreaView style={s.container}>
			<Pressable style={s.searchButton} onPress={() => setVisible(true)}>
				<IconSearch color={colors.gray[500]} size={20} />
				<Text style={s.searchLabel}>Clique para filtrar</Text>
			</Pressable>
			{notas.length === 0 ? (
				<EmptyList title='Nenhuma pauta disponível.' />
			) : (
				<View>
					<TableFlatList columns={columns} data={notas} />
					<Button title='Exportar' icon='share' />
				</View>
			)}

			<MyModal title='Filtro de pesquisa' visible={visible} onClose={() => setVisible(false)}>
				<Text style={s.label}>Selecione a Turma</Text>
				<Select data={turmas} onChange={value => setSelectedTurma(Number(value))} />
				<Text style={s.label}>Selecione o Trimestre</Text>
				<Select data={trimestres} onChange={value => setSelectedTrimestre(value)} />
				<Text style={s.label}>Selecione a Disciplina</Text>
				<Select data={disciplinas} onChange={value => setSelectedDisciplina(Number(value))} />
				<Button title='Filtrar' icon='search' style={s.btnFilter} onClick={handleFilter} />
			</MyModal>
		</SafeAreaView>
	)
}
