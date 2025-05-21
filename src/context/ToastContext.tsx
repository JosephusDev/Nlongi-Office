// context/ToastContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { View } from 'react-native'
import { CustomToast } from '../components/CustomToast'

interface ToastMessage {
	id?: number
	title: string
	message: string
	type: 'success' | 'error' | 'info'
	duration?: number
}

interface ToastContextProps {
	showToast: (message: ToastMessage) => void
	removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [messages, setMessages] = useState<ToastMessage[]>([])

	const showToast = (message: ToastMessage) => {
		setMessages(prev => [...prev, { ...message, id: Date.now() }])
	}

	const removeToast = (id: number) => {
		setMessages(prev => prev.filter(msg => msg.id !== id))
	}

	return (
		<ToastContext.Provider value={{ showToast, removeToast }}>
			{children}
			<View style={{ position: 'absolute', top: 60, left: 0, right: 0 }}>
				{messages.map(msg => (
					<CustomToast
						key={msg.id}
						id={msg.id ?? 0}
						title={msg.title}
						message={msg.message}
						type={msg.type}
						duration={msg.duration}
						onHide={removeToast}
					/>
				))}
			</View>
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within ToastProvider')
	}
	return context
}
