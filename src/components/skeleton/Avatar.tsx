import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import { StyleSheet } from 'react-native'

export const SkeletonAvatar = () => {
	return (
		<ContentLoader
			speed={2}
			viewBox='0 0 380 70'
			backgroundColor='#f3f3f3'
			foregroundColor='#cccccc'
			style={styles.skeleton}
		>
			<Circle cx='30' cy='30' r='30' />
			<Rect x='70' y='10' rx='4' ry='4' width='100' height='12' />
			<Rect x='70' y='30' rx='4' ry='4' width='150' height='16' />
		</ContentLoader>
	)
}

const styles = StyleSheet.create({
	skeleton: {
		width: '100%',
		height: 70,
		padding: 24,
		paddingTop: 32,
		marginTop: 32,
	},
})
