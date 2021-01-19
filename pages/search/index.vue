<template>
	<view class="content">
		<button @click="getPhoto">获取图片</button>
		<image :src="selectImg" mode=""></image>
		<text>{{keyword}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectImg: '',
				keyword: ''
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
						console.log(res)
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
				let [err, res] = await uni.request({
					url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cS87yUqHEKsCXhXGg2Sdpzu9&client_secret=KrEv5s6WQrvyRiF4d0MpZ6UqebDbLANX"
				})
				let access_token = res.data.access_token;
				console.log(res)
				let [error, ress] = await uni.request({
					url: "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",
					method: "POST",
					header:{
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data:{
						access_token: access_token,
						image: b64,
					}
				})
				this.parseResults(ress.data.result)
				console.log(ress)
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
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
