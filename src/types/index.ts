import { Feather } from '@expo/vector-icons'

export interface AuthContextData {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	signIn: (data: User) => Promise<void>
	signUp: (data: User) => Promise<void>
	signOut: () => Promise<void>
}

export interface User {
	id?: number
	nome?: string
	genero?: string
	image?: string
	usuario: string
	senha: string
}

export interface ITurma {
	id?: number
	nome: string
}

export interface Notification {
	icon: keyof typeof Feather.glyphMap
	title: string
	description: string
}

export interface ISelect {
	id?: number | string
	nome: string
}

export interface IAluno {
	id?: number
	nome: string
	turma_id?: number
	turma?: string
}

export interface INota {
	valor: number
	periodo: string | null
	tipo: string | null
	aluno?: string
	disciplina?: string
	turma?: string
	turma_id: number
	aluno_id: number
	disciplina_id: number | null
}
