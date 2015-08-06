class Scheduler {

	constructor() {
		this.results = {
			"js": [],
			"css": [],
			"img": [],
			"fonts": []
		};
	}

	add(type, req) {
		let resArr = this.results[type];
		let priority = this._getResPriority(req);
		if (resArr !== undefined) {
			resArr.push(req);
		}
	}

	remove(type, req) {
		let resArr = this.results[type];
		if (resArr !== undefined) {
			let index = resArr.indexOf(req);
			resArr.splice(index, 1);
		}
	}

	_getResPriority(req) {
		let reqUrl = req.url;
		let priRegex = /[?&]priority=([^&]+)/i;
		let value = priRegex.exec(reqUrl);
		if(value !== null){
			return value[1];
		}
		return 5;
	}
}

export default new Scheduler();