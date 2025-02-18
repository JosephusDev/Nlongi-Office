import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai'

const API_KEY = process.env.EXPO_PUBLIC_API_KEY

// Inicializa o cliente do Google Generative AI
const googleAI = new GoogleGenerativeAI(API_KEY || '')

/**
 * Função para obter informações sobre a técnica Pomodoro para um tema de estudo específico.
 * @param theme - O tema de estudo fornecido pelo usuário.
 * @returns Um objeto contendo tempo de estudo, tempo de descanso, número total de sessões e justificativa.
 */
export async function getPomodoroPlan(theme: string): Promise<String> {
  try {
    // Solicitação ao modelo generativo
    const prompt = `Para o tema de estudo "${theme}", forneça uma recomendação em português usando a técnica Pomodoro. A resposta deve ser direta e incluir: 
    - Quantidade de sessões
    - Tempo de estudo por sessão (em minutos)
    - Tempo de descanso por sessão (em minutos)
    - Justificativa (em outro parágrafo)
    A recomendação deve levar em conta a dimensão do tema e pode variar, sem se limitar ao padrão de 25 minutos de estudo e 5 minutos de descanso. O retorno deve ser simples e direto, no formato: "Para este tema, estude X sessões por Y minutos de estudo e Z minutos de descanso cada."`

    const modelo = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const data: GenerateContentResult = await modelo.generateContent(prompt)

    if (!data.response.candidates) {
      console.error('No content received from Google Generative AI.')
      throw new Error('No content received from Google Generative AI.')
    }

    // Parseia a resposta gerada pelo modelo
    const content = data.response.candidates[0].content.parts[0].text

    return String(content)
  } catch (error) {
    console.error('Error fetching Pomodoro plan:', error)
    throw new Error('Failed to fetch Pomodoro plan. Please try again later.')
  }
}
