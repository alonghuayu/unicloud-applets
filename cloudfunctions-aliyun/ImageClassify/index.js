'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const res = await uniCloud.httpclient.request(
	"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cS87yUqHEKsCXhXGg2Sdpzu9&client_secret=KrEv5s6WQrvyRiF4d0MpZ6UqebDbLANX",
	{
		dataType:"json"
	});
	
	const access_token = res.data.access_token;
	
	const classify_res = await uniCloud.httpclient.request(
			"https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",
			{
				headers:{
					"Content-Type":"application/x-www-form-urlencoded"
				},
				method:"POST",
				dataType:"json",
				data:{
					image:event.image,
					access_token:access_token
				}
			}
		);
	
	//返回数据给客户端
	return classify_res.data
};
