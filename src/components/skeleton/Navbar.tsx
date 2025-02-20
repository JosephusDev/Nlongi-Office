import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import { StyleSheet } from 'react-native'

export const SkeletonNavbar = () => {
	return (
		<ContentLoader
			speed={2}
			viewBox='0 0 400 400'
			backgroundColor='#f3f3f3'
			foregroundColor='#dddddd'
			style={s.container}
		>
			{/* Botões da Navbar */}
			<Rect x='10' y='10' rx='8' ry='8' width='100' height='40' />
			<Rect x='120' y='10' rx='8' ry='8' width='100' height='40' />
			<Rect x='230' y='10' rx='8' ry='8' width='100' height='40' />

			{/* Campo de pesquisa */}
			<Rect x='10' y='70' rx='8' ry='8' width='380' height='40' />

			{/* Gráficos */}
			<Rect x='10' y='130' rx='8' ry='8' width='380' height='500' />
		</ContentLoader>
	)
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: -160,
	},
})
