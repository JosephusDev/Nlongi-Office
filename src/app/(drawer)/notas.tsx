import { s } from '@/styles/app/notas'
import { ScrollView, Text, ToastAndroid, View } from 'react-native'
import Header from '@/components/Header'
import NotasList from '@/components/NotasList'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import { tipoProvas, trimestres } from '@/mocks'
import Select from '@/components/Select'
import { IAluno, INota, ITurma } from '@/types'
import { getTurmas } from '@/models/Turma'
import { getDisciplinas } from '@/models/Disciplina'
import { useSQLiteContext } from 'expo-sqlite'
import { createNota, getNotas } from '@/models/Nota'
import EmptyList from '@/components/EmptyList'
import { useNavigation } from 'expo-router'
import { getAlunos } from '@/models/Aluno'
import { useToast } from '@/context/ToastContext'

export default function Notas() {
	const db = useSQLiteContext()
	const { showToast } = useToast()
	const [alunos, setAlunos] = useState<IAluno[]>([])
	const [notas, setNotas] = useState<INota[]>([])
	const [turmas, setTurmas] = useState<ITurma[] | null>(null)
	const [disciplinas, setDisciplinas] = useState<ITurma[] | null>(null)

	// Estados para armazenar os filtros selecionados
	const [selectedTurma, setSelectedTurma] = useState<number | null>(null)
	const [selectedDisciplina, setSelectedDisciplina] = useState<number | null>(null)
	const [selectedTipoProva, setSelectedTipoProva] = useState<string | null>(null)
	const [selectedTrimestre, setSelectedTrimestre] = useState<string | null>(null)

	const carregarAlunos = async () => {
		try {
			const result = await getAlunos(db)
			setAlunos(result)
		} catch (error) {
			ToastAndroid.show('Erro ao carregar alunos', ToastAndroid.SHORT)
			console.error(error)
		}
	}

	const carregarTurmas = async () => {
		try {
			const result = await getTurmas(db)
			setTurmas(result)
		} catch (error) {
			ToastAndroid.show('Erro ao carregar turmas', ToastAndroid.SHORT)
			console.error(error)
		}
	}

	const carregarDisciplinas = async () => {
		try {
			const result = await getDisciplinas(db)
			setDisciplinas(result)
		} catch (error) {
			ToastAndroid.show('Erro ao carregar disciplinas', ToastAndroid.SHORT)
			console.error(error)
		}
	}

	const alunosFiltrados = selectedTurma ? alunos.filter(aluno => aluno.turma_id === selectedTurma) : alunos

	const handleNotaChange = (aluno_id: number, novaNota: string) => {
		setNotas(prevNotas => {
			const notaExistente = prevNotas.find(nota => nota.aluno_id === aluno_id)
			if (notaExistente) {
				return prevNotas.map(nota =>
					nota.aluno_id === aluno_id ? { ...nota, valor: parseFloat(novaNota) || 0 } : nota,
				)
			} else {
				return [
					...prevNotas,
					{
						aluno_id,
						valor: parseFloat(novaNota) || 0,
						periodo: selectedTrimestre,
						tipo: selectedTipoProva,
						disciplina_id: selectedDisciplina,
						turma_id: selectedTurma || 0,
					},
				]
			}
		})
	}

	const saveNotas = async () => {
		let error = false
		for (const nota of notas) {
			console.log(nota)
			const result = await createNota(db, nota)
			if (!result) {
				error = true
			}
		}
		setNotas([])
		if (error) {
			showToast({
				title: 'Longi',
				message: 'Erro ao cadastrar ao notas.',
				type: 'error',
			})
		} else {
			showToast({
				title: 'Longi',
				message: 'Notas cadastradas com sucesso.',
				type: 'success',
			})
		}
	}

	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			carregarTurmas()
			carregarDisciplinas()
			carregarAlunos()
		})

		return unsubscribe
	}, [navigation])

	return (
		<DrawerSceneWrapper>
			<ScrollView style={s.container}>
				<Header title='Gestão de Notas' />
				<View style={s.card}>
					<Text style={s.label}>Turma</Text>
					<Select data={turmas ?? []} onChange={value => setSelectedTurma(Number(value) || null)} />
					<Text style={s.label}>Disciplina</Text>
					<Select data={disciplinas ?? []} onChange={value => setSelectedDisciplina(Number(value) || null)} />
					<Text style={s.label}>Tipo de avaliação</Text>
					<Select data={tipoProvas} onChange={value => setSelectedTipoProva(value)} />
					<Text style={s.label}>Trimestre</Text>
					<Select data={trimestres} onChange={value => setSelectedTrimestre(value)} />
				</View>
				{alunosFiltrados.length === 0 ? (
					<EmptyList title='Nenhum aluno encontrado.' />
				) : (
					<NotasList alunos={alunosFiltrados} onNotaChange={handleNotaChange} />
				)}
				<Button onClick={saveNotas} style={s.button} icon='save' title='Guardar' />
			</ScrollView>
		</DrawerSceneWrapper>
	)
}
