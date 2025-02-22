import React from 'react'
import { View, Text } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { fontFamily, colors } from '@/styles/theme'
import { s } from './styles'
import { IAlunoNotas } from '@/types'

interface BarChartSeriesProps {
	data: IAlunoNotas
}

export default function ChartTrimestreDisciplina({ data }: BarChartSeriesProps) {
	// Função para determinar a cor da barra com base no valor da nota
	const getBarColor = (value: number) => {
		return value < 10 ? colors.red.base : '#008000'
	}

	// Dados para o gráfico
	const barData = [
		{
			value: data.mac,
			label: 'MAC',
			spacing: 40,
			labelWidth: 30,
			labelTextStyle: { color: colors.gray[500], fontFamily: fontFamily.regular },
			frontColor: getBarColor(data.mac),
		},
		{
			value: data.pp,
			label: 'PP',
			spacing: 40,
			labelWidth: 30,
			labelTextStyle: { color: colors.gray[500], fontFamily: fontFamily.regular },
			frontColor: getBarColor(data.pp),
		},
		{
			value: data.pt,
			label: 'PT',
			spacing: 40,
			labelWidth: 30,
			labelTextStyle: { color: colors.gray[500], fontFamily: fontFamily.regular },
			frontColor: getBarColor(data.pt),
		},
	]

	// Renderiza o título e as legendas
	const renderTitle = () => {
		return (
			<View style={{ marginTop: 30 }}>
				<Text style={s.title}>Desempenho por avaliação</Text>
			</View>
		)
	}

	return (
		<View style={s.container}>
			{renderTitle()}
			<BarChart
				data={barData}
				barWidth={15}
				spacing={50}
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
