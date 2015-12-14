class Scheduler {

    constructor() {
        this.resources = new Map();
        this.defaultPrioriy = {
            'css': 1,
            'fonts': 2,
            'js': 3,
            'images': 4
        };
        // Count - Limit when we need to fireaway all requests
        this.resCount = 0;
        // Just to maintain the priority
        this.createLocalState();
    }

    createLocalState() {
        Object.keys(this.defaultPrioriy).map( (k) => {
            this.resources.set(k, []);
        });
    }

    getResourceType(url) {
        const requestURL = new URL(url);
        const arr = requestURL.pathname.split('.');
        let type = arr[arr.length - 1];
        if (type == 'jpg' || type == 'png') {
            type = 'images';
        } else if (type == 'woff' || type == 'woff2') {
            type = 'fonts';
        }
        return type;
    }

    sortResource(resArr) {
        if (resArr.length > 0) {
            resArr.sort((a,b) => {
                return parseInt(a.priority) - parseInt(b.priority);
            });
        }
        return resArr;
    }

    fireAllRequests(timeout, callback) {
        setTimeout (() => {
            console.log(this.resources);
            for (let value of this.resources.values()) {
                const resArr = this.sortResource(value);
                callback(resArr);
            }
        }, timeout);
    }

    add(request, callback) {
        const type = this.getResourceType(request.url);
        if (type == '/') {
            return;
        }

        this.resCount++;
        if (this.resCount > 6) {
            this.resCount = 0;
            this.fireAllRequests(1000, callback);
        }

        let resArr = [];
        if (this.resources.has(type)) {
            resArr = this.resources.get(type);
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
            priority = this.defaultPrioriy[type];
        }
        return priority;
    }
}

export default new Scheduler();