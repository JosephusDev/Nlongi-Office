import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { s } from './styles'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'

interface IModalProps {
	visible: boolean
	title: string
	subtitle?: string
	children?: React.ReactNode
	onClose?: () => void
}

export default function MyModal({ visible, title, subtitle, children, onClose }: IModalProps) {
	return (
		<Modal animationType='slide' transparent={true} visible={visible}>
			<View style={s.centeredView}>
				<View style={s.modalView}>
					<TouchableOpacity style={s.closeButton} onPress={onClose}>
						<Feather name='x' size={24} color={colors.gray[500]} />
					</TouchableOpacity>
					<Text style={s.modalTitle}>{title}</Text>
					{subtitle && <Text style={s.modalSubtitle}>{subtitle}</Text>}
					{children}
				</View>
			</View>
		</Modal>
	)
}
