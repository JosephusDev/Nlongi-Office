import { Text, View, TextInput, TouchableOpacity, Pressable, ActivityIndicator, Image, ScrollView } from 'react-native'
import { s } from '@/styles/app/auth'
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import { IconEye, IconEyeOff } from '@tabler/icons-react-native'
import { colors } from '@/styles/colors'
import { useAuth } from '@/context/AuthContext'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Userschema } from '@/schema'
import { User } from '@/types'
import { Feather } from '@expo/vector-icons'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'

export default function Auth() {
	const { signIn, signUp, isLoading } = useAuth()
	const [isPasswordVisible, setPasswordVisible] = useState(false)
	const [isLoginScreenVisible, setLoginScreenVisible] = useState(true)
	const animation = useRef<LottieView>(null)
	const nomeInputRef = useRef<TextInput>(null)
	const emailInputRef = useRef<TextInput>(null)
	const usuarioInputRef = useRef<TextInput>(null)
	const senhaInputRef = useRef<TextInput>(null)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Omit<User, 'image'>>({
		resolver: yupResolver(Userschema),
		context: { isSignUp: !isLoginScreenVisible },
	})

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
				promptMessage: 'Desbloqueie para entrar no Prof Office',
				biometricsSecurityLevel: 'strong',
				requireConfirmation: true,
				cancelLabel: 'Cancelar',
				fallbackLabel: 'Usar palavra-passe',
			})

			if (result.success) {
				const jsonValue = await AsyncStorage.getItem('@user')
				const jsonUser = JSON.parse(jsonValue ?? '')
				onSubmit(jsonUser)
			}
		}
	}

	useEffect(() => {
		handleAuthentication()
	}, [])

	const togglePasswordVisibility = () => {
		setPasswordVisible(prev => !prev)
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
			<View style={s.container}>
				<LottieView
					autoPlay
					ref={animation}
					loop={true}
					style={{
						width: 200,
						height: 200,
						backgroundColor: colors.light,
						alignSelf: 'center',
					}}
					source={require('@/assets/lottie/book.json')}
				/>
				<Image source={require('@/assets/images/banner_black.png')} style={s.logo} />
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
										placeholderTextColor={colors.gray[500]}
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										ref={nomeInputRef}
										autoComplete='off'
										returnKeyType='next'
										onSubmitEditing={() => emailInputRef.current?.focus()}
									/>
								)}
							/>
						</View>
						{errors.nome && <Text style={s.error}>{errors.nome.message?.toString()}</Text>}
						<Text style={s.label}>Email</Text>
						<View style={[s.inputContainer, errors.email?.message && { borderColor: colors.red.base }]}>
							<Feather name='mail' size={20} color={colors.gray[100]} />
							<Controller
								control={control}
								name='email'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										style={s.input}
										placeholder='Digite o email'
										placeholderTextColor={colors.gray[500]}
										onBlur={onBlur}
										onChangeText={onChange}
										value={value!}
										autoComplete='off'
										returnKeyType='next'
										onSubmitEditing={() => usuarioInputRef.current?.focus()}
										ref={emailInputRef}
									/>
								)}
							/>
						</View>
						{errors.email && <Text style={s.error}>{errors.email.message?.toString()}</Text>}
					</View>
				)}
				<Text style={[s.label, { marginTop: 15 }]}>Utilizador</Text>
				<View style={[s.inputContainer, errors.usuario && { borderColor: colors.red.base }]}>
					<Feather name='user' size={20} color={colors.gray[100]} />
					<Controller
						control={control}
						name='usuario'
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={s.input}
								placeholder='Digite o utilizador'
								placeholderTextColor={colors.gray[500]}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								autoComplete='off'
								returnKeyType='next'
								onSubmitEditing={() => senhaInputRef.current?.focus()}
								ref={usuarioInputRef}
							/>
						)}
					/>
				</View>
				{errors.usuario && <Text style={s.error}>{errors.usuario.message?.toString()}</Text>}
				<Text style={[s.label, { marginTop: 15 }]}>Palavra-passe</Text>
				<View style={[s.inputContainer, errors.senha && { borderColor: colors.red.base }]}>
					<Feather name='lock' size={20} color={colors.gray[100]} />
					<Controller
						control={control}
						name='senha'
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={s.input}
								placeholder='Digite a palavra-passe'
								placeholderTextColor={colors.gray[500]}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								autoComplete='off'
								secureTextEntry={!isPasswordVisible}
								returnKeyType='done'
								onSubmitEditing={handleSubmit(onSubmit)}
								ref={senhaInputRef}
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
					icon={isLoading ? <ActivityIndicator color={colors.light} /> : isLoginScreenVisible ? 'log-in' : 'user-plus'}
					onClick={handleSubmit(onSubmit)}
				/>
				<View style={s.footer}>
					<Text style={s.titleLink}>{isLoginScreenVisible ? 'Não possui uma conta.' : 'Já possui uma conta.'}</Text>
					<Pressable onPress={() => setLoginScreenVisible(!isLoginScreenVisible)}>
						<Text style={s.link}>Clique aqui</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	)
}
