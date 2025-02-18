import BarChartComponent from '@/components/BarChart'
import BarChartSeries from '@/components/BarChartSeries'
import PieChartComponent from '@/components/PieChart'
import { ScrollView, Text, View } from 'react-native'
import { s } from './styles'
import Select from '../Select'
import { disciplinas, trimestres } from '@/mocks'
export default function ReportsComponent() {
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
