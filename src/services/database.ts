import { SQLiteDatabase } from 'expo-sqlite'

export async function createUsuarioTable(db: SQLiteDatabase) {
	await db
		.execAsync(`
      CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      genero TEXT NOT NULL,
      image TEXT,
      biometria INTEGER,
      usuario TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
      );
    `)
		.then(() => console.log('Criado com sucesso!'))
		.catch(error => console.log(error))
}

export async function createTurmaTable(db: SQLiteDatabase) {
	await db
		.execAsync(`
  CREATE TABLE IF NOT EXISTS turma (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
  );
  `)
		.then(() => console.log('Criado com sucesso!'))
		.catch(error => console.log(error))
}

export async function createAlunoTable(db: SQLiteDatabase) {
	await db
		.execAsync(`
  CREATE TABLE IF NOT EXISTS aluno (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    turma_id INTEGER NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES turma (id) ON DELETE CASCADE
  );
  `)
		.then(() => console.log('Criado com sucesso!'))
		.catch(error => console.log(error))
}

export async function createDisciplinaTable(db: SQLiteDatabase) {
	await db
		.execAsync(`
  CREATE TABLE IF NOT EXISTS disciplina (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
  );
  `)
		.then(() => console.log('Criado com sucesso!'))
		.catch(error => console.log(error))
}

export async function createNotaTable(db: SQLiteDatabase) {
	await db
		.execAsync(`
  CREATE TABLE IF NOT EXISTS nota (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor FLOAT NOT NULL,
    periodo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    aluno_id INTEGER NOT NULL,
    disciplina_id INTEGER NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES aluno (id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina (id) ON DELETE CASCADE
  );
  `)
		.then(() => console.log('Criado com sucesso!'))
		.catch(error => console.log(error))
}
