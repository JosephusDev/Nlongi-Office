import { s } from '@/styles/app/alunos'
import { Alert, FlatList, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import { IconEdit, IconTrash } from '@tabler/icons-react-native'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
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
import { showToast } from '@/components/customToast'
import { useNavigation } from 'expo-router'

export default function Alunos() {
	const db = useSQLiteContext()
	const [alunos, setAlunos] = useState<IAluno[] | null>(null)
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

	const onSubmit = async (data: IAluno) => {
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
		// limpa os campos do formulario
		reset()
		// remove a seleção da turma
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
			result.unshift({
				id: 0,
				nome: 'Selecione a turma',
			})
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
			console.log(result)
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

	const alunosFiltrados = alunos?.filter(aluno => {
		const matchesSearch = search ? aluno.nome.toUpperCase().includes(search.toUpperCase()) : true
		const matchesTurma = selectedTurma ? aluno.turma_id === selectedTurma : true
		return matchesSearch && matchesTurma
	})

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
					<Select onChange={value => setSelectedTurma(Number(value))} data={turmas ?? []} />
				</View>
				{alunosFiltrados?.length === 0 ? (
					<EmptyList title='Nenhum aluno encontrado.' />
				) : (
					<View style={s.flatList}>
						<FlatList
							data={alunosFiltrados}
							keyExtractor={aluno => aluno.nome}
							renderItem={({ item: aluno }) => {
								return (
									<View key={aluno.id} style={s.item}>
										<View style={s.left}>
											<View style={s.avatar}>
												<Feather name='user' size={18} color={colors.gray[500]} />
											</View>
											<Text ellipsizeMode='tail' numberOfLines={1} style={s.name}>
												{formatName(aluno.nome)}
											</Text>
										</View>
										<View style={s.right}>
											<TouchableOpacity style={s.avatar} onPress={() => handleOpenModal(aluno)}>
												<IconEdit size={20} color={colors.gray[500]} />
											</TouchableOpacity>
											<TouchableOpacity style={s.avatar} onPress={() => onDelete(aluno.id ?? 0)}>
												<IconTrash size={20} color={colors.red.base} />
											</TouchableOpacity>
										</View>
									</View>
								)
							}}
						/>
					</View>
				)}
				<MyModal title='Adicionar Aluno' visible={isOpen} onClose={() => setIsOpen(false)}>
					<View style={{ flex: 0, width: '100%' }}>
						<Text style={s.labelModal}>Nome do aluno</Text>
						<View style={[s.inputContainer, errors.nome && { borderColor: colors.red.base }]}>
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
						<View
							style={[s.inputContainer, { paddingHorizontal: 0 }, errors.turma_id && { borderColor: colors.red.base }]}
						>
							<Controller
								control={control}
								name='turma_id'
								render={({ field: { onChange, onBlur, value } }) => (
									<Select
										style={{ borderRadius: 0, borderWidth: 0 }}
										onBlur={onBlur}
										data={turmas ?? []}
										onChange={onChange}
										value={value}
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
