import { IAluno } from '@/types'
import { capitalizeName } from '@/utils/functions'
import { SQLiteDatabase } from 'expo-sqlite'

export const create = async (db: SQLiteDatabase, data: Omit<IAluno, 'id' | 'turma'>) => {
	const { nome, turma_id } = data

	try {
		const result = await db.runAsync(`INSERT INTO aluno (nome, turma_id) VALUES (?, ?)`, [
			capitalizeName(nome.trim()),
			turma_id ?? '',
		])

		if (result.changes > 0) {
			console.log('Aluno cadastrado com sucesso!')
			return true
		} else {
			console.error('Erro ao cadastrar aluno: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao cadastrar aluno:', error)
		return false
	}
}

export const update = async (db: SQLiteDatabase, id: number, data: Omit<IAluno, 'id'>) => {
	const { nome, turma_id } = data

	try {
		const result = await db.runAsync(`UPDATE aluno SET nome = ?, turma_id = ? WHERE id = ?`, [
			nome?.toUpperCase().trim(),
			turma_id ?? '',
			id,
		])

		if (result.changes > 0) {
			console.log('Aluno atualizado com sucesso!')
			return true
		} else {
			console.error('Erro ao atualizar aluno: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao atualizar aluno:', error)
		return false
	}
}

export const deleteAluno = async (db: SQLiteDatabase, id: number) => {
	try {
		const result = await db.runAsync(`DELETE FROM aluno WHERE id = ?`, [id])

		if (result.changes > 0) {
			console.log('Aluno removido com sucesso!')
			return true
		} else {
			console.error('Erro ao remover aluno: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao remover aluno:', error)
		return false
	}
}

export const getAlunos = async (db: SQLiteDatabase) => {
	try {
		const result = await db.getAllAsync<IAluno>(
			`SELECT a.*, t.nome AS turma 
			 FROM aluno a 
			 JOIN turma t ON a.turma_id = t.id 
			 ORDER BY a.nome;`,
		)
		return result
	} catch (error) {
		console.error('Erro ao obter alunos:', error)
		throw error
	}
}
