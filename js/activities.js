function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const activity_counts = {};

	// Counting tweets per activity and total distance of each activity
	tweet_array.forEach(tweet => {
		const type = tweet.activityType;
		if (type) {
			activity_counts[type] = (activity_counts[type] || 0) + 1;
		}
	});

	// Sorting activity counts to see which 3 activities are the most popular (first 3 in array)
	const sorted_counts = Object.entries(activity_counts).sort((a1, a2) => a2[1] - a1[1]);

	// Modyfying the DOM for activity info
	document.getElementById("numberActivities").innerText = sorted_counts.length;
	document.getElementById("firstMost").innerText = sorted_counts[0][0];
	document.getElementById("secondMost").innerText = sorted_counts[1][0];
	document.getElementById("thirdMost").innerText = sorted_counts[2][0];

	// Visualization for counts of tweeted activities
	const count_data = sorted_counts.map(([activity, count]) => ({activity, count}));
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the number of Tweets containing each type of activity.",
	  	"data": {"values": count_data},
		"mark": "bar",
		"encoding": {
			"x": {"field": "activity", "type": "nominal", "title": "Type of Activity"},
			"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// Data for distance and aggregated visualization
	const activities_data = tweet_array.filter(tweet => (tweet.activityType === sorted_counts[0][0] || tweet.activityType === sorted_counts[1][0] || tweet.activityType === sorted_counts[2][0])).map(tweet => {
		const day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return {activity_type: tweet.activityType, distance: tweet.distance, day_of_week: day_names[tweet.time.getDay()]};
	});

	// Calcualting distance averages between the top 3 most popular activities
	const distance_data = {};
	activities_data.forEach(tweet => {distance_data[tweet.activity_type] = (distance_data[tweet.activity_type] || 0) + tweet.distance;});
	for (const activity in distance_data) {
		 const match = sorted_counts.find(item => item[0] === activity);
		distance_data[activity] = distance_data[activity] / match[1];
	}
	const sorted_avg_dist = Object.entries(distance_data).sort((a1, a2) => a2[1] - a1[1]);

	// Determining whether averages for longest activity are higher during weekdays or weekends
	let weekday_dist = 0, weekend_dist = 0, weekday_count = 0, weekend_count = 0;
	for (const tweet in activities_data) {
		if (tweet.activity_type === sorted_avg_dist[0][0]) {
			if (tweet.day_of_week === "Sun" || tweet.day_of_week === "Sat") {
				weekend_dist += tweet.distance;
				weekend_count++;
			}
			else {
				weekday_dist += tweet.distance;
				weekday_count++;
			}
		}
	}

	// Modyfying the DOM for distance info
	document.getElementById("longestActivityType").innerText = sorted_avg_dist[0][0];
	document.getElementById("shortestActivityType").innerText = sorted_avg_dist[sorted_avg_dist.length - 1][0];
	document.getElementById("weekdayOrWeekendLonger").innerText = (weekday_dist / weekday_count) > (weekend_dist / weekend_count) ? "weekdays" : "weekends";

	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the distances by day of week for all of the three most tweeted-about activites.",
	  	"data": {"values": activities_data},
		"mark": "point",
		"encoding": {
			"x": {"field": "day_of_week", "type": "nominal", "title": "Day of Week", "sort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},
			"y": {"field": "distance", "type": "quantitative", "title": "Distance (mi)"},
			"color": {"field": "activity_type", "type": "nominal", "title": "Activity Type"}
		},
		"width": 400,
  		"height": 300
	};

	distance_vis_agg = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the mean distances by day of week for all of the three most tweeted-about activites.",
	  	"data": {"values": activities_data},
		"mark": "point",
		"encoding": {
			"x": {"field": "day_of_week", "type": "nominal", "title": "Day of Week", "sort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},
			"y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Distance (mi)"},
			"color": {"field": "activity_type", "type": "nominal", "title": "Activity Type"}
		},
		"width": 400,
  		"height": 300
	};

	let show_agg = false;
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	document.getElementById("aggregate").addEventListener("click", function() {
		show_agg = !show_agg;
		this.textContent = show_agg ? "Show All Activities" : "Show Means";
		vegaEmbed('#distanceVis', show_agg ? distance_vis_agg : distance_vis_spec, { actions: false });
	});

	/*document.getElementById("longestActivityType").innerText = sorted_dist_avgs[0][0];
	document.getElementById("shortestActivityType").innerText = sorted_dist_avgs[sorted_dist_avgs.length - 1][0];
	document.getElementById("weekdayOrWeekendLonger").innerText = (weekday_total / weekday_count) > (weekend_total / weekend_count) ? "weekdays" : "weekends";*/
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});