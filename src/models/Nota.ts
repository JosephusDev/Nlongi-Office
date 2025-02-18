import { SQLiteDatabase } from 'expo-sqlite'
import { INota } from '@/types'

export const createNota = async (db: SQLiteDatabase, data: Omit<INota, 'turma_id'>) => {
	const { valor, periodo, tipo, aluno_id, disciplina_id } = data

	try {
		const result = await db.runAsync(
			`INSERT INTO nota (valor, periodo, tipo, aluno_id, disciplina_id) VALUES (?, ?, ?, ?, ?)`,
			[valor, periodo, tipo, aluno_id, disciplina_id],
		)

		if (result.changes > 0) {
			console.log('Nota adicionada com sucesso!')
			return true // Indica sucesso
		} else {
			console.error('Erro ao adicionar nota: Nenhuma linha afetada')
			return false // Indica falha
		}
	} catch (error) {
		console.error('Erro ao adicionar nota:', error)
		return false // Indica falha
	}
}
export const updateNota = async (db: SQLiteDatabase, id: number, data: Omit<INota, 'id'>) => {
	const { valor, periodo, tipo, aluno_id, disciplina_id } = data

	try {
		const result = await db.runAsync(
			`UPDATE nota SET valor = ?, periodo = ?, tipo = ?, aluno_id = ?, disciplina_id = ? WHERE id = ?`,
			[valor, periodo, tipo, aluno_id, disciplina_id, id],
		)

		if (result.changes > 0) {
			console.log('Nota atualizada com sucesso!')
			return true // Indica sucesso
		} else {
			console.error('Erro ao atualizar nota: Nenhuma linha afetada')
			return false // Indica falha
		}
	} catch (error) {
		console.error('Erro ao atualizar nota:', error)
		return false // Indica falha
	}
}

export const deleteNota = async (db: SQLiteDatabase, id: number) => {
	try {
		const result = await db.runAsync(`DELETE FROM nota WHERE id = ?`, [id])

		if (result.changes > 0) {
			console.log('Nota removida com sucesso!')
			return true // Indica sucesso
		} else {
			console.error('Erro ao remover nota: Nenhuma linha afetada')
			return false // Indica falha
		}
	} catch (error) {
		console.error('Erro ao remover nota:', error)
		return false // Indica falha
	}
}

export const getNotas = async (db: SQLiteDatabase) => {
	try {
		const result = await db.getAllAsync<INota>(
			`SELECT  
		  IFNULL(n.valor, 0) AS valor, 
		  IFNULL(n.periodo, NULL) AS periodo, 
		  IFNULL(n.tipo, NULL) AS tipo, 
		  a.id AS aluno_id, 
		  a.nome AS aluno, 
		  a.turma_id AS turma_id, 
		  d.id AS disciplina_id
		FROM aluno a
		LEFT JOIN nota n ON n.aluno_id = a.id
		LEFT JOIN disciplina d ON n.disciplina_id = d.id
		ORDER BY a.nome, d.nome, n.periodo;`,
		)
		return result
	} catch (error) {
		console.error('Erro ao obter notas:', error)
		throw error // Propaga o erro para ser tratado no chamador
	}
}
