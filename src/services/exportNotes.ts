import { IAlunoNotas } from '@/types'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import XLSX from 'xlsx'

export const exportToExcel = async (dados: Pick<IAlunoNotas, 'nome' | 'mac' | 'pp' | 'pt' | 'mt'>[]) => {
	// Converter as chaves para maiúsculas
	const dadosFormatados = dados.map(item => ({
		NOME: item.nome,
		MAC: item.mac,
		PP: item.pp,
		PT: item.pt,
		MT: item.mt,
	}))

	// Criar um worksheet (planilha)
	const ws = XLSX.utils.json_to_sheet(dadosFormatados)

	// Criar um workbook (arquivo Excel)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, 'Notas')

	// Gerar o arquivo Excel em formato binário
	const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })

	// Caminho para salvar o arquivo no dispositivo
	const fileUri = FileSystem.documentDirectory + 'notas.xlsx'

	// Salvar o arquivo localmente
	await FileSystem.writeAsStringAsync(fileUri, wbout, {
		encoding: FileSystem.EncodingType.Base64,
	})

	// Compartilhar o arquivo
	if (await Sharing.isAvailableAsync()) {
		await Sharing.shareAsync(fileUri)
	} else {
		alert('O compartilhamento não está disponível nesta plataforma.')
	}
}
