class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        const lowercase_tweet_text = this.text.toLowerCase();
        if (lowercase_tweet_text.includes("completed") || lowercase_tweet_text.includes("just posted")) {
            return "completed_event";
        }
        else if (lowercase_tweet_text.includes("live") || lowercase_tweet_text.includes("right now")) {
            return "live_event";
        }
        else if (lowercase_tweet_text.includes("achieved") || lowercase_tweet_text.includes("goal")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes("-")) {
            return true;
        }
        return false;
    }

    // returns the Tweet's user-written text
    get writtenText():string {
        if(!this.written) {
            return "";
        }
        let text = this.text.replace(/https?:\/\/\S+/g, "").replace(/#\w+/g, "").trim();
        const sep_index = text.indexOf(" - ");
        text = text.substring(sep_index + " - ".length).trim();
        return text.length > 0 ? text : "";
    }

    // returns the activity type of the Tweet
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        const removed_link = this.text.split(/https?:\/\/\S+/);
        const text = removed_link[0];

        if (text.includes("ski")) {
            return "ski";
        }
        else if (text.includes("skate")) {
            return "skate";
        }
        else if (text.includes("snowboard")) {
            return "snowboard";
        }
        else if (text.includes("swim")) {
            return "swim";
        }
        else if (text.includes("row")) {
            return "row";
        }
        else if (text.includes("bike") || text.includes("cycle")) {
            return "bike";
        }
        else if (text.includes("elliptical")) {
            return "elliptical";
        }
        else if (text.includes("spin")) {
            return "spin";
        }
        else if (text.includes("strength workout")) {
            return "strength workout";
        }
        else if (text.includes("circuit workout")) {
            return "circuit workout";
        }
        else if (text.includes("CrossFit")) {
            return "CrossFit";
        }
        else if (text.includes("yoga")) {
            return "yoga";
        }
        else if (text.includes("dance")) {
            return "dance";
        }
        else if (text.includes("badminton")) {
            return "badminton";
        }
        else if (text.includes("hike")) {
            return "hike";
        }
        else if (text.includes("walk")) {
            return "walk";
        }
        else if (text.includes("run")) {
            return "run";
        }

        return "other";
    }

    // returns the distance (mi) mentioned in Tweet
    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        const mi_match = this.text.match(/(\d+(\.\d+)?)\s*mi\b/);
        if (mi_match) return parseFloat(mi_match[1]);

        const km_match = this.text.match(/(\d+(\.\d+)?)\s*km\b/);
        if (km_match) return parseFloat(km_match[1]) * (1/1.609);
        
        return 0;
    }

    // returns the HTML line/row that is needed to fill the Tweet search
    getHTMLTableRow(rowNumber:number):string {
        const text = this.text || "";
        const removed_link = text.split(/https?:\/\/\S+/);
        const before_link = removed_link[0] || "";
        const after_link = removed_link[1] || "";
        const link_match = text.match(/https?:\/\/\S+/);
        const activity_link = link_match ? link_match[0] : null;
        
        return `<tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td>${before_link}<a href="${activity_link}">${activity_link}</a>${after_link}</td>
            </tr>`;
    }
}