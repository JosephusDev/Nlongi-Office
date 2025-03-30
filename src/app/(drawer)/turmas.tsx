import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import { s } from '@/styles/app/turmas'
import { Alert, Text, TextInput, ToastAndroid, View } from 'react-native'
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
import TableFlatList from '@/components/TableFlatList'
import { useToast } from '@/context/ToastContext'

export default function Turmas() {
	const db = useSQLiteContext()
	const [turmas, setTurmas] = useState<ITurma[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState<ITurma | null>(null)
	const [search, setSearch] = useState('')
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

	// Definição das colunas e seus tamanhos
	const columns = [{ key: 'Turma', label: 'Turma', width: 200 }]

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
					<TableFlatList
						columns={columns} // Colunas da tabela
						data={turmasFiltradas?.map(turma => ({
							id: turma.id,
							Turma: turmasFiltradas.find(_turma => turma.id === _turma.id)?.nome,
						}))}
						showActions={true}
						onEdit={id => handleOpenModal(turmas?.find(turma => turma.id === id))}
						onDelete={onDelete}
					/>
				)}
				<MyModal title='Adicionar Turma' visible={isOpen} onClose={() => setIsOpen(false)}>
					<View style={{ flex: 0, width: '100%' }}>
						<Text style={s.labelModal}>Digite a Classe e/ou o Curso</Text>
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
			</View>
		</DrawerSceneWrapper>
	)
}
