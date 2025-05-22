import { User } from '@/types'
import { SQLiteDatabase } from 'expo-sqlite'

export const create = async (db: SQLiteDatabase, data: Omit<User, 'id'>) => {
	try {
		const result = await db.runAsync(`INSERT INTO usuario (nome, usuario, senha, email) VALUES (?, ?, ?, ?)`, [
			data.nome?.trim()!,
			data.usuario.trim(),
			data.senha.trim(),
			data.email?.trim()!,
		])

		if (result.changes > 0) {
			console.log('Usuário cadastrado com sucesso!')
			return true
		} else {
			console.error('Erro ao cadastrar usuário: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao cadastrar usuário:', error)
		return false
	}
}

export const getUser = async (db: SQLiteDatabase, data: Pick<User, 'usuario' | 'senha'>) => {
	try {
		const result = await db.getAllAsync<User>(`SELECT * FROM usuario WHERE usuario = ? AND senha = ?`, [
			data.usuario.trim(),
			data.senha.trim(),
		])

		if (result.length > 0) {
			return result // Retorna o usuário encontrado
		} else {
			return null
		}
	} catch (error) {
		console.error('Erro ao buscar usuário:', error)
		return null
	}
}

export const updateImage = async (db: SQLiteDatabase, id: number, image: string) => {
	try {
		const result = await db.runAsync(`UPDATE usuario SET image = ? WHERE id = ?`, [image?.trim(), id])

		if (result.changes > 0) {
			console.log('Imagem do usuário atualizada com sucesso!')
			return true
		} else {
			console.error('Erro ao atualizar imagem: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao atualizar imagem:', error)
		return false
	}
}

export const update = async (db: SQLiteDatabase, data: User) => {
	try {
		const { id, nome, usuario, senha, email } = data

		const result = await db.runAsync(`UPDATE usuario SET nome = ?, usuario = ?, senha = ?, email = ? WHERE id = ?`, [
			nome?.trim()!,
			usuario.trim(),
			senha.trim(),
			email?.trim()!,
			id!,
		])

		if (result.changes > 0) {
			console.log('Usuário atualizado com sucesso!')
			return true
		} else {
			console.error('Erro ao atualizar usuário: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao atualizar usuário:', error)
		return false
	}
}

export const deleteUser = async (db: SQLiteDatabase, id: number) => {
	try {
		const result = await db.runAsync(`DELETE FROM usuario WHERE id = ?`, [id])

		if (result.changes > 0) {
			console.log('Usuário removido com sucesso!')
			return true
		} else {
			console.error('Erro ao remover usuário: Nenhuma linha afetada')
			return false
		}
	} catch (error) {
		console.error('Erro ao remover usuário:', error)
		return false
	}
}
