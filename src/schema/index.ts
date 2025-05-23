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
		email: yup.string().email('E-mail inválido').trim(),
		image: yup.string().nullable(),
		usuario: yup.string().min(3, 'Usuário deve ter no mínimo 3 caracteres').trim().required('Usuário é obrigatório'),
		senha: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').trim().required('Senha é obrigatória'),
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

export const EmailSchema = yup
	.object({
		email: yup
			.string()
			.email('E-mail inválido')
			.required('E-mail é obrigatório')
			.trim()
			.test('email-match', 'O e-mail deve ser igual ao e-mail cadastrado', function (value) {
				const { userEmail } = this.options.context || {}
				return value === userEmail
			}),
	})
	.required()