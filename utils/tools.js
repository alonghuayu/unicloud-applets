// 封装路由跳转
// type 1 保留当前页面，跳转到应用内的某个页面 2 关闭当前页面，跳转到应用内的某个页面 3 关闭所有页面，打开到应用内的某个页面 4 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 
export const routeLink = function () {
	let uri = arguments[0];
	let params = arguments[1];
	let type = arguments[2] || 1;
	if (!uri) {
		return
	}
	if (params) {
		let param = ''
		let list = Object.entries(params)
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			if (i === 0) {
				param = param + `?${item[0]}=${item[1]}`
			} else {
				param = param + `&${item[0]}=${item[1]}`
			}
		}
		uri = uri + param
	}
	if (type == 2) {
		uni.redirectTo({
			url: uri
		});
	} else if (type == 3) {
		uni.reLaunch({
			url: uri
		});
	} else if (type == 4) {
		uni.switchTab({
			url: uri
		});
	} else {
		uni.navigateTo({
			url: uri,
		})
	}
}