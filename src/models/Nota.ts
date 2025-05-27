import { SQLiteDatabase } from 'expo-sqlite'
import { IAlunoNotas, IMiniPauta, INota } from '@/types'

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
export const updateNota = async (db: SQLiteDatabase, id: number, nota: number) => {
	try {
		const result = await db.runAsync(`UPDATE nota SET valor = ?, updated_at = ? WHERE id = ?`, [nota, new Date().toISOString(), id])

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
		const result = await db.runAsync(`UPDATE nota SET deleted_at = ? WHERE id = ?`, [new Date().toISOString(), id])

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

export const getNotasByAluno = async (db: SQLiteDatabase, aluno_id: number) => {
	try {
		const result = await db.getAllAsync<IAlunoNotas>(
			`SELECT  
				min(a.id) as id,
				min(d.id) as disciplina_id,
				n.periodo,
				d.nome as disciplina,
				CASE 
					WHEN n.periodo = '1' THEN 'Iº'
					WHEN n.periodo = '2' THEN 'IIº'
					WHEN n.periodo = '3' THEN 'IIIº'
					ELSE n.periodo 
				END AS trimestre,
				MAX(CASE WHEN n.tipo = '1' THEN n.id END) AS mac_id,
				MAX(CASE WHEN n.tipo = '2' THEN n.id END) AS pp_id,
				MAX(CASE WHEN n.tipo = '3' THEN n.id END) AS pt_id,
				COALESCE(MAX(CASE WHEN n.tipo = '1' THEN n.valor END), 0) AS mac,
				COALESCE(MAX(CASE WHEN n.tipo = '2' THEN n.valor END), 0) AS pp,
				COALESCE(MAX(CASE WHEN n.tipo = '3' THEN n.valor END), 0) AS pt
			FROM aluno a
			LEFT JOIN nota n ON n.aluno_id = a.id
			JOIN disciplina d ON n.disciplina_id = d.id
			WHERE a.id = ${aluno_id}
			AND a.deleted_at IS NULL
			GROUP BY d.nome, n.periodo
			ORDER BY d.nome;`,
		)
		console.log('Pauta singular: ' + JSON.stringify(result))
		return result
	} catch (error) {
		console.error('Erro ao obter notas:', error)
		throw error // Propaga o erro para ser tratado no chamador
	}
}

export const getMiniPauta = async (db: SQLiteDatabase, disciplina_id: number, turma_id: number) => {
	try {
		const result = await db.getAllAsync<IMiniPauta>(
			`SELECT  
				a.id,
				a.nome AS nome,
				COALESCE(MAX(CASE WHEN n.tipo = '1' AND n.periodo = '1' THEN n.valor END), 0) AS mac1,
				COALESCE(MAX(CASE WHEN n.tipo = '2' AND n.periodo = '1' THEN n.valor END), 0) AS pp1,
				COALESCE(MAX(CASE WHEN n.tipo = '3' AND n.periodo = '1' THEN n.valor END), 0) AS pt1,
				COALESCE(MAX(CASE WHEN n.tipo = '1' AND n.periodo = '2' THEN n.valor END), 0) AS mac2,
				COALESCE(MAX(CASE WHEN n.tipo = '2' AND n.periodo = '2' THEN n.valor END), 0) AS pp2,
				COALESCE(MAX(CASE WHEN n.tipo = '3' AND n.periodo = '2' THEN n.valor END), 0) AS pt2,
				COALESCE(MAX(CASE WHEN n.tipo = '1' AND n.periodo = '3' THEN n.valor END), 0) AS mac3,
				COALESCE(MAX(CASE WHEN n.tipo = '2' AND n.periodo = '3' THEN n.valor END), 0) AS pp3,
				COALESCE(MAX(CASE WHEN n.tipo = '3' AND n.periodo = '3' THEN n.valor END), 0) AS pt3
			FROM aluno a
			LEFT JOIN nota n ON n.aluno_id = a.id
			JOIN disciplina d ON n.disciplina_id = d.id
			WHERE d.id = ${disciplina_id}
			AND a.turma_id = ${turma_id}
			GROUP BY a.id, a.nome
			ORDER BY a.nome;`,
		)
		console.log('Mini pauta: ' + JSON.stringify(result))
		return result
	} catch (error) {
		console.error('Erro ao obter notas:', error)
		throw error
	}
}
