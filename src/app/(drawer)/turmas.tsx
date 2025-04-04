import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import { s } from '@/styles/app/turmas'
import { Alert, FlatList, Text, TextInput, ToastAndroid, View } from 'react-native'
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
			await update(db, selected.id, data)
		} else {
			await create(db, data)
		}
		setIsOpen(false)
		carregarTurmas()
		reset()
		setSelected(null)
	}

	const onDelete = (id: number) => {
		Alert.alert('Remover', 'Deseja remover essa Turma?', [
			{
				text: 'Sim',
				onPress: async () => {
					await deleteTurma(db, id)
					carregarTurmas()
				},
			},
			{ text: 'Não', style: 'cancel' },
		])
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
						<View style={s.listItem}>
							<TouchableOpacity onPress={() => handleOpenModal(item)} onLongPress={() => onDelete(item.id)}>
								<Text ellipsizeMode='tail' numberOfLines={1} style={s.listItemText}>
									{item.nome}
								</Text>
							</TouchableOpacity>
						</View>
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
			</View>
		</DrawerSceneWrapper>
	)
}
