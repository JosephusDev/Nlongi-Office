import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { s } from './styles'
import Button from '../Button'
import Select from '../Select'
import { trimestres } from '@/mocks'
import { useEffect, useState } from 'react'
import { IAlunoNotas, ITurma, SchoolData } from '@/types'
import { getDisciplinas } from '@/models/Disciplina'
import { useSQLiteContext } from 'expo-sqlite'
import { getTurmas } from '@/models/Turma'
import TableFlatList from '../TableFlatList'
import MyModal from '../MyModal'
import EmptyList from '../EmptyList'
import { getMiniPauta } from '@/models/Nota'
import { calculateAverage } from '@/utils/functions'
import { useToast } from '@/context/ToastContext'
import FilterButton from '../FilterButton'
import * as Print from 'expo-print'
import { Asset } from 'expo-asset'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '@/context/AuthContext'
const asset = Asset.fromModule(require('@/assets/images/insignia.png'))

export default function MiniPautas() {
	const db = useSQLiteContext()
	const { user } = useAuth()
	const { showToast } = useToast()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [turmas, setTurmas] = useState<ITurma[]>([])
	const [notas, setNotas] = useState<IAlunoNotas[]>([])
	const [visible, setVisible] = useState(false)

	// Estados para armazenar os filtros selecionados
	const [selectedTurma, setSelectedTurma] = useState(0)
	const [selectedDisciplina, setSelectedDisciplina] = useState(0)
	const [selectedTrimestre, setSelectedTrimestre] = useState('')

	const columns = [
		{ key: 'nome', label: 'NOME', width: 200 },
		{ key: 'mac', label: 'MAC', width: 100 },
		{ key: 'pp', label: 'PP', width: 100 },
		{ key: 'pt', label: 'PT', width: 100 },
		{ key: 'mt', label: 'MT', width: 100 },
	]

	const carregarTurmas = async () => {
		const result = await getTurmas(db)
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
		setVisible(false)
		if (result.length === 0) {
			showToast({
				title: 'Longi',
				message: 'Nenhuma nota cadastrada',
				type: 'info',
			})
		}
	}

	const handleExport = async () => {
		// Filtra os dados para incluir apenas nome, mac, pp e pt
		const filteredNotas = notas.map(({ nome, mac, pp, pt }) => ({ nome, mac, pp, pt }))

		// Obter os dados da escola
		const savedData = await AsyncStorage.getItem('@schoolData')
		const schoolData: SchoolData = savedData ? JSON.parse(savedData) : {}

		const disciplina = disciplinas.find(d => d.id === selectedDisciplina)?.nome
		const turma = turmas.find(t => t.id === selectedTurma)?.nome

		// Gera o HTML dinamicamente com os dados filtrados
		const html = `
			<html>
				<head>
					<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
					<style>
						p {
							font-size: 15px; 
							font-family: Helvetica Neue; 
							font-weight: normal;
							margin: 10px 0;
						}
						strong {
							font-size: 15px; 
							font-family: Helvetica Neue; 
							font-weight: bold;
							margin: 20px 0;
							display: block;
						}
						.table-container {
							display: flex;
							justify-content: center;
							margin-top: 30px;
						}
						table {
							width: 90vw;
							border-collapse: collapse;
						}
						th, td {
							border: 1px solid gray;
							padding: 4px;
							text-align: center;
							font-family: Helvetica Neue;
							font-size: 12px;
							height: 20px;
						}
						th {
							font-weight: bold;
						}
						img {
							width: 5vw;
						}
						th:nth-child(1), td:nth-child(1) { width: 30px; }
						th:nth-child(3), td:nth-child(3) { width: 30px; }
						th:nth-child(4), td:nth-child(4) { width: 30px; }
						th:nth-child(5), td:nth-child(5) { width: 30px; }
						th:nth-child(6), td:nth-child(6) { width: 30px; }
						.info-container {
							display: flex;
							flex-wrap: wrap;
							justify-content: space-between;
							margin: 40px auto 0;
							width: 90vw;
							gap: 10px;
						}
						.info-box {
							display: flex;
							flex-direction: column;
							gap: 8px;
						}
						.info-item {
							font-family: Helvetica Neue;
							font-size: 13px;
							text-align: left;
						}
						.info-label {
							font-weight: bold;
						}
					</style>
				</head>
				<body style="text-align: center;"> 
					<img
						src=${asset.localUri ?? asset.uri}
						alt="Insígnia"
					/>    
					<p>REPÚBLICA DE ANGOLA</p>
					<p>MINISTÉRIO DA EDUCAÇÃO</p>
					<p>${schoolData.nomeEscola.toUpperCase()}</p>
					<strong>PAUTA TRIMESTRAL DOS ALUNOS MATRICULADOS NO ANO LECTIVO ${schoolData.anoLetivo}</strong>
					
					<div class="info-container">
						<div class="info-box">
							<div class="info-item">
								<span class="info-label">DISCIPLINA:</span> <span>${disciplina?.toUpperCase()}</span>
							</div>
							<div class="info-item">
								<span class="info-label">TURMA:</span> <span>${turma?.toUpperCase()}</span>
							</div>
						</div>
						<div class="info-box">
							<div class="info-item">
								<span class="info-label">PERIODO:</span> <span>${selectedTrimestre}º Trimestre</span>
							</div>
							<div class="info-item">
								<span class="info-label">PROFESSOR(A):</span> <span>${user?.nome?.toUpperCase()}</span>
							</div>
						</div>
					</div>
					
					<div class="table-container">
						<table>
							<thead>
								<tr>
									<th>Nº</th>
									<th>NOME COMPLETO</th>
									<th>MAC</th>
									<th>PP</th>
									<th>PT</th>
									<th>MT</th>
								</tr>
							</thead>
							<tbody>
								${filteredNotas
									.map(
										(student, idx) => `
									<tr>
										<td>${idx + 1}</td>
										<td>${student.nome}</td>
										<td>${student.mac}</td>
										<td>${student.pp}</td>
										<td>${student.pt}</td>
										<td>${((student.mac + student.pp + student.pt) / 3).toFixed(2)}</td>
									</tr>
								`,
									)
									.join('')}
							</tbody>
						</table>
					</div>
				</body>
				</html>
		`

		// Imprime o HTML gerado
		await Print.printAsync({ html, orientation: Print.Orientation.portrait })
	}

	useEffect(() => {
		carregarDisciplinas()
		carregarTurmas()
	}, [])
	return (
		<SafeAreaView style={s.container}>
			<FilterButton onPress={() => setVisible(true)} />
			{notas.length === 0 ? (
				<EmptyList title='Nenhuma pauta disponível.' />
			) : (
				<View>
					<TableFlatList columns={columns} data={notas} />
					<Button title='Exportar' icon='share' onClick={handleExport} />
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
