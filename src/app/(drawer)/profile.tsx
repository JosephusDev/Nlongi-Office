import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import Header from '@/components/Header'
import { s } from '@/styles/app/turmas'
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native'
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
import { SchoolData, User } from '@/types'
import { useToast } from '@/context/ToastContext'
import { backupData, restoreData } from '@/services/backup'
import { Userschema, EmailSchema } from '@/schema'
import { login, signUp } from '@/services/supabase'
import { fontFamily } from '@/styles/font-family'

type typeClick = 'profile' | 'bio' | 'logout' | 'backup' | 'school' | 'restore'

export default function Profile() {
	const { user, signOut } = useAuth()
	const [isEmailVerified, setIsEmailVerified] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Omit<User, 'image'>>({
		resolver: yupResolver(Userschema),
		context: { isSignUp: !true },
		defaultValues: {
			usuario: user?.usuario,
			senha: user?.senha,
			email: user?.email,
		},
	})

	const {
		control: controlEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: errorEmail },
	} = useForm<{ email: string }>({
		resolver: yupResolver(EmailSchema),
		context: { userEmail: user?.email },
	})

	const db = useSQLiteContext()
	const [imageUri, setImageUri] = useState<string | null>(user?.image ?? null)
	const [visible, setVisible] = useState(false)
	const [hasBio, setHasBio] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [typeClick, setTypeClick] = useState<typeClick>('profile')
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingEmail, setIsLoadingEmail] = useState(false)
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

	useEffect(() => {
		const checkSupabaseUser = async () => {
			const isVerified = await login(user?.email!, user?.senha!)
			setIsEmailVerified(isVerified)
		}
		checkSupabaseUser()
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
		if (
			data.email === user?.email &&
			data.nome === user?.nome &&
			data.usuario === user?.usuario &&
			data.senha === user?.senha
		) {
			showToast({
				title: 'Longi',
				message: 'Nenhuma alteração foi feita.',
				type: 'success',
			})
			return
		}
		const new_user = { ...user, nome: data.nome, usuario: data.usuario, senha: data.senha, email: data.email }
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

	const handleVerifyEmail = async () => {
		if (!user?.email) {
			showToast({
				title: 'Longi',
				message: 'Defina um email para sua conta primeiro.',
				type: 'error',
			})
			return
		}

		try {
			setIsLoadingEmail(true)
			const data = await signUp(user.email, user.senha)
			if (data?.user) {
				console.log(data)
				await AsyncStorage.setItem(
					'@user_supabase',
					JSON.stringify({
						id: data.user.id,
						email: data.user.email,
						password: user.senha,
					}),
				)
				setVisible(false)
				showToast({
					title: 'Longi',
					message: 'Verifique seu email para confirmar a conta.',
					type: 'success',
				})
			}
		} catch (error) {
			console.log(error)
			showToast({
				title: 'Longi',
				message: 'Erro ao criar conta. Tente novamente.',
				type: 'error',
			})
		} finally {
			setIsLoadingEmail(false)
		}
	}

	const sendBackup = async () => {
		if (!isEmailVerified) {
			showToast({
				title: 'Longi',
				message: 'Seu email precisa estar verificado.',
				type: 'error',
			})
			return
		}

		if (user?.email) {
			setIsLoading(true)
			try {
				await backupData(db, user.email)
				showToast({
					title: 'Longi',
					message: 'Backup realizado com sucesso.',
					type: 'success',
				})
			} catch (error) {
				showToast({
					title: 'Longi',
					message: error instanceof Error ? error.message : 'Erro ao realizar backup.',
					type: 'error',
				})
			} finally {
				setIsLoading(false)
			}
		}
		setVisible(false)
	}

	const handleRestore = async (data: { email: string }) => {
		if (!isEmailVerified) {
			showToast({
				title: 'Longi',
				message: 'Seu email precisa estar verificado.',
				type: 'error',
			})
			return
		}

		setIsLoading(true)
		try {
			await restoreData(db, data.email)
			showToast({
				title: 'Longi',
				message: 'Dados restaurados com sucesso.',
				type: 'success',
			})
		} catch (error) {
			showToast({
				title: 'Longi',
				message: error instanceof Error ? error.message : 'Erro ao restaurar dados.',
				type: 'error',
			})
		} finally {
			setIsLoading(false)
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
			case 'restore':
				handleSubmitEmail(handleRestore)()
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
				<Header title='Configurações' />
				<View style={s.containerProfile}>
					<Pressable style={{ width: 80 }} onPress={imageUpload}>
						<Image
							style={s.avatarProfile}
							source={imageUri ? { uri: imageUri } : require('@/assets/images/icon.png')}
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

					<Pressable
						onPress={() => handleClickOption('Restauração', 'Deseja restaurar os dados do backup?', 'restore')}
					>
						<View style={s.containerOption}>
							<View style={s.right}>
								<View style={s.containerIcon}>
									<Feather name='download' size={18} />
								</View>
								<Text style={s.description}>Restaurar Dados</Text>
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
							<Text style={s.label}>Nome Completo</Text>
							<View style={[s.inputContainer, errors.nome && { borderColor: colors.red.base }, { marginTop: 5 }]}>
								<Feather name='user' size={20} color={colors.gray[100]} />
								<Controller
									control={control}
									name='nome'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={s.input}
											placeholder='Digite o nome completo'
											onBlur={onBlur}
											onChangeText={onChange}
											value={value ?? user?.nome}
											autoComplete='off'
										/>
									)}
								/>
							</View>
							{errors.nome && <Text style={s.error}>{errors.nome.message?.toString()}</Text>}
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
											autoComplete='off'
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
											autoComplete='off'
										/>
									)}
								/>
							</View>
							{errors.senha && <Text style={s.error}>{errors.senha.message?.toString()}</Text>}
							<Text style={s.label}>E-mail</Text>
							<View style={[s.inputContainer, errors.email && { borderColor: colors.red.base }, { marginTop: 5 }]}>
								<Feather name='mail' size={20} color={colors.gray[100]} />
								<Controller
									control={control}
									name='email'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={s.input}
											placeholder='Digite o e-mail'
											onBlur={onBlur}
											onChangeText={onChange}
											value={value ?? user?.email}
											autoComplete='off'
										/>
									)}
								/>
							</View>
							{errors.email && <Text style={s.error}>{errors.email.message?.toString()}</Text>}

							{isEmailVerified ? (
								<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
									<Feather name='check-circle' size={16} color={colors.green.base} />
									<Text style={{ color: colors.green.base, fontFamily: fontFamily.regular }}>Email verificado</Text>
								</View>
							) : (
								<Pressable onPress={handleVerifyEmail}>
									<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, marginBottom: 20 }}>
										<Feather name='alert-circle' size={16} color={colors.red.base} />
										<Text style={{ color: colors.red.base, fontFamily: fontFamily.regular }}>
											{isLoadingEmail ? 'Aguarde...' : 'Email não verificado. Clique para verificar'}
										</Text>
									</View>
								</Pressable>
							)}
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
											autoComplete='off'
										/>
									)}
								/>
							</View>
							{errorEmail.email && <Text style={s.error}>{errorEmail.email.message?.toString()}</Text>}
						</View>
					)}
					{typeClick === 'school' && (
						<View style={{ width: '100%', marginTop: 10 }}>
							<Text style={[s.label, { flex: 1, flexDirection: 'row' }]}>
								<Feather name='home' size={15} color={colors.gray[100]} />
								Nome da Escola
							</Text>
							<View
								style={[s.inputContainer, { marginTop: 5, height: 100, alignItems: 'flex-start', paddingVertical: 10 }]}
							>
								<TextInput
									style={s.input}
									placeholder='Digite o nome da escola'
									multiline={true}
									onChangeText={text => setSchoolData({ ...schoolData, nomeEscola: text })}
									value={schoolData.nomeEscola}
								/>
							</View>
							<Text style={[s.label, { flex: 1, flexDirection: 'row' }]}>
								<Feather name='calendar' size={15} color={colors.gray[100]} />
								Ano Letivo
							</Text>
							<View style={[s.inputContainer, { marginTop: 5 }]}>
								<TextInput
									style={s.input}
									placeholder='Digite o ano letivo (ex: 2023/2024)'
									onChangeText={text => setSchoolData({ ...schoolData, anoLetivo: text })}
									value={schoolData.anoLetivo}
								/>
							</View>
						</View>
					)}
					{typeClick === 'restore' && (
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
											placeholder='Digite o e-mail para restaurar os dados'
											onChangeText={onChange}
											onBlur={onBlur}
											autoComplete='off'
										/>
									)}
								/>
							</View>
							{errorEmail.email && <Text style={s.error}>{errorEmail.email.message?.toString()}</Text>}
						</View>
					)}
					<Button
						onClick={onConfirmModal}
						title={isLoading ? 'Aguarde...' : 'Confirmar'}
						icon={isLoading ? <ActivityIndicator color={colors.light} size={'small'} /> : 'check-circle'}
						style={{ height: 40, borderRadius: 8 }}
						disabled={isLoading}
					/>
				</MyModal>
			</View>
		</DrawerSceneWrapper>
	)
}
