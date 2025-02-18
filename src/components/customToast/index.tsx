import React from 'react'
import Toast from 'react-native-toast-message'
import { fontFamily } from '@/styles/font-family'
import { colors } from '@/styles/colors'

type ToastProps = {
	type: 'success' | 'error' | 'info'
	title: string
	message: string
}

export const showToast = ({ type, title, message }: ToastProps) => {
	Toast.show({
		type,
		position: 'bottom',
		text1: title,
		text2: message,
		text2Style: {
			fontFamily: fontFamily.regular,
			color: colors.gray[600],
		},
		visibilityTime: 3000,
	})
}
