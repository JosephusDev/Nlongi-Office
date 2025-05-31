import { IAluno } from '@/types'
import { capitalizeName } from '@/utils/functions'
import { SQLiteDatabase } from 'expo-sqlite'

export const create = async (db: SQLiteDatabase, data: Pick<IAluno, 'nome' | 'turma_id'>) => {
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

export const update = async (db: SQLiteDatabase, id: number, data: Pick<IAluno, 'nome' | 'turma_id'>) => {
	const { nome, turma_id } = data

	try {
		const result = await db.runAsync(`UPDATE aluno SET nome = ?, turma_id = ?, updated_at = ? WHERE id = ?`, [
			nome?.toUpperCase().trim(),
			turma_id ?? '',
			new Date().toISOString(),
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
		const result = await db.runAsync(`UPDATE aluno SET deleted_at = ? WHERE id = ?`, [new Date().toISOString(), id])

		if (result.changes > 0) {
			const resultNota = await db.runAsync(`UPDATE nota SET deleted_at = ? WHERE aluno_id = ?`, [new Date().toISOString(), id])
			if (resultNota.changes > 0) {
				console.log('Notas removidas com sucesso!')
			} else {
				console.error('Erro ao remover notas: Nenhuma linha afetada')
			}
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
			 WHERE a.deleted_at IS NULL
			 ORDER BY a.nome;`,
		)
		return result
	} catch (error) {
		console.error('Erro ao obter alunos:', error)
		throw error
	}
}
