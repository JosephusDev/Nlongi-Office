import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import { s } from '@/styles/app/turmas'
import { FlatList, Text, TextInput, TouchableOpacity, View, Vibration } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { colors } from '@/styles/colors'
import { useEffect, useState } from 'react'
import { ITurma } from '@/types'
import { IconTrash } from '@tabler/icons-react-native'
import EmptyList from '@/components/EmptyList'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import { create, getDisciplinas, deleteDisciplina, update } from '@/models/Disciplina'
import MyModal from '@/components/MyModal'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TurmaSchema } from '@/schema'
import Button from '@/components/Button'
import { useSQLiteContext } from 'expo-sqlite'
import { useToast } from '@/context/ToastContext'

export default function Disciplinas() {
	const db = useSQLiteContext()
	const { showToast } = useToast()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [selected, setSelected] = useState<ITurma | null>(null)
	const [search, setSearch] = useState('')
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(TurmaSchema),
	})

	const onSubmit = async (data: Pick<ITurma, 'nome'>) => {
		if (selected?.id) {
			const result = await update(db, selected.id, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Disciplina atualizado com sucesso',
					type: 'success',
				})
			} else {
				showToast({
					title: 'Longi',
					message: 'Erro ao atualizar disciplina',
					type: 'error',
				})
			}
		} else {
			const result = await create(db, data)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Disciplina cadastrada com sucesso',
					type: 'success',
				})
			} else {
				showToast({
					title: 'Longi',
					message: 'Erro ao cadastrar disciplina',
					type: 'error',
				})
			}
		}
		setIsOpen(false)
		carregarDisciplinas()
		// limpa os campos do formulario
		reset()
		// remove a seleção da turma
		setSelected(null)
	}

	const carregarDisciplinas = async () => {
		try {
			const result = await getDisciplinas(db)
			setDisciplinas(result)
		} catch (error) {
			console.error(error)
		}
	}

	const onDelete = (id: number) => {
		Vibration.vibrate(50)
		setSelectedItemId(id)
		setIsDeleteModalOpen(true)
	}

	const handleConfirmDelete = async () => {
		if (selectedItemId) {
			const result = await deleteDisciplina(db, selectedItemId)
			if (result) {
				showToast({
					title: 'Longi',
					message: 'Disciplina removido com sucesso',
					type: 'success',
				})
				carregarDisciplinas()
			} else {
				showToast({
					title: 'Longi',
					message: 'Erro ao remover disciplina',
					type: 'error',
				})
			}
			setSelectedItemId(null)
			setIsDeleteModalOpen(false)
		}
	}

	useEffect(() => {
		carregarDisciplinas()
	}, [])

	const disciplinasFiltradas = search
		? disciplinas?.filter(disciplina => disciplina.nome.includes(search.toUpperCase()))
		: disciplinas

	const handleOpenModal = (disciplina?: ITurma) => {
		if (disciplina) {
			setSelected(disciplina)
			setValue('nome', disciplina.nome)
		} else {
			setSelected(null)
			reset()
		}
		setIsOpen(true)
	}

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				<Header title='Gestão de Disciplinas' />
				<ToolBar
					onPressAdd={() => handleOpenModal()}
					valueSearch={search.toUpperCase()}
					onSearch={text => setSearch(text)}
				/>
				<FlatList
					data={disciplinasFiltradas}
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
					ListEmptyComponent={<EmptyList title='Nenhuma disciplina encontrada.' />}
				/>
				<MyModal
					title={selected?.id ? 'Editar Disciplina' : 'Adicionar Disciplina'}
					visible={isOpen}
					onClose={() => setIsOpen(false)}
				>
					<View style={{ flex: 0, width: '100%' }}>
						<Text style={s.labelModal}>Nome</Text>
						<View style={[s.inputContainer, errors.nome && { borderColor: colors.red.base }]}>
							<Controller
								control={control}
								name='nome'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										style={s.input}
										placeholder='Ex.: Biologia'
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
						<Text style={[s.labelModal, { width: '100%', textAlign: 'center' }]}>Deseja remover essa Disciplina?</Text>
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
