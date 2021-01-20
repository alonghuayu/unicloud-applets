<template>
	<view class="content">
		<swiper class="swiper" :autoplay="swiperAuthPlay" indicator-dots="true">
			<swiper-item class="swiper-item" v-for="item in swiperList" :key="item.id" @click="rooterLink(item.page)">
				<image class="swiper-item-img" :src="item.img" mode="widthFix"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { routeLink } from "@/utils/tools"
	export default {
		data() {
			return {
				swiperAuthPlay: true,
				swiperList: [
					{
						id: 0,
						page: '/pages/search/index',
						img: '/static/image/garbage.jpeg',
						title: '垃圾分类'
					},
					{
						id: 1,
						page: '/pages/notes/index',
						img: '/static/image/notes.jpg',
						title: '笔记本'
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			rooterLink(page){
				routeLink(page)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.swiper{
			width: 100%;
			height: 390rpx;
			.swiper-item-img{
				width: 100%;
			}
		}
	}
</style>
