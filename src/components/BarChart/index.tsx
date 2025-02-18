import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { s } from './styles'

type DataProps = {
	value: number
	label: string
	frontColor?: string
}

export default function BarChartComponent() {
	const data: DataProps[] = [
		{ value: 6, label: '0-4' },
		{ value: 11, label: '5-9' },
		{ value: 8, label: '10-12' },
		{ value: 10, label: '13-15' },
		{ value: 5, label: '16-18' },
		{ value: 2, label: '19-20' },
	]

	// Atribuindo as cores manualmente
	data[0].frontColor = '#ff0000' // Vermelho (pior desempenho)
	data[1].frontColor = '#ff6666' // Vermelho claro
	data[2].frontColor = '#ffcc00' // Amarelo (desempenho médio)
	data[3].frontColor = '#99cc00' // Verde claro
	data[4].frontColor = '#66cc66' // Verde médio
	data[5].frontColor = '#008000' // Verde escuro (melhor desempenho)

	return (
		<View style={s.container}>
			<Text style={s.title}>Distribuição das notas</Text>
			<BarChart
				key={'xyz'}
				data={data}
				barWidth={15}
				spacing={50}
				roundedTop
				roundedBottom
				hideRules
				noOfSections={4}
				yAxisThickness={0}
				xAxisThickness={0}
				xAxisLabelsVerticalShift={2}
				xAxisLabelTextStyle={s.labels}
				yAxisTextStyle={s.labels}
				isAnimated
				animationDuration={300}
				endSpacing={10}
				showValuesAsTopLabel
				topLabelTextStyle={s.topLabels}
			/>
		</View>
	)
}
