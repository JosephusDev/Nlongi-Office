import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { s } from './styles'
import Button from '../Button'
import Select from '../Select'
import { trimestres } from '@/mocks'
import { useEffect, useState } from 'react'
import { IAlunoNotas, ITurma } from '@/types'
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
const asset = Asset.fromModule(require('@/assets/images/insignia.png'))

export default function MiniPautas() {
	const db = useSQLiteContext()
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
					.table-container {
						display: flex;
						justify-content: center;
						margin-top: 50px;
					}
					table {
						width: 90vw;
						border-collapse: collapse;
						margin-top: 50px;
					}
					th, td {
						border: 1px solid gray;
						padding: 4px; /* Reduz o padding para diminuir a altura */
						text-align: center;
						font-family: Helvetica Neue;
						font-size: 12px; /* Reduz o tamanho da fonte */
						height: 20px; /* Altura fixa para as células */
					}
					th {
						font-weight: bold;
					}
					img {
						width: 5vw;
					}
					/* Define larguras pequenas para as colunas específicas */
					th:nth-child(1), td:nth-child(1) { width: 30px; } /* Nº */
					th:nth-child(3), td:nth-child(3) { width: 30px; } /* MAC */
					th:nth-child(4), td:nth-child(4) { width: 30px; } /* PP */
					th:nth-child(5), td:nth-child(5) { width: 30px; } /* PT */
					th:nth-child(6), td:nth-child(6) { width: 30px; } /* MT */
				</style>
			</head>
			<body style="text-align: center;">
				<img
					src=${asset.localUri ?? asset.uri}
					alt="Insígnia"
				/>    
				<p>REPÚBLICA DE ANGOLA</p>
				<p>MINISTÉRIO DA EDUCAÇÃO</p>
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
