import { Picker } from '@react-native-picker/picker'
import { View, ViewProps } from 'react-native'
import { s } from './styles'
import { ISelect } from '@/types'

interface ISelectProps extends ViewProps {
	data: ISelect[]
	onChange?: (text: string) => void
	onBlur?: () => void
	value?: number | string
}

export default function Select({ data, onChange, onBlur, value, style }: ISelectProps) {
	return (
		<View style={[s.picker, style]}>
			<Picker
				style={s.input}
				onValueChange={value => onChange && onChange(value.toString())}
				selectedValue={value}
				onBlur={onBlur}
			>
				{data.map((item, index) => (
					<Picker.Item key={index} style={s.option} label={item.nome} value={item.id} />
				))}
			</Picker>
		</View>
	)
}
