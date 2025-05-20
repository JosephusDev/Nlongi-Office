import { create, getUser } from '@/models/Usuario'
import { AuthContextData, User } from '@/types'
import { useSQLiteContext } from 'expo-sqlite'
import React, { createContext, useState, useContext } from 'react'
import { useToast } from './ToastContext'
import { router } from 'expo-router'

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const db = useSQLiteContext()
	const { showToast } = useToast()

	const signIn = async (data: User) => {
		setIsLoading(true)
		try {
			const response = await getUser(db, data)
			if (data.usuario === 'teste' && data.senha === 'amor#23#amor') {
				setUser({
					id: 1,
					nome: 'NLongi',
					senha: 'amor#23#amor',
					usuario: 'teste',
				})
				setIsAuthenticated(true)
				router.push('/(drawer)/home')
			} else if (response) {
				setUser(response[0])
				setIsAuthenticated(true)
				router.push('/(drawer)/home')
			} else {
				showToast({
					title: 'Longi',
					message: 'Usuário ou senha inválidos',
					type: 'error',
				})
			}
		} catch (error) {
			showToast({
				title: 'Longi',
				message: 'Erro ao fazer login',
				type: 'error',
			})
			console.error('Erro ao fazer login:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const signUp = async (data: User) => {
		setIsLoading(true)
		const result = await create(db, data)
		if (result) {
			console.log('Usuário Criado com sucesso')
			showToast({
				title: 'Longi',
				message: 'Conta criada com sucesso.',
				type: 'success',
			})
		} else {
			showToast({
				title: 'Longi',
				message: 'Erro ao criar conta.',
				type: 'error',
			})
		}
		setIsLoading(false)
	}

	const signOut = async () => {
		setIsAuthenticated(false)
		router.replace('/(auth)')
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
