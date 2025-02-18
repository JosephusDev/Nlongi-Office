import React from 'react'
import { View, Text } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { s } from './styles'
import { fontFamily, colors } from '@/styles/theme'

export default function BarChartSeries() {
	const barData = [
		{
			value: 30, // Aprovados em MAC
			label: 'MAC',
			spacing: 2,
			labelWidth: 30,
			labelTextStyle: { color: 'gray', fontFamily: fontFamily.regular },
			frontColor: colors.blue.base,
		},
		{ value: 15, frontColor: colors.red.base }, // Reprovados em MAC
		{
			value: 25, // Aprovados em PP
			label: 'PP',
			spacing: 2,
			labelWidth: 30,
			labelTextStyle: { color: 'gray', fontFamily: fontFamily.regular },
			frontColor: colors.blue.base,
		},
		{ value: 20, frontColor: colors.red.base }, // Reprovados em PP
		{
			value: 30, // Aprovados em PT
			label: 'PT',
			spacing: 2,
			labelWidth: 30,
			labelTextStyle: { color: 'gray', fontFamily: fontFamily.regular },
			frontColor: colors.blue.base,
		},
		{ value: 15, frontColor: colors.red.base }, // Reprovados em PT
		{
			value: 30, // Aprovados em PT
			label: 'MF',
			spacing: 2,
			labelWidth: 30,
			labelTextStyle: { color: 'gray', fontFamily: fontFamily.regular },
			frontColor: colors.blue.base,
		},
		{ value: 15, frontColor: colors.red.base }, // Reprovados em PT
	]

	const renderTitle = () => {
		return (
			<View style={{ marginVertical: 30 }}>
				<Text style={s.title}>Desempenho por avaliação</Text>
				<View style={s.chart}>
					<View style={s.legendsContainer}>
						<View style={[s.icon_legend, { backgroundColor: colors.blue.base }]} />
						<Text style={s.legends}>Positivas</Text>
					</View>
					<View style={s.legendsContainer}>
						<View style={[s.icon_legend, { backgroundColor: colors.red.base }]} />
						<Text style={s.legends}>Negativas</Text>
					</View>
				</View>
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
				yAxisTextStyle={{ color: 'gray' }}
				noOfSections={4}
				isAnimated
				showValuesAsTopLabel
				topLabelTextStyle={s.topLabels}
			/>
		</View>
	)
}
