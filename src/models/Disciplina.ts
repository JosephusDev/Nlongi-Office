import { ITurma } from '@/types'
import { SQLiteDatabase } from 'expo-sqlite'

export const create = async (db: SQLiteDatabase, data: Omit<ITurma, 'id'>) => {
	const { nome } = data

	try {
		const result = await db.runAsync(`INSERT INTO disciplina (nome) VALUES (?)`, [nome?.toUpperCase().trim()])

		if (result.changes > 0) {
			console.log('Disciplina cadastrada com sucesso!')
			return true
		} else {
			console.error('Erro ao cadastrar disciplina: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao cadastrar disciplina:', error)
		return false
	}
}

export const update = async (db: SQLiteDatabase, id: number, data: Omit<ITurma, 'id'>) => {
	const { nome } = data

	try {
		const result = await db.runAsync(`UPDATE disciplina SET nome = ? WHERE id = ?`, [nome?.toUpperCase().trim(), id])

		if (result.changes > 0) {
			console.log('Disciplina atualizada com sucesso!')
			return true
		} else {
			console.error('Erro ao atualizar disciplina: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao atualizar disciplina:', error)
		return false
	}
}

export const deleteDisciplina = async (db: SQLiteDatabase, id: number) => {
	try {
		const result = await db.runAsync(`DELETE FROM disciplina WHERE id = ?`, [id])

		if (result.changes > 0) {
			console.log('Disciplina removida com sucesso!')
			return true
		} else {
			console.error('Erro ao remover disciplina: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao remover disciplina:', error)
		return false
	}
}

export const getDisciplinas = async (db: SQLiteDatabase) => {
	try {
		const result = await db.getAllAsync<ITurma>(`SELECT * FROM disciplina;`)
		return result
	} catch (error) {
		console.error('Erro ao obter disciplinas:', error)
		throw error
	}
}
