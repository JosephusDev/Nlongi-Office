import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import { s } from '@/styles/app/turmas'
import { Alert, FlatList, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { useEffect, useState } from 'react'
import { ITurma } from '@/types'
import { IconEdit, IconTrash } from '@tabler/icons-react-native'
import EmptyList from '@/components/EmptyList'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import { create, getTurmas, deleteTurma, update } from '@/models/Turma'
import MyModal from '@/components/MyModal'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TurmaSchema } from '@/schema'
import Button from '@/components/Button'
import { useSQLiteContext } from 'expo-sqlite'
import { showToast } from '@/components/customToast'

export default function Turmas() {
	const db = useSQLiteContext()
	const [turmas, setTurmas] = useState<ITurma[] | undefined>(undefined)
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState<ITurma | null>(null)
	const [search, setSearch] = useState('')
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(TurmaSchema),
	})

	const onSubmit = async (data: ITurma) => {
		if (selected?.id) {
			const result = await update(db, selected.id, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Turma atualizado com sucesso',
					type: 'success',
				})
			} else {
				showToast({
					title: 'Longi',
					message: 'Erro ao atualizar turma',
					type: 'error',
				})
			}
		} else {
			const result = await create(db, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Turma cadastrada com sucesso',
					type: 'success',
				})
			} else {
				showToast({
					title: 'Longi',
					message: 'Erro ao cadastrar turma',
					type: 'error',
				})
			}
		}
		setIsOpen(false)
		carregarTurmas()
		// limpa os campos do formulario
		reset()
		// remove a seleção da turma
		setSelected(null)
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

	const onDelete = (id: number) => {
		Alert.alert('Remover', 'Deseja remover essa Turma?', [
			{
				text: 'Sim',
				onPress: async () => {
					const result = await deleteTurma(db, id)
					if (result) {
						showToast({
							title: 'Longi',
							message: 'Turma removido com sucesso',
							type: 'success',
						})
						carregarTurmas()
					} else {
						showToast({
							title: 'Longi',
							message: 'Erro ao remover turma',
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

	useEffect(() => {
		carregarTurmas()
	}, [])

	const turmasFiltradas = search ? turmas?.filter(turma => turma.nome.includes(search.toUpperCase())) : turmas

	const handleOpenModal = (turma?: ITurma) => {
		if (turma) {
			setSelected(turma)
			setValue('nome', turma.nome)
		} else {
			setSelected(null)
			reset()
		}
		setIsOpen(true)
	}

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				<Header title='Gestão de Turmas' />
				<ToolBar
					onPressAdd={() => handleOpenModal()}
					valueSearch={search.toUpperCase()}
					onSearch={text => setSearch(text)}
				/>
				{turmasFiltradas?.length === 0 ? (
					<EmptyList title='Nenhuma turma encontrada.' />
				) : (
					<View style={s.flatList}>
						<FlatList
							data={turmasFiltradas}
							keyExtractor={turma => turma.nome}
							renderItem={({ item: turma }) => {
								return (
									<View key={turma.id} style={s.item}>
										<View style={s.left}>
											<View style={s.avatar}>
												<Feather name='file-text' size={18} color={colors.gray[400]} />
											</View>
											<Text ellipsizeMode='tail' numberOfLines={1} style={s.name}>
												{turma.nome}
											</Text>
										</View>
										<View style={s.right}>
											<TouchableOpacity onPress={() => handleOpenModal(turma)} style={s.avatar}>
												<IconEdit size={20} color={colors.gray[400]} />
											</TouchableOpacity>
											<TouchableOpacity onPress={() => onDelete(turma.id ?? 0)} style={s.avatar}>
												<IconTrash size={20} color={colors.red.base} />
											</TouchableOpacity>
										</View>
									</View>
								)
							}}
						/>
					</View>
				)}
				<MyModal title='Adicionar Turma' visible={isOpen} onClose={() => setIsOpen(false)}>
					<View style={{ flex: 0, width: '100%' }}>
						<Text style={s.labelModal}>Nome da turma</Text>
						<View style={[s.inputContainer, errors.nome && { borderColor: colors.red.base }]}>
							<Controller
								control={control}
								name='nome'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										style={s.input}
										placeholder='Ex.: Informática 10ª'
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
						</View>
						{errors.nome && <Text style={s.error}>{errors.nome.message?.toString()}</Text>}
					</View>
					<Button
						title='Confirmar'
						icon='check-circle'
						onClick={handleSubmit(onSubmit)}
						style={{ borderRadius: 8, marginTop: 30 }}
					/>
				</MyModal>
			</View>
		</DrawerSceneWrapper>
	)
}
