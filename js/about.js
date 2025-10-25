function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	
	// Creates new array of Tweet times to find earliest and latest times
	const tweet_times = tweet_array.map(tweet => tweet.time.getTime());
	const earliest_tweet = new Date(Math.min(...tweet_times));
	const latest_tweet = new Date(Math.max(...tweet_times));

	// Formats the earliest and latest Tweet times to specified format (e.g. Friday, October 24, 2025)
	const date_info = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'};
	document.getElementById('firstDate').innerText = earliest_tweet.toLocaleDateString('en-US', date_info);
	document.getElementById('lastDate').innerText = latest_tweet.toLocaleDateString('en-US', date_info);

	// Counts the amount of each type of Tweet
	let completed_count = 0, live_count = 0, achievement_count = 0, miscellaneous_count = 0;

	tweet_array.forEach(tweet => {switch (tweet.source) {
		case 'completed_event':
			completed_count++;
			break;
		case 'achievement':
			achievement_count++;
			break;
		case 'live_event':
			live_count++;
			break;
		default:
			miscellaneous_count++;
			break;
	}});

	const percent_format = (event_count, total) => {
		if (total === 0) return '0.00%';
		return math.format((event_count / total) * 100, {notation: 'fixed', precision: 2}) + '%';
	};

	// Modifying the DOM, searching for the class with specified events and percentages
	document.querySelectorAll('.completedEvents').forEach(e => e.innerText = completed_count);
	document.querySelectorAll('.completedEventsPct').forEach(e => e.innerText = percent_format(completed_count, tweet_array.length));

	document.querySelectorAll('.liveEvents').forEach(e => e.innerText = live_count);
	document.querySelectorAll('.liveEventsPct').forEach(e => e.innerText = percent_format(live_count, tweet_array.length));

	document.querySelectorAll('.achievements').forEach(e => e.innerText = achievement_count);
	document.querySelectorAll('.achievementsPct').forEach(e => e.innerText = percent_format(achievement_count, tweet_array.length));

	document.querySelectorAll('.miscellaneous').forEach(e => e.innerText = miscellaneous_count);
	document.querySelectorAll('.miscellaneousPct').forEach(e => e.innerText = percent_format(miscellaneous_count, tweet_array.length));

	// Filter completed events from all events
	const completed_tweets = tweet_array.filter(e => e.source === "completed_event");
	// Filter written completed events for all completed events
	const written_tweets = completed_tweets.filter(e => e.written);
	
	// Modifying the DOM, searching for the class with 
	document.querySelectorAll('.written').forEach(e => e.innerText = written_tweets.length);
	document.querySelectorAll('.writtenPct').forEach(e => e.innerText = percent_format(written_tweets.length, completed_tweets.length));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});