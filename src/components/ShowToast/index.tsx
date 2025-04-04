import { useToast } from '@/context/ToastContext'

type ToastProps = {
	type: 'success' | 'error' | 'info'
	title: string
	message: string
	duration?: number
}

export const showToast = ({ type, title, message, duration = 3000 }: ToastProps) => {
	const { showToast } = useToast()
	console.log('showToast')
	showToast({ id: Date.now(), type, title, message, duration })
}
