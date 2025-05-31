import { Notification } from '@/types'

export const alunos = [
	{
		id: 1,
		name: 'Ana Maria Conde',
	},
	{
		id: 2,
		name: 'Beatriz',
	},
	{
		id: 3,
		name: 'Carlos',
	},
	{
		id: 4,
		name: 'Daniel',
	},
	{
		id: 5,
		name: 'Eduardo',
	},
	{
		id: 6,
		name: 'Fernanda',
	},
	{
		id: 7,
		name: 'Gabriel',
	},
	{
		id: 8,
		name: 'Hugo',
	},
	{
		id: 9,
		name: 'Isabela',
	},
	{
		id: 10,
		name: 'João',
	},
]

export const turmas = [
	{
		id: 1,
		nome: '10ª IG',
	},
	{
		id: 2,
		nome: '10ª Finanças',
	},
	{
		id: 3,
		nome: '11ª IG',
	},
]

export const notifications: Notification[] = [
	{
		icon: 'volume-2',
		title: 'Alunos com baixo desempenho',
		description: '5 alunos têm média abaixo de 10,0 na disciplina de Matemática.',
	},
	{
		icon: 'bell',
		title: 'Prazo de lançamento de notas',
		description: 'Faltam 2 dias para encerrar o prazo de lançamento das notas do 2º trimestre.',
	},
	{
		icon: 'users',
		title: 'Alunos com muitas faltas',
		description: '3 alunos atingiram 25% de faltas e podem ser reprovados.',
	},
	{
		icon: 'file-text',
		title: 'Falta de registro de notas',
		description: 'Ainda não há notas registadas para a turma da 10ª IG em Física.',
	},
]

export const disciplinas = [
	{
		id: 'Matemática',
		nome: 'Mat',
	},
	{
		id: 'Física',
		nome: 'Fis',
	},
	{
		id: 'Química',
		nome: 'Qui',
	},
]

export const trimestres = [
	{
		id: 1,
		nome: '1º Trimestre',
	},
	{
		id: 2,
		nome: '2º Trimestre',
	},
	{
		id: 3,
		nome: '3º Trimestre',
	}
]

export const tipoProvas = [
	{
		id: 1,
		nome: 'MAC',
	},
	{
		id: 2,
		nome: 'PP',
	},
	{
		id: 3,
		nome: 'PT',
	},
	{
		id: 4,
		nome: 'EXAME',
	},
]

export const notas_alunos = [
	{ id: 1, nome: 'João Silva', nota: '' },
	{ id: 2, nome: 'Maria Santos', nota: '' },
	{ id: 3, nome: 'Carlos Oliveira', nota: '' },
	{ id: 4, nome: 'Pedro Silva', nota: '' },
	{ id: 5, nome: 'Luis Junior', nota: '' },
	{ id: 6, nome: 'Ana Maria', nota: '' },
	{ id: 7, nome: 'Fernanda', nota: '' },
	{ id: 8, nome: 'Gabriel', nota: '' },
	{ id: 9, nome: 'Isabela', nota: '' },
	{ id: 10, nome: 'Beatriz', nota: '' },
	{ id: 11, nome: 'Joaquim', nota: '' },
	{ id: 12, nome: 'Maria Costa', nota: '' },
]

export const genero = [
	{ id: 'M', nome: 'Masculino' },
	{ id: 'F', nome: 'Feminino' },
]
