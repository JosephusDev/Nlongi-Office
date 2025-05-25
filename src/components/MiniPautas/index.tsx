import { SafeAreaView, Text, View } from 'react-native'
import { s } from './styles'
import Button from '../Button'
import Select from '../Select'
import { useEffect, useState } from 'react'
import { IMiniPauta, ITurma, SchoolData } from '@/types'
import { getDisciplinas } from '@/models/Disciplina'
import { useSQLiteContext } from 'expo-sqlite'
import { getTurmas } from '@/models/Turma'
import TableFlatList from '../TableFlatList'
import MyModal from '../MyModal'
import EmptyList from '../EmptyList'
import { getMiniPauta } from '@/models/Nota'
import { useToast } from '@/context/ToastContext'
import FilterButton from '../FilterButton'
import * as Print from 'expo-print'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '@/context/AuthContext'
import { base64 } from '@/utils/consts'

export default function MiniPautas() {
	const db = useSQLiteContext()
	const { user } = useAuth()
	const { showToast } = useToast()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [turmas, setTurmas] = useState<ITurma[]>([])
	const [notas, setNotas] = useState<IMiniPauta[]>([])
	const [visible, setVisible] = useState(false)

	// Estados para armazenar os filtros selecionados
	const [selectedTurma, setSelectedTurma] = useState(0)
	const [selectedDisciplina, setSelectedDisciplina] = useState(0)

	const columns = [
		{ key: 'nome', label: 'NOME', width: 200 },
		{ key: 'mac1', label: 'MAC1', width: 100 },
		{ key: 'pp1', label: 'PP1', width: 100 },
		{ key: 'pt1', label: 'PT1', width: 100 },
		{ key: 'mt1', label: 'MT1', width: 100 },
		{ key: 'mac2', label: 'MAC2', width: 100 },
		{ key: 'pp2', label: 'PP2', width: 100 },
		{ key: 'pt2', label: 'PT2', width: 100 },
		{ key: 'mt2', label: 'MT2', width: 100 },
		{ key: 'mac3', label: 'MAC3', width: 100 },
		{ key: 'pp3', label: 'PP3', width: 100 },
		{ key: 'pt3', label: 'PT3', width: 100 },
		{ key: 'mt3', label: 'MT3', width: 100 },
		{ key: 'mediaGeral', label: 'MF', width: 100 },
		{ key: 'resultado', label: 'RESULTADO', width: 150 },
	]

	const carregarTurmas = async () => {
		const result = await getTurmas(db)
		setTurmas(result)
	}

	const carregarDisciplinas = async () => {
		const result = await getDisciplinas(db)
		setDisciplinas(result)
	}

	const handleFilter = async () => {
		const result = await getMiniPauta(db, selectedDisciplina, selectedTurma)
		const notasComMedias = result.map(nota => {
			const mt1 = (nota.mac1 + nota.pp1 + nota.pt1) / 3 || 0
			const mt2 = (nota.mac2 + nota.pp2 + nota.pt2) / 3 || 0
			const mt3 = (nota.mac3 + nota.pp3 + nota.pt3) / 3 || 0

			// Calcula a média geral apenas se houver pelo menos uma média trimestral
			const mediasTrimestrais = [mt1, mt2, mt3].filter(mt => mt > 0)
			const mediaGeral =
				mediasTrimestrais.length > 0
					? mediasTrimestrais.reduce((acc, curr) => acc + curr, 0) / mediasTrimestrais.length
					: 0

			const resultado = mediaGeral >= 10 ? 'APROVADO' : 'REPROVADO'

			return {
				...nota,
				mt1: mt1.toFixed(1),
				mt2: mt2.toFixed(1),
				mt3: mt3.toFixed(1),
				mediaGeral: mediaGeral.toFixed(1),
				resultado,
			}
		})
		setNotas(notasComMedias)
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
		try {
			// Obter os dados da escola
			const savedData = await AsyncStorage.getItem('@schoolData')
			const schoolData: SchoolData = savedData ? JSON.parse(savedData) : null
			if (!schoolData) {
				showToast({
					title: 'Erro',
					message: 'Preencha as informações da Escola nas configurações',
					type: 'error',
				})
				return
			}
			const insigniaBase64 = `data:image/jpeg;base64,${base64}`
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
						.negative-grade {
							color: red;
						}
						.approved {
							color: green;
							font-weight: bold;
						}
						.failed {
							color: red;
							font-weight: bold;
						}
						img {
							width: 5vw;
						}
						th:nth-child(1), td:nth-child(1) { width: 30px; }
						th:nth-child(2), td:nth-child(2) { width: 200px; }
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
          ${
						insigniaBase64 &&
						`
            <img
              src="${insigniaBase64}"
              alt="Insígnia"
              style="width: 50px; height: 50px;"
            />
          `
					}
          <p>REPÚBLICA DE ANGOLA</p>
					<p>MINISTÉRIO DA EDUCAÇÃO</p>
					<p>${schoolData.nomeEscola.toUpperCase()}</p>
					<strong>PAUTA ANUAL DOS ALUNOS MATRICULADOS NO ANO LECTIVO ${schoolData.anoLetivo}</strong>
					
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
									<th>MAC1</th>
									<th>PP1</th>
									<th>PT1</th>
									<th>MT1</th>
									<th>MAC2</th>
									<th>PP2</th>
									<th>PT2</th>
									<th>MT2</th>
									<th>MAC3</th>
									<th>PP3</th>
									<th>PT3</th>
									<th>MT3</th>
									<th>MF</th>
									<th>RESULTADO</th>
								</tr>
							</thead>
							<tbody>
								${notas
									.map(
										(student, idx) => `
									<tr>
										<td>${idx + 1}</td>
										<td>${student.nome}</td>
										<td class="${Number(student.mac1) < 10 ? 'negative-grade' : ''}">${Number(student.mac1).toString().padStart(2, '0')}</td>
										<td class="${Number(student.pp1) < 10 ? 'negative-grade' : ''}">${Number(student.pp1).toString().padStart(2, '0')}</td>
										<td class="${Number(student.pt1) < 10 ? 'negative-grade' : ''}">${Number(student.pt1).toString().padStart(2, '0')}</td>
										<td class="${Number(student.mt1) < 10 ? 'negative-grade' : ''}">${Number(student.mt1).toString().padStart(2, '0')}</td>
										<td class="${Number(student.mac2) < 10 ? 'negative-grade' : ''}">${Number(student.mac2).toString().padStart(2, '0')}</td>
										<td class="${Number(student.pp2) < 10 ? 'negative-grade' : ''}">${Number(student.pp2).toString().padStart(2, '0')}</td>
										<td class="${Number(student.pt2) < 10 ? 'negative-grade' : ''}">${Number(student.pt2).toString().padStart(2, '0')}</td>
										<td class="${Number(student.mt2) < 10 ? 'negative-grade' : ''}">${Number(student.mt2).toString().padStart(2, '0')}</td>
										<td class="${Number(student.mac3) < 10 ? 'negative-grade' : ''}">${Number(student.mac3).toString().padStart(2, '0')}</td>
										<td class="${Number(student.pp3) < 10 ? 'negative-grade' : ''}">${Number(student.pp3).toString().padStart(2, '0')}</td>
										<td class="${Number(student.pt3) < 10 ? 'negative-grade' : ''}">${Number(student.pt3).toString().padStart(2, '0')}</td>
										<td class="${Number(student.mt3) < 10 ? 'negative-grade' : ''}">${Number(student.mt3).toString().padStart(2, '0')}</td>
										<td class="${Number(student.mediaGeral) < 10 ? 'negative-grade' : ''}">${Number(student.mediaGeral).toString().padStart(2, '0')}</td>
										<td class="${student.resultado === 'APROVADO' ? 'approved' : 'failed'}">${student.resultado}</td>
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
			await Print.printAsync({ html, orientation: Print.Orientation.landscape })
		} catch (error) {
			console.log(error instanceof Error ? error.message : 'Erro ao exportar pauta')
			showToast({
				title: 'Erro',
				message: `Erro ao exportar pauta: ${error instanceof Error && error.message}`,
				type: 'error',
			})
		}
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
					<TableFlatList showHeader columns={columns} data={notas} />
					<Button title='Exportar' icon='share' onClick={handleExport} />
				</View>
			)}

			<MyModal title='Filtro de pesquisa' visible={visible} onClose={() => setVisible(false)}>
				<Text style={s.label}>Selecione a Turma</Text>
				<Select data={turmas} onChange={value => setSelectedTurma(Number(value))} />
				<Text style={s.label}>Selecione a Disciplina</Text>
				<Select data={disciplinas} onChange={value => setSelectedDisciplina(Number(value))} />
				<Button title='Filtrar' icon='search' style={s.btnFilter} onClick={handleFilter} />
			</MyModal>
		</SafeAreaView>
	)
}
