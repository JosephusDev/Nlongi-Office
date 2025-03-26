import { Feather } from '@expo/vector-icons'

export type AuthContextData = {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	signIn: (data: User) => Promise<void>
	signUp: (data: User) => Promise<void>
	signOut: () => Promise<void>
}

export type User = {
	id?: number
	nome?: string
	genero?: string
	image?: string
	usuario: string
	senha: string
}

export type ITurma = {
	id: number
	nome: string
}

export type Notification = {
	icon: keyof typeof Feather.glyphMap
	title: string
	description: string
}

export type ISelect = {
	id?: number | string
	nome: string
}

export type IAluno = {
	id: number
	nome: string
	turma_id?: number
	turma?: string
}

export type INota = {
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

export type IAlunoNotas = {
	id: number
	nome: string
	disciplina?: string
	disciplina_id?: number
	periodo?: string
	trimestre?: string
	mac: number
	pp: number
	pt: number
	mac_id?: number
	pp_id?: number
	pt_id?: number
	mt?: number
}

export type SchoolData = {
	nomeEscola: string
	anoLetivo: string
}
