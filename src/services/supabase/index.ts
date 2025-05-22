import { supabase } from './client'

export const login = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            throw error
        }
        return data.user.email_confirmed_at !== null
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        throw error
    }
}

export const signUp = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            throw error
        }
        return data
    } catch (error) {
        console.error('Erro ao fazer signup:', error)
        throw error
    }
}