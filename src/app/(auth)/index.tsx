import { Text, View, TextInput, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import { s } from '@/styles/app/auth'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/Button'
import { IconEye, IconEyeOff, IconGenderMale } from '@tabler/icons-react-native'
import { colors } from '@/styles/colors'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '@/context/AuthContext'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Userschema } from '@/schema'
import { User } from '@/types'
import { Feather } from '@expo/vector-icons'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Redirect } from 'expo-router'
import AnimatedImageHome from '@/components/AnimatedImageHome'
export default function Auth() {
	const { signIn, signUp, isLoading, isAuthenticated } = useAuth()

	if (isAuthenticated) {
		return <Redirect href='/(drawer)/home' />
	}

	const bottomSheetRef = useRef<BottomSheet>(null)
	const [isPasswordVisible, setPasswordVisible] = useState(false)
	const [isLoginScreenVisible, setLoginScreenVisible] = useState(true)
	const snapPoints = useMemo(() => (isLoginScreenVisible ? ['60%', '60%'] : ['80%', '80%']), [isLoginScreenVisible])
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(Userschema),
		context: { isSignUp: !isLoginScreenVisible }, // Define o contexto para Yup separar as regras para SignIn e SignUp
	})

	const togglePasswordVisibility = () => {
		setPasswordVisible(prev => !prev)
	}

	const onSubmit = (data: Omit<User, 'image'>) => {
		if (isLoginScreenVisible) {
			signIn(data)
		} else {
			signUp(data).then(() => setLoginScreenVisible(true))
		}
	}

	async function handleAuthentication() {
		const hasBio = await AsyncStorage.getItem('@biometria')
		if (hasBio === 'true' && isLoginScreenVisible) {
			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Desbloqueie para utilizar o Nlongi Office',
			})

			if (result.success) {
				const jsonValue = await AsyncStorage.getItem('@user')
				const jsonUser = JSON.parse(jsonValue ?? '')
				console.log(jsonUser)
				onSubmit(jsonUser)
			}
		}
	}

	useEffect(() => {
		handleAuthentication()
	}, [])

	return (
		<View style={s.container}>
			<AnimatedImageHome />
			<Text style={s.title}>Nlongi Office</Text>
			<BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				keyboardBehavior='fillParent'
				enableDynamicSizing={false}
			>
				<BottomSheetView>
					<Text style={s.subtitle}>{isLoginScreenVisible ? 'Entre' : 'Crie uma conta'} para gerir suas turmas.</Text>
					{!isLoginScreenVisible && (
						<View>
							<Text style={s.label}>Nome Completo</Text>
							<View style={[s.inputContainer, errors.nome?.message && { borderColor: colors.red.base }]}>
								<Feather name='user-check' size={20} color={colors.gray[100]} />
								<Controller
									control={control}
									name='nome'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={s.input}
											placeholder='Digite o nome completo'
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
										/>
									)}
								/>
							</View>
							{errors.nome && <Text style={s.error}>{errors.nome.message?.toString()}</Text>}
							<Text style={s.label}>Gênero</Text>
							<View style={[s.inputContainer, errors.genero && { borderColor: colors.red.base }]}>
								<IconGenderMale size={20} color={colors.gray[100]} />
								<Controller
									control={control}
									name='genero'
									render={({ field: { onChange, onBlur, value } }) => (
										<Picker
											selectedValue={value}
											style={[s.input, { marginLeft: -12 }]}
											onValueChange={onChange}
											onBlur={onBlur}
										>
											<Picker.Item style={s.genero} label='Selecione o Gênero' value='' />
											<Picker.Item style={s.genero} label='Masculino' value='M' />
											<Picker.Item style={s.genero} label='Feminino' value='F' />
										</Picker>
									)}
								/>
							</View>
							{errors.genero && <Text style={s.error}>{errors.genero.message?.toString()}</Text>}
						</View>
					)}
					<Text style={s.label}>Utilizador</Text>
					<View style={[s.inputContainer, errors.usuario && { borderColor: colors.red.base }]}>
						<Feather name='user' size={20} color={colors.gray[100]} />
						<Controller
							control={control}
							name='usuario'
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									style={s.input}
									placeholder='Digite o utilizador'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
					</View>
					{errors.usuario && <Text style={s.error}>{errors.usuario.message?.toString()}</Text>}
					<Text style={s.label}>Palavra-passe</Text>
					<View style={[s.inputContainer, errors.senha && { borderColor: colors.red.base }]}>
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
									value={value}
									secureTextEntry={!isPasswordVisible}
								/>
							)}
						/>
						<TouchableOpacity onPress={togglePasswordVisibility}>
							{isPasswordVisible ? (
								<IconEyeOff size={20} color={colors.gray[100]} />
							) : (
								<IconEye size={20} color={colors.gray[100]} />
							)}
						</TouchableOpacity>
					</View>
					{errors.senha && <Text style={s.error}>{errors.senha.message?.toString()}</Text>}
					<Button
						disabled={isLoading}
						title={isLoginScreenVisible ? 'Entrar' : 'Criar conta'}
						icon={
							isLoading ? <ActivityIndicator color={colors.light} /> : isLoginScreenVisible ? 'log-in' : 'user-plus'
						}
						onClick={handleSubmit(onSubmit)}
					/>
					<View style={s.footer}>
						<Text style={s.titleLink}>{isLoginScreenVisible ? 'Não possui uma conta.' : 'Já possui uma conta.'}</Text>
						<Pressable onPress={() => setLoginScreenVisible(!isLoginScreenVisible)}>
							<Text style={s.link}>Clique aqui</Text>
						</Pressable>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</View>
	)
}
