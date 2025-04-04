import { s } from '@/styles/app/alunos'
import { Alert, Text, TextInput, View } from 'react-native'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import ToolBar from '@/components/ToolBar'
import Header from '@/components/Header'
import { formatName } from '@/utils/functions'
import Select from '@/components/Select'
import { useEffect, useState } from 'react'
import { getTurmas } from '@/models/Turma'
import { IAluno, ITurma } from '@/types'
import { create, deleteAluno, getAlunos, update } from '@/models/Aluno'
import EmptyList from '@/components/EmptyList'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlunoSchema } from '@/schema'
import MyModal from '@/components/MyModal'
import Button from '@/components/Button'
import { useSQLiteContext } from 'expo-sqlite'
import { router, useNavigation } from 'expo-router'
import TableFlatList from '@/components/TableFlatList' // Importando o componente de tabela
import { useToast } from '@/context/ToastContext'
import CustomWarning from '@/components/CustomWarning'

export default function Alunos() {
	const db = useSQLiteContext()
	const { showToast } = useToast()
	const [alunos, setAlunos] = useState<IAluno[]>([])
	const [turmas, setTurmas] = useState<ITurma[] | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState<IAluno | null>(null)
	const [selectedTurma, setSelectedTurma] = useState(0)
	const [search, setSearch] = useState('')

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(AlunoSchema),
	})

	const onSubmit = async (data: Pick<IAluno, 'nome'>) => {
		if (selected?.id) {
			const result = await update(db, selected.id, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Aluno atualizado com sucesso',
					type: 'success',
				})
			} else {
				showToast({
					title: 'Longi',
					message: 'Erro ao atualizar aluno',
					type: 'error',
				})
			}
		} else {
			const result = await create(db, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Aluno cadastrado com sucesso',
					type: 'success',
				})
			} else {
				showToast({
					title: 'Longi',
					message: 'Este aluno já existe',
					type: 'error',
				})
			}
		}
		setIsOpen(false)
		carregarAlunos()
		reset()
		setSelected(null)
	}

	const onDelete = (id: number) => {
		Alert.alert('Remover', 'Deseja remover esse Aluno?', [
			{
				text: 'Sim',
				onPress: async () => {
					const result = await deleteAluno(db, id)
					if (result) {
						showToast({
							title: 'Longi',
							message: 'Aluno removido com sucesso',
							type: 'success',
						})
						carregarAlunos()
					} else {
						showToast({
							title: 'Longi',
							message: 'Erro ao remover aluno',
							type: 'error',
						})
					}
				},
			},
			{
				text: 'Não',
				style: 'cancel',
			},
		])
	}

	const carregarTurmas = async () => {
		try {
			const result = await getTurmas(db)
			result.unshift({ id: 0, nome: 'Todas as turmas' })
			setTurmas(result)
		} catch (error) {
			showToast({
				title: 'Longi',
				message: 'Erro ao carregar turmas',
				type: 'error',
			})
			console.error(error)
		}
	}

	const carregarAlunos = async () => {
		const result = await getAlunos(db)
		if (result) {
			setAlunos(result)
		} else {
			showToast({
				title: 'Longi',
				message: 'Erro ao carregar alunos',
				type: 'error',
			})
		}
	}

	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			carregarTurmas()
			carregarAlunos()
		})

		return unsubscribe
	}, [navigation])

	const alunosFiltrados =
		search || selectedTurma
			? alunos?.filter(aluno => {
					const matchesSearch = search ? aluno.nome.toUpperCase().includes(search.toUpperCase()) : true
					const matchesTurma = selectedTurma ? aluno.turma_id === selectedTurma : true
					return matchesSearch && matchesTurma
				})
			: alunos

	const handleOpenModal = (aluno?: IAluno) => {
		if (aluno) {
			setSelected(aluno)
			setValue('nome', aluno.nome)
			setValue('turma_id', aluno.turma_id ?? 0)
		} else {
			setSelected(null)
			reset()
		}
		setIsOpen(true)
	}

	// Definição das colunas e seus tamanhos
	const columns = [{ key: 'Nome', label: 'NOME', width: 200 }]

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				<Header title='Gestão de Alunos' />
				<ToolBar
					onPressAdd={() => handleOpenModal()}
					onSearch={text => setSearch(text)}
					valueSearch={search.toUpperCase()}
				/>
				<View style={s.card}>
					<Text style={s.label}>Selecione a Turma</Text>
					<Select value={selectedTurma} onChange={value => setSelectedTurma(Number(value))} data={turmas ?? []} />
				</View>
				{alunosFiltrados?.length === 0 ? (
					<EmptyList title='Nenhum aluno encontrado.' />
				) : (
					<View>
						<TableFlatList
							columns={columns}
							data={alunosFiltrados?.map(aluno => ({
								id: aluno.id,
								Nome: formatName(aluno.nome),
								//Turma: turmas?.find(turma => turma.id === aluno.turma_id)?.nome || 'N/A',
							}))}
							showActions={true}
							onEdit={id => handleOpenModal(alunos?.find(aluno => aluno.id === id))}
							onDelete={onDelete}
							onPress={id =>
								router.navigate(`/(stack)/aluno/${id.toString()}/${alunos?.find(aluno => aluno.id === id)?.nome}`)
							}
						/>
						<CustomWarning message='Clique para ver o desempenho do aluno.' />
					</View>
				)}
				<MyModal title='Adicionar Aluno' visible={isOpen} onClose={() => setIsOpen(false)}>
					<View style={{ flex: 0, width: '100%' }}>
						<Text style={s.labelModal}>Nome</Text>
						<View style={s.inputContainer}>
							<Controller
								control={control}
								name='nome'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										style={s.input}
										placeholder='Ex.: Ana Maria'
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
						</View>
						{errors.nome && <Text style={s.error}>{errors.nome.message?.toString()}</Text>}
					</View>
					<View style={{ flex: 0, width: '100%' }}>
						<Text style={s.labelModal}>Turma</Text>
						<View style={{ paddingHorizontal: 0 }}>
							<Controller
								control={control}
								name='turma_id'
								render={({ field: { onChange, value } }) => (
									<Select
										data={turmas ?? []}
										value={value} // Garante que o valor selecionado é refletido corretamente
										onChange={selectedValue => {
											setSelectedTurma(Number(selectedValue)) // Atualiza o estado local
											onChange(Number(selectedValue)) // Atualiza o react-hook-form
										}}
									/>
								)}
							/>
						</View>
						{errors.turma_id && <Text style={s.error}>{errors.turma_id.message?.toString()}</Text>}
					</View>
					<Button
						title='Confirmar'
						icon='check-circle'
						onClick={handleSubmit(onSubmit)}
						style={{ borderRadius: 8, marginTop: 30, height: 40 }}
					/>
				</MyModal>
			</View>
		</DrawerSceneWrapper>
	)
}
