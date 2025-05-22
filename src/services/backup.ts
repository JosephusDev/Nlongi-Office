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
			const { error } = await supabase
			  .from('Turma')
			  .upsert({
				id: `${turma.id}_${email}`,
				nome: turma.nome,
				email,
			  }, { onConflict: 'nome,email' })
		  
			if (error) {
			  console.error('Erro ao inserir Turma:', error)
			  throw error
			}
		  }		  

		// Backup de Alunos
		const alunos = await db.getAllAsync<IAluno>('SELECT * FROM aluno')
		console.log('Alunos encontrados:', alunos)
		for (const aluno of alunos) {
			const { error } = await supabase
			.from('Aluno')
			.upsert({
				id: `${aluno.id}_${email}`,
				nome: aluno.nome,
				turmaid: `${aluno.turma_id}_${email}`,
				email,
			}, { onConflict: 'nome,turmaid,email' })	
			if (error) {
				console.error('Erro ao inserir Aluno:', error)
				throw error
			}
		}

		// Backup de Disciplinas
		const disciplinas = await db.getAllAsync<ITurma>('SELECT * FROM disciplina')
		console.log('Disciplinas encontradas:', disciplinas)
		for (const disciplina of disciplinas) {
			const { error } = await supabase
			.from('Disciplina')
			.upsert({
				id: `${disciplina.id}_${email}`,
				nome: disciplina.nome,
				email,
			}, { onConflict: 'nome,email' })		
			if (error) {
				console.error('Erro ao inserir Disciplina:', error)
				throw error
			}
		}

		// Backup de Notas
		const notas = await db.getAllAsync<INota>('SELECT * FROM nota')
		console.log('Notas encontradas:', notas)
		for (const nota of notas) {
			const { error } = await supabase
			.from('Nota')
			.upsert({
				valor: nota.valor,
				periodo: nota.periodo!,
				tipo: nota.tipo!,
				alunoid: `${nota.aluno_id}_${email}`,
				disciplinaid: `${nota.disciplina_id}_${email}`,
				email,
			}, { onConflict: 'alunoid,disciplinaid,tipo,periodo,email' })		
			if (error) {
				console.error('Erro ao inserir Nota:', error)
				throw error
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

		if (errorTurmas) throw errorTurmas

		for (const turma of turmas) {
			const id = turma.id.split('_')[0]
			await db.runAsync('INSERT OR REPLACE INTO turma (id, nome) VALUES (?, ?)', [id, turma.nome])
		}

		// Restaurar Disciplinas
		const { data: disciplinas, error: errorDisciplinas } = await supabase
			.from('Disciplina')
			.select('*')
			.eq('email', email)

		if (errorDisciplinas) throw errorDisciplinas

		for (const disciplina of disciplinas) {
			const id = disciplina.id.split('_')[0]
			await db.runAsync('INSERT OR REPLACE INTO disciplina (id, nome) VALUES (?, ?)', [id, disciplina.nome])
		}

		// Restaurar Alunos
		const { data: alunos, error: errorAlunos } = await supabase
			.from('Aluno')
			.select('*')
			.eq('email', email)

		if (errorAlunos) throw errorAlunos

		for (const aluno of alunos) {
			const id = aluno.id.split('_')[0]
			const turmaId = aluno.turmaid.split('_')[0]
			await db.runAsync('INSERT OR REPLACE INTO aluno (id, nome, turma_id) VALUES (?, ?, ?)', [
				id,
				aluno.nome,
				turmaId,
			])
		}

		// Restaurar Notas
		const { data: notas, error: errorNotas } = await supabase
			.from('Nota')
			.select('*')
			.eq('email', email)

		if (errorNotas) throw errorNotas

		for (const nota of notas) {
			const alunoId = nota.alunoid.split('_')[0]
			const disciplinaId = nota.disciplinaid.split('_')[0]
			await db.runAsync(
				'INSERT OR REPLACE INTO nota (valor, periodo, tipo, aluno_id, disciplina_id) VALUES (?, ?, ?, ?, ?)',
				[nota.valor, nota.periodo, nota.tipo, alunoId, disciplinaId]
			)
		}

		return true
	} catch (error) {
		console.error('Erro ao restaurar dados:', error)
		throw error
	}
}
