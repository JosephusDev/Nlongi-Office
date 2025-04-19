import Header from '@/components/Header'
import { s } from '@/styles/app/turmas'
import { ScrollView, Text, TextInput, ToastAndroid, View } from 'react-native'
import { useEffect, useState } from 'react'
import { IAlunoNotas, ITurma } from '@/types'
import EmptyList from '@/components/EmptyList'
import { useSQLiteContext } from 'expo-sqlite'
import TableFlatList from '@/components/TableFlatList'
import { getNotasByAluno, updateNota } from '@/models/Nota'
import { useLocalSearchParams } from 'expo-router'
import { calculateAverage } from '@/utils/functions'
import MyModal from '@/components/MyModal'
import Select from '@/components/Select'
import Button from '@/components/Button'
import { getDisciplinas } from '@/models/Disciplina'
import { trimestres } from '@/mocks'
import ChartTrimestreDisciplina from '@/components/IndividualChart/TrimestreDisciplina'
import ChartGeral from '@/components/IndividualChart/Geral'
import FilterButton from '@/components/FilterButton'
import { useToast } from '@/context/ToastContext'
import CustomWarning from '@/components/CustomWarning'
import { colors } from '@/styles/colors'

export default function Aluno() {
	const {
		args: [id, nome],
	} = useLocalSearchParams()
	const db = useSQLiteContext()
	const { showToast } = useToast()
	const [notas, setNotas] = useState<IAlunoNotas[]>([])
	const [notasFiltradas, setNotasFiltradas] = useState<IAlunoNotas[]>([])
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [selectedRow, setSelectedRow] = useState<IAlunoNotas | undefined>(undefined)

	const [selectedDisciplina, setSelectedDisciplina] = useState(0)
	const [selectedTrimestre, setSelectedTrimestre] = useState('')
	const [visible, setVisible] = useState(false)
	const [visibleFirstChart, setVisibleFirstChart] = useState(false)
	const [visibleSecondChart, setVisibleSecondChart] = useState(true)
	const [visibleSelectedRow, setVisibleSelectedRow] = useState(false)

	// Estados temporários para os valores dos inputs
	const [tempMac, setTempMac] = useState('')
	const [tempPp, setTempPp] = useState('')
	const [tempPt, setTempPt] = useState('')

	const carregarNotas = async () => {
		try {
			const result = await getNotasByAluno(db, Number(id))
			setNotas(calculateAverage(result))
			setNotasFiltradas(calculateAverage(result))
		} catch (error) {
			console.error(error)
		}
	}

	const carregarDisciplinas = async () => {
		const result = await getDisciplinas(db)
		result.unshift({ id: 0, nome: 'Selecione a disciplina' })
		setDisciplinas(result)
	}

	const handleFilter = () => {
		if (selectedTrimestre == '4') {
			const result = notas.filter(nota => nota.disciplina_id === selectedDisciplina) || notas
			setNotasFiltradas(result)
			setVisibleFirstChart(true)
			setVisibleSecondChart(false)
		} else {
			const result =
				notas.filter(nota => nota.disciplina_id === selectedDisciplina && nota.periodo === selectedTrimestre) || notas
			setNotasFiltradas(result)
			setVisibleSecondChart(true)
			setVisibleFirstChart(false)
		}
		setVisible(false)
	}

	useEffect(() => {
		carregarNotas()
		carregarDisciplinas()
	}, [])

	// Atualiza os estados temporários quando a linha selecionada muda
	useEffect(() => {
		if (selectedRow) {
			setTempMac(selectedRow.mac.toString())
			setTempPp(selectedRow.pp.toString())
			setTempPt(selectedRow.pt.toString())
		}
	}, [selectedRow])

	// Função para atualizar o objeto selectedRow
	const handleConfirm = async () => {
		if (selectedRow) {
			const updatedRow = {
				...selectedRow,
				mac: parseFloat(tempMac),
				pp: parseFloat(tempPp),
				pt: parseFloat(tempPt),
			}
			setSelectedRow(updatedRow)
			setVisibleSelectedRow(false)
			// Aqui você pode adicionar a lógica para salvar as alterações no banco de dados
			let result1, result2, result3
			if (updatedRow.mac_id! > 0) {
				result1 = await updateNota(db, updatedRow.mac_id!, updatedRow.mac)
				if (result1) {
					showToast({
						title: 'Longi',
						message: 'MAC atualizado com sucesso.',
						type: 'success',
					})
				} else {
					showToast({
						title: 'Longi',
						message: 'Erro ao atualizar MAC.',
						type: 'error',
					})
				}
			}
			if (updatedRow.pp_id! > 0) {
				result2 = await updateNota(db, updatedRow.pp_id!, updatedRow.pp)
				if (result2) {
					showToast({
						title: 'Longi',
						message: 'PP atualizado com sucesso.',
						type: 'success',
					})
				} else {
					showToast({
						title: 'Longi',
						message: 'Erro ao atualizar PP.',
						type: 'error',
					})
				}
			}
			if (updatedRow.pt_id! > 0) {
				result3 = await updateNota(db, updatedRow.pt_id!, updatedRow.pt)
				if (result3) {
					showToast({
						title: 'Longi',
						message: 'PT atualizado com sucesso.',
						type: 'success',
					})
				} else {
					showToast({
						title: 'Longi',
						message: 'Erro ao atualizar PT.',
						type: 'error',
					})
				}
			}
			carregarNotas()
		}
	}

	// Definição das colunas e seus tamanhos
	const columns = [
		{ key: 'disciplina', label: 'DISCIPLINA', width: 400 },
		{ key: 'trimestre', label: 'TRIMESTRE', width: 120 },
		{ key: 'mac', label: 'MAC', width: 120 },
		{ key: 'pp', label: 'PP', width: 120 },
		{ key: 'pt', label: 'PT', width: 120 },
		{ key: 'mt', label: 'MT', width: 120 },
	]

	return (
		<ScrollView style={{ backgroundColor: '#F2F2F2' }}>
			<View style={s.container}>
				<Text style={s.title}>{nome}</Text>
				<FilterButton style={{ marginTop: 20 }} onPress={() => setVisible(true)} />
				{notasFiltradas?.length === 0 ? (
					<EmptyList title='Nenhuma nota encontrada.' />
				) : (
					<View>
						<TableFlatList
							columns={columns}
							data={notasFiltradas}
							onPress={(id, item) => {
								setVisibleSelectedRow(true)
								setSelectedRow(notasFiltradas.find(nota => nota === item))
							}}
							showHeader
						/>
						<CustomWarning message='Clique para alterar as notas.' />
						{visibleFirstChart && <ChartGeral data={notasFiltradas} />}
						{visibleSecondChart && <ChartTrimestreDisciplina data={notasFiltradas[0]} />}
					</View>
				)}

				<MyModal title='Filtro de pesquisa' visible={visible} onClose={() => setVisible(false)}>
					<Text style={s.label}>Selecione o Trimestre</Text>
					<Select data={trimestres} onChange={value => setSelectedTrimestre(value)} />
					<Text style={s.label}>Selecione a Disciplina</Text>
					<Select data={disciplinas} onChange={value => setSelectedDisciplina(Number(value))} />
					<Button title='Filtrar' icon='search' style={s.btnFilter} onClick={handleFilter} />
				</MyModal>
				<MyModal
					title={`${selectedRow?.disciplina} \n\n ${selectedRow?.trimestre} Trimestre`}
					visible={visibleSelectedRow}
					onClose={() => setVisibleSelectedRow(false)}
				>
					<View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, gap: 20 }}>
						{selectedRow?.mac_id && (
							<View style={s.containerNota}>
								<Text style={[s.label, { textAlign: 'center' }]}>MAC</Text>
								<TextInput style={s.inputNota} value={tempMac} onChangeText={setTempMac} />
							</View>
						)}
						{selectedRow?.pp_id && (
							<View style={s.containerNota}>
								<Text style={[s.label, { textAlign: 'center' }]}>PP</Text>
								<TextInput style={s.inputNota} value={tempPp} onChangeText={setTempPp} />
							</View>
						)}
						{selectedRow?.pt_id && (
							<View style={s.containerNota}>
								<Text style={[s.label, { textAlign: 'center' }]}>PT</Text>
								<TextInput style={s.inputNota} value={tempPt} onChangeText={setTempPt} />
							</View>
						)}
					</View>
					<Button title='Confirmar' icon='save' style={s.btnFilter} onClick={handleConfirm} />
				</MyModal>
			</View>
		</ScrollView>
	)
}
