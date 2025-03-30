import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, Modal, FlatList } from 'react-native'
import { ISelect } from '@/types'
import { styles } from './styles'
import { Feather } from '@expo/vector-icons'

interface ISelectProps {
	data: ISelect[]
	onChange?: (value: string) => void
	value?: string | number
	placeholder?: string
}

export default function Select({ data, onChange, value, placeholder = 'Selecione um item' }: ISelectProps) {
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedItem, setSelectedItem] = useState<ISelect | undefined>(data.find(item => item.id === value))

	useEffect(() => {
		setSelectedItem(data.find(item => item.id === value))
	}, [value, data])

	const handleSelect = (item: ISelect) => {
		setSelectedItem(item)
		onChange?.(item.id!.toString())
		setModalVisible(false)
	}

	return (
		<View>
			<TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
				<Text ellipsizeMode='tail' numberOfLines={1} style={[styles.text, !selectedItem && styles.placeholder]}>
					{selectedItem?.nome || placeholder}
				</Text>
				<Text style={styles.arrow}>
					<Feather name='chevron-down' size={20} />
				</Text>
			</TouchableOpacity>

			<Modal visible={modalVisible} animationType='slide' transparent>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>{placeholder}</Text>
						<FlatList
							data={data}
							keyExtractor={item => item.id!.toString()}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[styles.option, item.id === selectedItem?.id && styles.selectedOption]}
									onPress={() => handleSelect(item)}
								>
									<Text style={styles.optionText}>{item.nome}</Text>
									{item.id === selectedItem?.id && (
										<Text style={styles.checkmark}>
											<Feather name='check' size={20} />
										</Text>
									)}
								</TouchableOpacity>
							)}
						/>
						<TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
							<Text style={styles.closeText}>Fechar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	)
}
