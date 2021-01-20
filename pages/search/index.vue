<template>
	<view class="content">
		<view class="search-box">
			<icon class="icon" type="search" size="16"/>
			<input class="search-box-input" type="text" v-model="value" placeholder="请输入关键词" @confirm="searchKeyword(value)" />
			<image class="search-box-img" src="@/static/image/camera.png" mode="widthFix" @click="getPhoto"></image>
		</view>
		<image v-if="selectImg" class="search-result-img" :src="selectImg" mode="aspectFit"></image>
		<text class="keyword" v-if="keyword">{{keyword}}</text>
		<view class="result-list">
			<view v-if="searchresults.matched">{{searchresults.matched}}</view>
			<view class="result-item" v-for="(item,index) in searchresults.similars" :key="index">
				<view class="item-key">{{item.keywords}}</view>
				<view class="item-name">{{item.typename}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectImg: '',
				keyword: '',
				value: '',
				searchresults: '',
			}
		},
		onLoad() {

		},
		methods: {
			// 获取照片
			getPhoto(){
				uni.chooseImage({
					count:1,
					success: (res) => {
						this.selectImg = res.tempFilePaths[0];
						this.image2base64(res.tempFilePaths[0])
					}
				})
			},
			// 转成base64
			 image2base64(img){
				// const base64 = uni.getFileSystemManager().readFileSync(this.selectImg, 'base64')
				uni.getFileSystemManager().readFile({
					filePath:img,
					encoding:'base64',
					success:(res)=>{
						console.log(res.data)
						// key cS87yUqHEKsCXhXGg2Sdpzu9
						// secret KrEv5s6WQrvyRiF4d0MpZ6UqebDbLANX
						this.imageClassify(res.data)
					}
				})
			},
			// 请求百度图像识别 识别物体
			async imageClassify(b64){
				// let [err, res] = await uni.request({
				// 	url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cS87yUqHEKsCXhXGg2Sdpzu9&client_secret=KrEv5s6WQrvyRiF4d0MpZ6UqebDbLANX"
				// })
				// let access_token = res.data.access_token;
				// console.log(res)
				// let [error, ress] = await uni.request({
				// 	url: "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",
				// 	method: "POST",
				// 	header:{
				// 		"Content-Type": "application/x-www-form-urlencoded"
				// 	},
				// 	data:{
				// 		access_token: access_token,
				// 		image: b64,
				// 	}
				// })
				uniCloud.callFunction({
					name: "ImageClassify",
					data:{
						image: b64
					},
					success: (res) => {
						this.parseResults(res.result.result)
					}
				})
			},
			// 展示图片的结果
			parseResults(result){
				let itemList = [], abs_result_index;
				for(let i = 0; i < result.length; i++){
					if(result[i].score > .7){
						abs_result_index = i;
						break;
					}
					itemList.push(result[i].keyword + '' + result[i].score)
				}
				if(abs_result_index>=0){
					this.searchKeyword(result[abs_result_index].keyword);
					return;
				}
				uni.showActionSheet({
					itemList:itemList,
					success: (res) => {
						this.searchKeyword(result[res.tapIndex].keyword)
					}
				})
			},
			// 使用图片识别的结果去查询垃圾分裂并展示
			searchKeyword(kw){
				this.keyword = kw;
				uniCloud.callFunction({
					name:"TrashClassify",
					data:{
						keyword: kw
					},
					success: (res) => {
						this.searchresults = res.result;
					}
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
		padding: 40rpx;
		.icon{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50rpx;
			height: 50rpx;
		}
		.search-box{
			display: flex;
			align-items: center;
			width: 100%;
			height: 80rpx;
			border: 1rpx solid #e8e8e8;
			border-radius: 40rpx;
			padding: 0 20rpx;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			.search-box-input{
				flex: 1;
				height: 100%;
				padding: 0 10rpx;
				text-align: center;
			}
			.search-box-img{
				width: 50rpx;
				height: 50rpx;
			}
		}
		.search-result-img{
			width: 600rpx;
			height: 600rpx;
			margin-top: 40rpx;
		}
		.keyword{
			font-size: 32rpx;
			color: #666;
			margin: 20rpx 0;
		}
		.result-list{
			width: 100%;
			color: #666;
			font-size: 24rpx;
			.result-item{
				height: 60rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #eee;
				.item-key{
					width: 520rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
				.item-name{
					width: 90rpx;
					text-align: right;
				}
			}
		}
	}
</style>
