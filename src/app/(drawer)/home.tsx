import { s } from '@/styles/app/index'
import { Image, Text, View } from 'react-native'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { DrawerSceneWrapper } from '@/components/DrawerSceneWrapper'
import NavBar from '@/components/NavBar'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import {
	createTurmaTable,
	createUsuarioTable,
	createAlunoTable,
	createDisciplinaTable,
	createNotaTable,
} from '@/services/database'
import { SkeletonAvatar, SkeletonNavbar } from '@/components/skeleton'
import { useToast } from '@/context/ToastContext'

export default function Home() {
	const db = useSQLiteContext()
	const [isDBReady, setIsDBReady] = useState(false)
	const { user } = useAuth()
	const { showToast } = useToast()
	const imageUri: string | null = user?.image ?? null

	const createTables = async () => {
		await createUsuarioTable(db)
		await createTurmaTable(db)
		await createAlunoTable(db)
		await createDisciplinaTable(db)
		await createNotaTable(db)
		console.log('Tabelas criadas com sucesso!')
		setIsDBReady(true)
	}

	useEffect(() => {
		createTables()
	}, [])

	useEffect(() => {
		if (user && isDBReady) {
			showToast({
				title: 'Logado com sucesso',
				message: `Olá, ${user.nome}.`,
				type: 'success',
				duration: 4000,
			})
		}
	}, [user, isDBReady])

	const isLoading = !user || !isDBReady

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				{isLoading ? (
					<SkeletonAvatar />
				) : (
					<View style={s.header}>
						<Image style={s.avatar} source={imageUri ? { uri: imageUri } : require('@/assets/images/icon.png')} />
						<View style={s.user}>
							<Text style={s.hi}>Olá,</Text>
							<Text style={s.username}>{user?.nome}</Text>
						</View>
						<DrawerToggleButton />
					</View>
				)}
				{isLoading ? <SkeletonNavbar /> : <NavBar />}
			</View>
		</DrawerSceneWrapper>
	)
}
