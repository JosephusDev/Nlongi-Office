import { Text, View, Pressable, ScrollView, Dimensions } from 'react-native'
import { s } from './styles'
import { colors } from '@/styles/colors'
import { IconEdit, IconTrash } from '@tabler/icons-react-native'

type Data = {
	id: number
	[key: string]: any
}

type ColumnConfig = {
	key: string // Chave da coluna
	label: string // Rótulo da coluna
	width?: number // Largura da coluna (opcional)
}

type TableProps = {
	columns: ColumnConfig[] // Configurações das colunas
	data: Data[]
	showActions?: boolean
	onEdit?: (id: number) => void
	onDelete?: (id: number) => void
}

const TableHeader = ({ columns, showActions }: { columns: ColumnConfig[]; showActions: boolean }) => {
	return (
		<View style={s.thead}>
			{/* Coluna # */}
			<Text style={[s.th, { width: 50 }]}>Nº</Text>

			{/* Colunas definidas pelo pai */}
			{columns.map((col, index) => (
				<Text key={index} style={[s.th, { width: col.width || 100 }]}>
					{col.label}
				</Text>
			))}

			{/* Coluna de ações */}
			{showActions && <Text style={[s.th, { width: 150 }]}>Ações</Text>}
		</View>
	)
}

const TableRow = ({
	item,
	columns,
	showActions,
	onEdit,
	onDelete,
	index,
}: {
	item: Data
	columns: ColumnConfig[]
	showActions: boolean
	onEdit?: (id: number) => void
	onDelete?: (id: number) => void
	index: number
}) => {
	return (
		<View style={s.tbody}>
			{/* Coluna # */}
			<Text style={[s.td, { width: 50 }]}>{index + 1}</Text>

			{/* Colunas definidas pelo pai */}
			{columns.map((col, colIndex) => (
				<Text key={colIndex} style={[s.td, { width: col.width || 100 }]}>
					{item[col.key]}
				</Text>
			))}

			{/* Coluna de ações */}
			{showActions && (
				<View style={{ flexDirection: 'row', gap: 10, width: 100 }}>
					<Pressable onPress={() => onEdit?.(item.id)} style={{ marginHorizontal: 5 }}>
						<IconEdit size={20} color={colors.gray[500]} />
					</Pressable>
					<Pressable onPress={() => onDelete?.(item.id)}>
						<IconTrash size={20} color={colors.red.base} />
					</Pressable>
				</View>
			)}
		</View>
	)
}

const TableFlatList = ({ columns, data, showActions = false, onEdit, onDelete }: TableProps) => {
	return (
		<View>
			<ScrollView style={s.main} horizontal>
				<View>
					<TableHeader columns={columns} showActions={showActions} />
					<ScrollView>
						{data.map((item, index) => (
							<TableRow
								key={item.id}
								item={item}
								columns={columns}
								showActions={showActions}
								onEdit={onEdit}
								onDelete={onDelete}
								index={index}
							/>
						))}
					</ScrollView>
				</View>
			</ScrollView>
		</View>
	)
}

export default TableFlatList
