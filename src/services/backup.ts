import { SQLiteDatabase } from 'expo-sqlite'
import NetInfo from '@react-native-community/netinfo'
import { supabase } from './supabase/client'
import { IAluno, INota, ITurma } from '@/types'

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

		// Backup de Turmas
		const turmas = await db.getAllAsync<ITurma>('SELECT * FROM turma')
		console.log('Turmas encontradas:', turmas)
		for (const turma of turmas) {
			// Busca a versão remota para comparar timestamps
			const { data: remoteTurma } = await supabase
				.from('Turma')
				.select('updatedat, deletedat')
				.eq('id', `${turma.id}_${email}`)
				.single()

			const shouldUpdate = !remoteTurma || new Date(turma.updated_at) > new Date(remoteTurma.updatedat) || (turma.deleted_at !== remoteTurma?.deletedat)

			if (shouldUpdate) {
				const { error } = await supabase
					.from('Turma')
					.upsert({
						id: `${turma.id}_${email}`,
						nome: turma.nome,
						email,
						updatedat: turma.updated_at,
						deletedat: turma.deleted_at
					}, { onConflict: 'id,email' })

				if (error) {
					console.error('Erro ao inserir Turma:', error)
					throw error
				}
			}
		}

		// Backup de Alunos
		const alunos = await db.getAllAsync<IAluno>('SELECT * FROM aluno')
		console.log('Alunos encontrados:', alunos)
		for (const aluno of alunos) {
			const { data: remoteAluno } = await supabase
				.from('Aluno')
				.select('updatedat, deletedat')
				.eq('id', `${aluno.id}_${email}`)
				.single()

			const shouldUpdate = !remoteAluno || new Date(aluno.updated_at) > new Date(remoteAluno.updatedat) || (aluno.deleted_at !== remoteAluno?.deletedat)

			if (shouldUpdate) {
				const { error } = await supabase
					.from('Aluno')
					.upsert({
						id: `${aluno.id}_${email}`,
						nome: aluno.nome,
						turmaid: `${aluno.turma_id}_${email}`,
						email,
						updatedat: aluno.updated_at,
						deletedat: aluno.deleted_at
					}, { onConflict: 'id,turmaid,email' })

				if (error) {
					console.error('Erro ao inserir Aluno:', error)
					throw error
				}
			}
		}

		// Backup de Disciplinas
		const disciplinas = await db.getAllAsync<ITurma>('SELECT * FROM disciplina')
		console.log('Disciplinas encontradas:', disciplinas)
		for (const disciplina of disciplinas) {
			const { data: remoteDisciplina } = await supabase
				.from('Disciplina')
				.select('updatedat, deletedat')
				.eq('id', `${disciplina.id}_${email}`)
				.single()

			const shouldUpdate = !remoteDisciplina || new Date(disciplina.updated_at) > new Date(remoteDisciplina.updatedat) || (disciplina.deleted_at !== remoteDisciplina?.deletedat)

			if (shouldUpdate) {
				const { error } = await supabase
					.from('Disciplina')
					.upsert({
						id: `${disciplina.id}_${email}`,
						nome: disciplina.nome,
						email,
						updatedat: disciplina.updated_at,
						deletedat: disciplina.deleted_at
					}, { onConflict: 'id,email' })

				if (error) {
					console.error('Erro ao inserir Disciplina:', error)
					throw error
				}
			}
		}

		// Backup de Notas
		const notas = await db.getAllAsync<INota>('SELECT * FROM nota')
		console.log('Notas encontradas:', notas)
		for (const nota of notas) {
			const { data: remoteNota } = await supabase
				.from('Nota')
				.select('updatedat, deletedat')
				.eq('alunoid', `${nota.aluno_id}_${email}`)
				.eq('disciplinaid', `${nota.disciplina_id}_${email}`)
				.eq('tipo', nota.tipo!)
				.eq('periodo', nota.periodo!)
				.single()

			const shouldUpdate = !remoteNota || new Date(nota.updated_at) > new Date(remoteNota.updatedat) || (nota.deleted_at !== remoteNota?.deletedat)

			if (shouldUpdate) {
				const { error } = await supabase
					.from('Nota')
					.upsert({
						valor: nota.valor,
						periodo: nota.periodo!,
						tipo: nota.tipo!,
						alunoid: `${nota.aluno_id}_${email}`,
						disciplinaid: `${nota.disciplina_id}_${email}`,
						email,
						updatedat: nota.updated_at,
						deletedat: nota.deleted_at
					}, { onConflict: 'alunoid,disciplinaid,tipo,periodo,email' })

				if (error) {
					console.error('Erro ao inserir Nota:', error)
					throw error
				}
			}
		}

		return true
	} catch (error) {
		console.error('Erro ao fazer backup:', error)
		throw error
	}
}

export async function restoreData(db: SQLiteDatabase, email: string) {
	try {
		const isConnected = await checkInternetConnection()
		if (!isConnected) {
			throw new Error('Sem conexão com a internet')
		}

		// Restaurar Turmas
		const { data: turmas, error: errorTurmas } = await supabase
			.from('Turma')
			.select('*')
			.eq('email', email)
			.is('deletedat', null)

		if (errorTurmas) throw errorTurmas

		for (const turma of turmas) {
			const id = turma.id.split('_')[0]
			const localTurma = await db.getFirstAsync<ITurma>('SELECT * FROM turma WHERE id = ?', [id])
			
			const shouldUpdate = !localTurma || new Date(turma.updatedat) > new Date(localTurma.updated_at)

			if (shouldUpdate) {
				await db.runAsync(
					'INSERT OR REPLACE INTO turma (id, nome, updated_at, deleted_at) VALUES (?, ?, ?, ?)',
					[id, turma.nome, turma.updatedat, turma.deletedat]
				)
			}
		}

		// Restaurar Disciplinas
		const { data: disciplinas, error: errorDisciplinas } = await supabase
			.from('Disciplina')
			.select('*')
			.eq('email', email)
			.is('deletedat', null)

		if (errorDisciplinas) throw errorDisciplinas

		for (const disciplina of disciplinas) {
			const id = disciplina.id.split('_')[0]
			const localDisciplina = await db.getFirstAsync<ITurma>('SELECT * FROM disciplina WHERE id = ?', [id])
			
			const shouldUpdate = !localDisciplina || new Date(disciplina.updatedat) > new Date(localDisciplina.updated_at)

			if (shouldUpdate) {
				await db.runAsync(
					'INSERT OR REPLACE INTO disciplina (id, nome, updated_at, deleted_at) VALUES (?, ?, ?, ?)',
					[id, disciplina.nome, disciplina.updatedat, disciplina.deletedat]
				)
			}
		}

		// Restaurar Alunos
		const { data: alunos, error: errorAlunos } = await supabase
			.from('Aluno')
			.select('*')
			.eq('email', email)
			.is('deletedat', null)

		if (errorAlunos) throw errorAlunos

		for (const aluno of alunos) {
			const id = aluno.id.split('_')[0]
			const turmaId = aluno.turmaid.split('_')[0]
			const localAluno = await db.getFirstAsync<IAluno>('SELECT * FROM aluno WHERE id = ?', [id])
			
			const shouldUpdate = !localAluno || new Date(aluno.updatedat) > new Date(localAluno.updated_at)

			if (shouldUpdate) {
				await db.runAsync(
					'INSERT OR REPLACE INTO aluno (id, nome, turma_id, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?)',
					[id, aluno.nome, turmaId, aluno.updatedat, aluno.deletedat]
				)
			}
		}

		// Restaurar Notas
		const { data: notas, error: errorNotas } = await supabase
			.from('Nota')
			.select('*')
			.eq('email', email)
			.is('deletedat', null)

		if (errorNotas) throw errorNotas

		for (const nota of notas) {
			const alunoId = nota.alunoid.split('_')[0]
			const disciplinaId = nota.disciplinaid.split('_')[0]
			const localNota = await db.getFirstAsync<INota>(
				'SELECT * FROM nota WHERE aluno_id = ? AND disciplina_id = ? AND tipo = ? AND periodo = ?',
				[alunoId, disciplinaId, nota.tipo, nota.periodo]
			)
			
			const shouldUpdate = !localNota || new Date(nota.updatedat) > new Date(localNota.updated_at)

			if (shouldUpdate) {
				await db.runAsync(
					'INSERT OR REPLACE INTO nota (valor, periodo, tipo, aluno_id, disciplina_id, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
					[nota.valor, nota.periodo, nota.tipo, alunoId, disciplinaId, nota.updatedat, nota.deletedat]
				)
			}
		}

		return true
	} catch (error) {
		console.error('Erro ao restaurar dados:', error)
		throw error
	}
}
