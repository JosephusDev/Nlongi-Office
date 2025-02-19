import BarChartComponent from '@/components/BarChart'
import BarChartSeries from '@/components/BarChartSeries'
import PieChartComponent from '@/components/PieChart'
import { Pressable, ScrollView, Text, ToastAndroid, View } from 'react-native'
import { s } from './styles'
import Select from '../Select'
import { trimestres } from '@/mocks'
import { useEffect, useState } from 'react'
import { ITurma } from '@/types'
import { useSQLiteContext } from 'expo-sqlite'
import { getDisciplinas } from '@/models/Disciplina'
import MyModal from '../MyModal'
import { IconSearch } from '@tabler/icons-react-native'
import { colors } from '@/styles/colors'
import Button from '../Button'
export default function ReportsComponent() {
	const db = useSQLiteContext()
	const [disciplinas, setDisciplinas] = useState<ITurma[]>([])
	const [visible, setVisible] = useState(false)
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

	const handleFilter = () => {
		setVisible(false)
	}

	useEffect(() => {
		carregarDisciplinas()
	}, [])
	return (
		<ScrollView style={s.container}>
			<Pressable style={s.searchButton} onPress={() => setVisible(true)}>
				<IconSearch color={colors.gray[500]} size={20} />
				<Text style={s.searchLabel}>Clique para filtrar</Text>
			</Pressable>
			<MyModal title='Filtro de pesquisa' visible={visible} onClose={() => setVisible(false)}>
				<Text style={s.label}>Selecione o Trimestre</Text>
				<Select data={trimestres} />
				<Text style={s.label}>Selecione a Disciplina</Text>
				<Select data={disciplinas} />

				<Button title='Filtrar' icon='search' style={s.btnPrint} onClick={handleFilter} />
			</MyModal>
			<BarChartSeries />
			<BarChartComponent />
			<PieChartComponent />
		</ScrollView>
	)
}
