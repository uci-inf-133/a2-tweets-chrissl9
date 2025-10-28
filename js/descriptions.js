// array to store filtered tweets (global so all functions can access)
let tweet_array = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// Loads all the tweets and filters all the writtern tweets
	const mapped = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at))
	tweet_array = mapped.filter(tweet => tweet.written);
}

function addEventHandlerForSearch() {
	// Grabbing references to HTML elements from description.html to read/modify
	const text_filter = document.getElementById("textFilter");
	const search_count = document.getElementById("searchCount");
	const search_text = document.getElementById("searchText");
	const tweet_table = document.getElementById("tweetTable");

	// Updates the content of the visual search and info
	function update_search(tweets, query) {
		const rows = tweets.map((tweet, index) => {
			const row = tweet.getHTMLTableRow(index + 1);
			return row;
			}).join("");
		tweet_table.innerHTML = rows;
		search_count.innerText = tweets.length;
		search_text.innerText = query;
	}

	update_search(tweet_array);

	// Listens for changes in the search bar and updates the searched tweets to match the filter
	text_filter.addEventListener("input", function() {
		const query = this.value.toLowerCase().trim();
		if (query === "") {
			update_search([], "");
			return;
		}
		const filtered_tweets = query ? tweet_array.filter(tweet => tweet.writtenText.toLowerCase().includes(query)) : tweet_array;
		update_search(filtered_tweets, query);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});