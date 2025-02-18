import BarChartComponent from '@/components/BarChart'
import BarChartSeries from '@/components/BarChartSeries'
import PieChartComponent from '@/components/PieChart'
import { ScrollView, Text, ToastAndroid, View } from 'react-native'
import { s } from './styles'
import Select from '../Select'
import { trimestres } from '@/mocks'
import { useEffect, useState } from 'react'
import { ITurma } from '@/types'
import { useSQLiteContext } from 'expo-sqlite'
import { getDisciplinas } from '@/models/Disciplina'
export default function ReportsComponent() {
	const db = useSQLiteContext()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const carregarDisciplinas = async () => {
		try {
			const result = await getDisciplinas(db)
			result.unshift({
				id: 0,
				nome: 'Selecione a disciplina',
			})
			setDisciplinas(result)
		} catch (error) {
			ToastAndroid.show('Erro ao carregar disciplinas', ToastAndroid.SHORT)
			console.error(error)
		}
	}

	useEffect(() => {
		carregarDisciplinas()
	}, [])
	return (
		<ScrollView style={s.container}>
			<View style={s.card}>
				<Text style={s.label}>Selecione o Trimestre</Text>
				<Select data={trimestres} />
				<Text style={s.label}>Selecione a Disciplina</Text>
				<Select data={disciplinas} />
			</View>
			<BarChartSeries />
			<BarChartComponent />
			<PieChartComponent />
		</ScrollView>
	)
}
