import { Text, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { s } from './styles'
import { colors } from '@/styles/colors'

export default function PieChartComponent() {
	const pieData = [
		{
			value: 10,
			color: colors.red.base,
			focused: true,
		},
		{
			value: 40,
			color: colors.blue.base,
		},
	]

	const renderDot = (color: string) => {
		return <View style={[s.dot, { backgroundColor: color }]} />
	}

	const renderLegendComponent = () => {
		return (
			<View>
				<View style={s.legendContainer}>
					<View style={s.legend}>
						{renderDot(colors.blue.base)}
						<Text style={s.legendContent}>Aprovados - 80%</Text>
					</View>
					<View style={s.legend}>
						{renderDot(colors.red.base)}
						<Text style={s.legendContent}>Reprovados - 20%</Text>
					</View>
				</View>
			</View>
		)
	}

	return (
		<View style={s.container}>
			<View style={s.card}>
				<Text style={s.title}>Resultados gerais por disciplina</Text>
				<View style={{ padding: 20, alignItems: 'center' }}>
					<PieChart
						data={pieData}
						donut
						isAnimated
						sectionAutoFocus
						radius={90}
						innerRadius={60}
						innerCircleColor={'#232B5D'}
						centerLabelComponent={() => {
							return (
								<View style={{ justifyContent: 'center', alignItems: 'center' }}>
									<Text style={s.centerLabel}>120</Text>
									<Text style={s.centerLabelContent}>Alunos</Text>
								</View>
							)
						}}
					/>
				</View>
				{renderLegendComponent()}
			</View>
		</View>
	)
}
