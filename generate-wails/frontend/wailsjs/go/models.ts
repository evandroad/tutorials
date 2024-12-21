export namespace main {
	
	export class Tutorial {
	    number: number;
	    title: string;
	    image: string;
	
	    static createFrom(source: any = {}) {
	        return new Tutorial(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.number = source["number"];
	        this.title = source["title"];
	        this.image = source["image"];
	    }
	}

}

