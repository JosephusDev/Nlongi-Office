import * as yup from 'yup'

export const Userschema = yup
	.object({
		nome: yup
			.string()
			.min(3, 'Nome deve ter no mínimo 3 caracteres')
			.trim()
			.when('$isSignUp', {
				is: true, // Se for cadastro
				then: schema => schema.required('O nome é obrigatório'),
				otherwise: schema => schema.notRequired(), // Se for login, não obrigatório
			}),
		genero: yup.string().when('$isSignUp', {
			is: true,
			then: schema => schema.required('O gênero é obrigatório'),
			otherwise: schema => schema.notRequired(),
		}),
		image: yup.string().nullable(),
		usuario: yup.string().min(3, 'Usuário deve ter no mínimo 3 caracteres').trim().required('Usuário é obrigatório'),
		senha: yup.string().min(4, 'Senha deve ter no mínimo 4 caracteres').trim().required('Senha é obrigatória'),
	})
	.required()

export const TurmaSchema = yup
	.object({
		nome: yup.string().min(3, 'O Nome deve ter no mínimo 3 caracteres').required('O Nome é obrigatório'),
	})
	.required()

export const AlunoSchema = yup
	.object({
		nome: yup.string().min(3, 'O Nome deve ter no mínimo 3 caracteres').required('O Nome é obrigatório'),
		turma_id: yup.number().required('A Turma é obrigatória'),
	})
	.required()
