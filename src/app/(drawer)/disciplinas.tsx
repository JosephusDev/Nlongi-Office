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
import { create, getDisciplinas, deleteDisciplina, update } from '@/models/Disciplina'
import MyModal from '@/components/MyModal'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TurmaSchema } from '@/schema'
import Button from '@/components/Button'
import { useSQLiteContext } from 'expo-sqlite'
import TableFlatList from '@/components/TableFlatList'
import { useToast } from '@/context/ToastContext'

export default function Disciplinas() {
	const db = useSQLiteContext()
	const { showToast } = useToast()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
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
			ToastAndroid.show('Erro ao carregar disciplinas', ToastAndroid.SHORT)
			console.error(error)
		}
	}

	const onDelete = (id: number) => {
		Alert.alert('Remover', 'Deseja remover essa Disciplina?', [
			{
				text: 'Sim',
				onPress: async () => {
					const result = await deleteDisciplina(db, id)
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
				},
			},
			{
				text: 'Não',
				style: 'cancel',
			},
		])
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

	// Definição das colunas e seus tamanhos
	const columns = [{ key: 'Disciplina', label: 'Disciplina', width: 150 }]

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				<Header title='Gestão de Disciplinas' />
				<ToolBar
					onPressAdd={() => handleOpenModal()}
					valueSearch={search.toUpperCase()}
					onSearch={text => setSearch(text)}
				/>
				{disciplinasFiltradas?.length === 0 ? (
					<EmptyList title='Nenhuma disciplina encontrada.' />
				) : (
					<TableFlatList
						columns={columns} // Colunas da tabela
						data={disciplinasFiltradas?.map(disciplina => ({
							id: disciplina.id,
							Disciplina: disciplinasFiltradas.find(_disciplina => disciplina.id === _disciplina.id)?.nome,
						}))}
						showActions={true}
						onEdit={id => handleOpenModal(disciplinas?.find(disciplina => disciplina.id === id))}
						onDelete={onDelete}
					/>
				)}
				<MyModal title='Adicionar Disciplina' visible={isOpen} onClose={() => setIsOpen(false)}>
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
			</View>
		</DrawerSceneWrapper>
	)
}
