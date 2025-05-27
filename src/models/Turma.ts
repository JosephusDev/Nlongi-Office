import { ITurma } from '@/types'
import { SQLiteDatabase } from 'expo-sqlite'

export const create = async (db: SQLiteDatabase, data: Omit<ITurma, 'id'>) => {
	const { nome } = data

	try {
		const result = await db.runAsync(`INSERT INTO turma (nome) VALUES (?)`, [nome?.toUpperCase().trim()])

		if (result.changes > 0) {
			console.log('Turma cadastrada com sucesso!')
			return true
		} else {
			console.error('Erro ao cadastrar turma: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao cadastrar turma:', error)
		return false
	}
}

export const update = async (db: SQLiteDatabase, id: number, data: Omit<ITurma, 'id'>) => {
	const { nome } = data

	try {
		const result = await db.runAsync(`UPDATE turma SET nome = ?, updated_at = ? WHERE id = ?`, [
			nome?.toUpperCase().trim(),
			new Date().toISOString(),
			id,
		])

		if (result.changes > 0) {
			console.log('Turma atualizada com sucesso!')
			return true
		} else {
			console.error('Erro ao atualizar turma: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao atualizar turma:', error)
		return false
	}
}

export const deleteTurma = async (db: SQLiteDatabase, id: number) => {
	try {
		const result = await db.runAsync(`UPDATE turma SET deleted_at = ? WHERE id = ?`, [
			new Date().toISOString(),
			id,
		])

		if (result.changes > 0) {
			console.log('Turma removida com sucesso!')
			return true
		} else {
			console.error('Erro ao remover turma: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao remover turma:', error)
		return false
	}
}

export const getTurmas = async (db: SQLiteDatabase) => {
	try {
		const result = await db.getAllAsync<ITurma>(`SELECT * FROM turma WHERE deleted_at IS NULL order by nome;`)
		return result
	} catch (error) {
		console.error('Erro ao obter turmas:', error)
		throw error
	}
}
