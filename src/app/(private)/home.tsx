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

export default function Home() {
	const db = useSQLiteContext()
	const [isLoading, setIsLoading] = useState(true) // Estado para controlar o carregamento

	const createTables = async () => {
		await createUsuarioTable(db)
		await createTurmaTable(db)
		await createAlunoTable(db)
		await createDisciplinaTable(db)
		await createNotaTable(db)
		console.log('Tabelas criadas com sucesso!')
	}

	useEffect(() => {
		const loadData = async () => {
			await createTables()
			setTimeout(() => {
				setIsLoading(false)
			}, 2000)
		}
		loadData()
	}, [])

	const { user } = useAuth()
	const imageUri: string | null = user?.image ?? null

	return (
		<DrawerSceneWrapper>
			<View style={s.container}>
				{isLoading ? (
					<SkeletonAvatar />
				) : (
					<View style={s.header}>
						<Image
							style={s.avatar}
							source={
								imageUri
									? { uri: imageUri }
									: user?.genero === 'M'
										? require('@/assets/images/icon.png')
										: require('@/assets/images/professora.png')
							}
						/>
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
