import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import { s } from '@/styles/app/turmas'
import { Alert, FlatList, Text, TextInput, ToastAndroid, View, Vibration } from 'react-native'
import { colors } from '@/styles/colors'
import { useEffect, useState } from 'react'
import { ITurma } from '@/types'
import EmptyList from '@/components/EmptyList'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import { create, getTurmas, deleteTurma, update } from '@/models/Turma'
import MyModal from '@/components/MyModal'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TurmaSchema } from '@/schema'
import Button from '@/components/Button'
import { useSQLiteContext } from 'expo-sqlite'
import { useToast } from '@/context/ToastContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { IconTrash } from '@tabler/icons-react-native'

export default function Turmas() {
	const db = useSQLiteContext()
	const [turmas, setTurmas] = useState<ITurma[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [selected, setSelected] = useState<ITurma | null>(null)
	const [search, setSearch] = useState('')
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
	const { showToast } = useToast()
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(TurmaSchema),
	})

	useEffect(() => {
		carregarTurmas()
	}, [])

	const carregarTurmas = async () => {
		try {
			const result = await getTurmas(db)
			setTurmas(result)
		} catch (error) {
			ToastAndroid.show('Erro ao carregar turmas', ToastAndroid.SHORT)
			console.error(error)
		}
	}

	const onSubmit = async (data: Pick<ITurma, 'nome'>) => {
		if (selected?.id) {
			const result = await update(db, selected.id, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Turma atualizada com sucesso',
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
		reset()
		setSelected(null)
	}

	const onDelete = (id: number) => {
		Vibration.vibrate(50)
		setSelectedItemId(id)
		setIsDeleteModalOpen(true)
	}

	const handleConfirmDelete = async () => {
		if (selectedItemId) {
			const result = await deleteTurma(db, selectedItemId)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Turma removida com sucesso',
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
			setSelectedItemId(null)
			setIsDeleteModalOpen(false)
		}
	}

	const turmasFiltradas = search ? turmas.filter(turma => turma.nome.includes(search.toUpperCase())) : turmas

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
				<FlatList
					data={turmasFiltradas}
					keyExtractor={item => item.id.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => handleOpenModal(item)}
							onLongPress={() => onDelete(item.id)}
						>
							<View style={s.listItem}>
								<Text ellipsizeMode='tail' numberOfLines={1} style={s.listItemText}>
									{item.nome}
								</Text>
							</View>
						</TouchableOpacity>
					)}
					ListHeaderComponent={<View style={{ marginTop: 20 }}></View>}
					ListEmptyComponent={<EmptyList title='Nenhuma turma encontrada.' />}
				/>
				<MyModal title='Adicionar Turma' visible={isOpen} onClose={() => setIsOpen(false)}>
					<View style={{ flex: 0, width: '100%', marginTop: 10 }}>
						<Text style={s.labelModal}>Digite a Classe ou o Curso</Text>
						<View style={[s.inputContainer, errors.nome && { borderColor: colors.red.base }]}>
							<Controller
								control={control}
								name='nome'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										style={s.input}
										placeholder='Ex.: 10ª classe - Bioquímica'
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
				<MyModal
					title={<IconTrash size={30} color={colors.red.base} />}
					visible={isDeleteModalOpen}
					onClose={() => {
						setIsDeleteModalOpen(false)
						setSelectedItemId(null)
					}}
				>
					<View style={{ flex: 0, width: '100%', marginTop: 10 }}>
						<Text style={[s.labelModal, { width: '100%', textAlign: 'center' }]}>Deseja remover essa Turma?</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
						<Button
							title='Cancelar'
							onClick={() => {
								setIsDeleteModalOpen(false)
								setSelectedItemId(null)
							}}
							style={{ borderRadius: 8, flex: 1, marginRight: 10, backgroundColor: colors.gray[400] }}
						/>
						<Button
							title='Confirmar'
							onClick={handleConfirmDelete}
							style={{ borderRadius: 8, flex: 1, marginLeft: 10, backgroundColor: colors.red.base }}
						/>
					</View>
				</MyModal>
			</View>
		</DrawerSceneWrapper>
	)
}
