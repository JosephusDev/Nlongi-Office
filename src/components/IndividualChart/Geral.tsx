import React from 'react'
import { View, Text } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { s } from './styles'
import { fontFamily, colors } from '@/styles/theme'
import { IAlunoNotas } from '@/types'

type Props = {
	data: IAlunoNotas[]
}

export default function ChartGeral({ data }: Props) {
	// Transforma os dados para o formato do gráfico
	const barData = data.flatMap(item => [
		{
			value: item.mac,
			label: `MAC - ${item.trimestre}`,
			spacing: 70,
			labelWidth: 20,
			labelTextStyle: { color: colors.gray[500], fontFamily: fontFamily.regular },
			frontColor: item.mac >= 10 ? '#008000' : colors.red.base,
		},
		{
			value: item.pp,
			label: `PP - ${item.trimestre}`,
			spacing: 70,
			labelWidth: 20,
			labelTextStyle: { color: colors.gray[500], fontFamily: fontFamily.regular },
			frontColor: item.pp >= 10 ? '#008000' : colors.red.base,
		},
		{
			value: item.pt,
			label: `PT - ${item.trimestre}`,
			spacing: 70,
			labelWidth: 20,
			labelTextStyle: { color: colors.gray[500], fontFamily: fontFamily.regular },
			frontColor: item.pt >= 10 ? '#008000' : colors.red.base,
		},
	])

	const renderTitle = () => (
		<View style={{ marginTop: 30 }}>
			<Text style={s.title}>Desempenho por avaliação</Text>
		</View>
	)

	return (
		<View style={s.container}>
			{renderTitle()}
			<BarChart
				data={barData}
				barWidth={15}
				spacing={30}
				roundedTop
				roundedBottom
				hideRules
				xAxisThickness={0}
				yAxisThickness={0}
				yAxisTextStyle={{ color: colors.gray[500] }}
				noOfSections={4}
				isAnimated
				showValuesAsTopLabel
				topLabelTextStyle={s.topLabels}
			/>
		</View>
	)
}
