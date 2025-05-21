import { SQLiteDatabase } from 'expo-sqlite'
import NetInfo from '@react-native-community/netinfo'

interface Turma {
	nome: string
}

interface Aluno {
	nome: string
	turma_id: number
}

interface Disciplina {
	nome: string
}

interface Nota {
	valor: number
	periodo: string
	tipo: string
	aluno_id: number
	disciplina_id: number
}

export async function checkInternetConnection(): Promise<boolean> {
	const netInfo = await NetInfo.fetch()
	return netInfo.isConnected ?? false
}

export async function backupData(db: SQLiteDatabase, email: string) {
	try {
		const isConnected = await checkInternetConnection()
		if (!isConnected) {
			throw new Error('Sem conexão com a internet')
		}

		/* // Backup de Turmas
		const turmas = await db.getAllAsync<Turma>('SELECT * FROM turma')
		for (const turma of turmas) {
			await prisma.turma.upsert({
				where: { email, nome: turma.nome },
				update: {
					nome: turma.nome,
					email,
				},
				create: {
					nome: turma.nome,
					email,
				},
			})
		}

		// Backup de Alunos
		const alunos = await db.getAllAsync<Aluno>('SELECT * FROM aluno')
		for (const aluno of alunos) {
			await prisma.aluno.upsert({
				where: { email, nome: aluno.nome },
				update: {
					nome: aluno.nome,
					turmaId: aluno.turma_id,
					email,
				},
				create: {
					nome: aluno.nome,
					turmaId: aluno.turma_id,
					email,
				},
			})
		}

		// Backup de Disciplinas
		const disciplinas = await db.getAllAsync<Disciplina>('SELECT * FROM disciplina')
		for (const disciplina of disciplinas) {
			await prisma.disciplina.upsert({
				where: { email, nome: disciplina.nome },
				update: {
					nome: disciplina.nome,
					email,
				},
				create: {
					nome: disciplina.nome,
					email,
				},
			})
		}

		// Backup de Notas
		const notas = await db.getAllAsync<Nota>('SELECT * FROM nota')
		for (const nota of notas) {
			await prisma.nota.create({
				data: {
					valor: nota.valor,
					periodo: nota.periodo,
					tipo: nota.tipo,
					alunoId: nota.aluno_id,
					disciplinaId: nota.disciplina_id,
					email,
				},
			})
		} */

		return true
	} catch (error) {
		console.error('Erro ao fazer backup:', error)
		throw error
	}
}
