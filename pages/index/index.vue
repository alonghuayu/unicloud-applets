<template>
	<view class="content">
		<button type="default" @click="toclassification">垃圾分类</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {
			toclassification(){
				uni.navigateTo({
					url: '../search/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
