import { TwitterApi } from 'twitter-api-v2';

class TwitterClient {
    private client: TwitterApi;

    constructor(apiKey: string, apiSecret: string, accessToken: string, accessSecret: string) {
        this.client = new TwitterApi({
            appKey: apiKey,
            appSecret: apiSecret,
            accessToken: accessToken,
            accessSecret: accessSecret,
        });
    }

    async postTweet(tweetText: string): Promise<void> {
        try {
            const tweet = await this.client.v1.tweet(tweetText);
            console.log(`Tweeted: ${tweet.text}`);
        } catch (error) {
            console.error('Error posting tweet:', error);
        }
    }
}

// Usage
const apiKey = 'YOUR_API_KEY';
const apiSecret = 'YOUR_API_SECRET_KEY';
const accessToken = 'YOUR_ACCESS_TOKEN';
const accessSecret = 'YOUR_ACCESS_SECRET';

const twitterClient = new TwitterClient(apiKey, apiSecret, accessToken, accessSecret);
twitterClient.postTweet('Hello, world!');