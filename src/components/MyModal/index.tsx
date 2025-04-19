import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { s } from './styles'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'

interface IModalProps {
	visible: boolean
	title: string | React.ReactNode
	subtitle?: string
	children?: React.ReactNode
	onClose?: () => void
}

export default function MyModal({ visible, title, subtitle, children, onClose }: IModalProps) {
	return (
		<Modal animationType='fade' transparent={true} visible={visible}>
			<TouchableOpacity style={s.centeredView} activeOpacity={1} onPress={onClose}>
				<TouchableOpacity style={s.modalView} activeOpacity={1} onPress={e => e.stopPropagation()}>
					{typeof title === 'string' ? <Text style={s.modalTitle}>{title}</Text> : title}
					{subtitle && <Text style={s.modalSubtitle}>{subtitle}</Text>}
					{children}
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	)
}
