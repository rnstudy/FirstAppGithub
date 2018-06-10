export default class HttpUtil {
	//封装get请求
	static get(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(response => response.json())
				.then(result => {
					resolve(result);
				})
				.catch(error => {
					reject(error);
				}).done()
		})
	}

	//封装post请求
	static post(url, data) {
		return new Promise((resolve, reject) => {
			fetch(url, {
					method: 'POST',
					header: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data)
				})
				.then(response => response.json())
				.then(result => {
					resolve(result);
				})
				.catch(error => {
					reject(error);
				}).done()
		})
	}
}