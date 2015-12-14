class Scheduler {

    constructor() {
        this.resources = new Map();
        this.defaultPrioriy = {
            'fonts': 1,
            'css': 2,
            'js': 3,
            'images': 4
        };
        // Count - Limit when we need to fireaway all requests
        this.resCount = 0;
    }

    getResourceType(url) {
        const requestURL = new URL(url);
        const arr = requestURL.pathname.split('.');
        return arr[arr.length - 1];
    }

    fireAllRequests(timeout, callback) {
        return setTimeout (() => {
            this.resources.map((type) => {
                const resArr = this.resources[type];
                callback(resArr);
            });
        }, timeout);
    }

    add(request) {
        this.resCount++;
        if (this.resCount > 6) {
            this.resCount = 0;
            this.fireAllRequests();
        }

        const type = this.getResourceType(request.url);
        let resArr = [];
        if (this.resources.has(type)) {
            resArr = this.resources.get(type);
        } else {
            this.resources.set(type, resArr);
        }
        
        const priority = this._getResPriority(request.url, type);
        resArr.push(Object.assign(request, {priority: priority}));
    }

    remove(request) {
        const type = this.getResourceType(request.url);
        const resArr = this.resources.get(type);
        if (resArr !== undefined) {
            const index = resArr.indexOf(request);
            resArr.splice(index, 1);
        }
    }

    _getResPriority(url, type) {
        const priRegex = /[?&]priority=([^&]+)/i;
        const value = priRegex.exec(url);
        let priority;
        if (value && value.length > 0) {
            priority = value[1];
        } else {
            priority = this.priority[type];
        }
        return priority;
    }
}

export default new Scheduler();