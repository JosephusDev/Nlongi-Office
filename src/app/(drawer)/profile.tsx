import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import Header from '@/components/Header'
import { s } from '@/styles/app/turmas'
import { Image, Pressable, Text, TextInput, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { update, updateImage } from '@/models/Usuario'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { Feather } from '@expo/vector-icons'
import MyModal from '@/components/MyModal'
import Button from '@/components/Button'
import { checkBiometricAvailability } from '@/utils/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '@/styles/colors'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { EmailSchema, Userschema } from '@/schema'
import { SchoolData, User } from '@/types'
import { useToast } from '@/context/ToastContext'

type typeClick = 'profile' | 'bio' | 'logout' | 'backup' | 'school'

export default function Profile() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(Userschema),
		context: { isSignUp: !true },
	})

	const {
		control: controlEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: errorEmail },
	} = useForm({
		resolver: yupResolver(EmailSchema),
		context: { isSignUp: !true },
	})

	const db = useSQLiteContext()
	const { user, signOut } = useAuth()
	const [imageUri, setImageUri] = useState<string | null>(user?.image ?? null)
	const [visible, setVisible] = useState(false)
	const [hasBio, setHasBio] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [typeClick, setTypeClick] = useState<typeClick>('profile')
	const [schoolData, setSchoolData] = useState<SchoolData>({
		nomeEscola: '',
		anoLetivo: '',
	})
	const { showToast } = useToast()

	// Carrega os dados da escola ao iniciar
	useEffect(() => {
		const loadSchoolData = async () => {
			const savedData = await AsyncStorage.getItem('@schoolData')
			if (savedData) {
				setSchoolData(JSON.parse(savedData))
			}
		}
		loadSchoolData()
	}, [])

	async function checkBiometric() {
		const available = await checkBiometricAvailability()
		if (!available) {
			showToast({
				title: 'Longi',
				message: 'Biometria não suportada',
				type: 'error',
			})
		} else {
			if (hasBio) {
				await AsyncStorage.setItem('@biometria', 'false')
				showToast({
					title: 'Longi',
					message: 'Biometria desativada com sucesso.',
					type: 'success',
				})
			} else {
				await AsyncStorage.setItem('@biometria', 'true')
				const jsonUser = JSON.stringify(user)
				await AsyncStorage.setItem('@user', jsonUser)
				showToast({
					title: 'Longi',
					message: 'Biometria ativada com sucesso.',
					type: 'success',
				})
			}
		}
		setVisible(false)
	}

	const imageUpload = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.canceled) {
			const localUri = result.assets[0].uri
			const filename = localUri.split('/').pop()
			if (!FileSystem.documentDirectory) {
				throw new Error('FileSystem.documentDirectory is null')
			}
			const newPath = FileSystem.documentDirectory + filename

			await FileSystem.moveAsync({
				from: localUri,
				to: newPath,
			})

			setImageUri(newPath)
			if (user?.id) {
				await updateImage(db, user.id, newPath)
			} else {
				console.error('User ID is undefined')
			}
		}
	}

	useEffect(() => {
		const getBio = async () => {
			const hasBio = await AsyncStorage.getItem('@biometria')
			if (hasBio === 'true') {
				setHasBio(true)
			}
		}
		getBio()
	}, [])

	const handleClickOption = async (title: string, description: string, type: typeClick) => {
		setTypeClick(type)
		setTitle(title)
		setDescription(description)
		setVisible(true)
	}

	const updateProfile = async (data: Omit<User, 'image'>) => {
		if (!data) {
			showToast({
				title: 'Longi',
				message: 'Preencha todos os campos.',
				type: 'error',
			})
			return
		}
		const new_user = { ...user, usuario: data.usuario, senha: data.senha }
		const jsonUser = JSON.stringify(new_user)
		await AsyncStorage.setItem('@user', jsonUser)
		await update(db, new_user).then(() => {
			showToast({
				title: 'Longi',
				message: 'Informações atualizadas com sucesso.',
				type: 'success',
			})
			signOut()
		})
	}

	const sendBackup = async (data: { email?: string }) => {
		if (data) {
			console.log(data)
			showToast({
				title: 'Longi',
				message: 'Backup realizado com sucesso, verifique seu email',
				type: 'success',
			})
		}
		setVisible(false)
	}

	const saveSchoolData = async () => {
		try {
			const jsonData = JSON.stringify(schoolData)
			await AsyncStorage.setItem('@schoolData', jsonData)
			showToast({
				title: 'Longi',
				message: 'Dados da escola salvos com sucesso.',
				type: 'success',
			})
			setVisible(false)
		} catch (error) {
			showToast({
				title: 'Longi',
				message: 'Erro ao salvar dados da escola.',
				type: 'error',
			})
		}
	}

	const onConfirmModal = () => {
		switch (typeClick) {
			case 'logout':
				signOut()
				break
			case 'bio':
				checkBiometric()
				break
			case 'profile':
				handleSubmit(updateProfile)()
				break
			case 'backup':
				handleSubmitEmail(sendBackup)()
				break
			case 'school':
				saveSchoolData()
				break
			default:
				break
		}
	}

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				<Header title='Meu Perfil' />
				<View style={s.containerProfile}>
					<Pressable style={{ width: 80 }} onPress={imageUpload}>
						<Image
							style={s.avatarProfile}
							source={
								imageUri
									? { uri: imageUri }
									: user?.genero === 'M'
										? require('@/assets/images/icon.png')
										: require('@/assets/images/professora.png')
							}
						/>
						<View style={s.containerIconImage}>
							<Feather name='camera' color={'#FFFFFF'} size={15} />
						</View>
					</Pressable>
					<Text style={s.username}>{user?.nome}</Text>
					<Text style={s.subtitle}>Defina aqui as configurções da conta</Text>

					<Pressable onPress={() => handleClickOption('Editar Perfil', '', 'profile')}>
						<View style={s.containerOption}>
							<View style={s.right}>
								<View style={s.containerIcon}>
									<Feather name='user' size={18} />
								</View>
								<Text style={s.description}>Editar Perfil</Text>
							</View>
							<Feather name='chevron-right' size={18} />
						</View>
					</Pressable>

					{/* Novo botão para Dados da Escola */}
					<Pressable onPress={() => handleClickOption('Dados da Escola', '', 'school')}>
						<View style={s.containerOption}>
							<View style={s.right}>
								<View style={s.containerIcon}>
									<Feather name='book' size={18} />
								</View>
								<Text style={s.description}>Dados da Escola</Text>
							</View>
							<Feather name='chevron-right' size={18} />
						</View>
					</Pressable>

					<Pressable
						onPress={() => {
							if (hasBio) {
								handleClickOption('Autenticação', 'Deseja desativar o Login com Biometria?', 'bio')
							} else {
								handleClickOption('Autenticação', 'Deseja ativar o Login com Biometria?', 'bio')
							}
						}}
					>
						<View style={s.containerOption}>
							<View style={s.right}>
								<View style={s.containerIcon}>
									<Feather name='lock' size={18} />
								</View>
								<Text style={s.description}>Login com Biometria</Text>
							</View>
							<Feather name='chevron-right' size={18} />
						</View>
					</Pressable>

					<Pressable onPress={() => handleClickOption('Backup', 'Deseja realizar a cópia de segurança?', 'backup')}>
						<View style={s.containerOption}>
							<View style={s.right}>
								<View style={s.containerIcon}>
									<Feather name='database' size={18} />
								</View>
								<Text style={s.description}>Backup & Cópia de segurança</Text>
							</View>
							<Feather name='chevron-right' size={18} />
						</View>
					</Pressable>

					<Pressable onPress={() => handleClickOption('Terminar sessão', 'Tem certeza que deseja sair?', 'logout')}>
						<View style={s.containerOption}>
							<View style={s.right}>
								<View style={s.containerIcon}>
									<Feather name='log-out' size={18} color={colors.red.base} />
								</View>
								<Text style={s.description}>Terminar Sessão</Text>
							</View>
							<Feather name='chevron-right' size={18} />
						</View>
					</Pressable>
				</View>
				<MyModal title={title} visible={visible} onClose={() => setVisible(false)}>
					{description && <Text style={s.descriptionModal}>{description}</Text>}
					{typeClick === 'profile' && (
						<View style={{ width: '100%', marginTop: -10 }}>
							<Text style={s.label}>Utilizador</Text>
							<View style={[s.inputContainer, errors.usuario && { borderColor: colors.red.base }, { marginTop: 5 }]}>
								<Feather name='user' size={20} color={colors.gray[100]} />
								<Controller
									control={control}
									name='usuario'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={s.input}
											placeholder='Digite o utilizador'
											onChangeText={onChange}
											onBlur={onBlur}
											value={value ?? user?.usuario}
										/>
									)}
								/>
							</View>
							{errors.usuario && <Text style={s.error}>{errors.usuario.message?.toString()}</Text>}
							<Text style={s.label}>Palavra-passe</Text>
							<View style={[s.inputContainer, errors.senha && { borderColor: colors.red.base }, { marginTop: 5 }]}>
								<Feather name='lock' size={20} color={colors.gray[100]} />
								<Controller
									control={control}
									name='senha'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={s.input}
											placeholder='Digite a palavra-passe'
											onBlur={onBlur}
											onChangeText={onChange}
											value={value ?? user?.senha}
											secureTextEntry={true}
										/>
									)}
								/>
							</View>
							{errors.senha && <Text style={s.error}>{errors.senha.message?.toString()}</Text>}
						</View>
					)}
					{typeClick === 'backup' && (
						<View style={{ width: '100%', marginTop: -5 }}>
							<Text style={s.label}>E-mail</Text>
							<View style={[s.inputContainer, errorEmail.email && { borderColor: colors.red.base }, { marginTop: 5 }]}>
								<Feather name='mail' size={20} color={colors.gray[100]} />
								<Controller
									control={controlEmail}
									name='email'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={s.input}
											placeholder='Digite o e-mail para o backup'
											onChangeText={onChange}
											onBlur={onBlur}
										/>
									)}
								/>
							</View>
							{errorEmail.email && <Text style={s.error}>{errorEmail.email.message?.toString()}</Text>}
						</View>
					)}
					{typeClick === 'school' && (
						<View style={{ width: '100%', marginTop: -10 }}>
							<Text style={s.label}>Nome da Escola</Text>
							<View style={[s.inputContainer, { marginTop: 5 }]}>
								<Feather name='home' size={20} color={colors.gray[100]} />
								<TextInput
									style={s.input}
									placeholder='Digite o nome da escola'
									onChangeText={text => setSchoolData({ ...schoolData, nomeEscola: text })}
									value={schoolData.nomeEscola}
								/>
							</View>
							<Text style={s.label}>Ano Letivo</Text>
							<View style={[s.inputContainer, { marginTop: 5 }]}>
								<Feather name='calendar' size={20} color={colors.gray[100]} />
								<TextInput
									style={s.input}
									placeholder='Digite o ano letivo (ex: 2023/2024)'
									onChangeText={text => setSchoolData({ ...schoolData, anoLetivo: text })}
									value={schoolData.anoLetivo}
								/>
							</View>
						</View>
					)}
					<Button onClick={onConfirmModal} title='Confirmar' icon={'check-circle'} style={{ height: 40 }} />
				</MyModal>
			</View>
		</DrawerSceneWrapper>
	)
}
