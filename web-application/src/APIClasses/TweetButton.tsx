import { useEffect, useState } from 'react';
import useMemoizedFetch from "../contexts/useMemoizedFetch.tsx";
import { useAuthUser } from "react-auth-kit";

const TweetButton = ({ shareType }) => {
    const authUser = useAuthUser();
    const data = useMemoizedFetch("");
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {
        // Function to load the Twitter script
        const loadTwitterScript = () => {
            const existingScript = document.getElementById('twitter-wjs');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'twitter-wjs';
                script.src = 'https://platform.twitter.com/widgets.js';
                document.body.appendChild(script);
            }
        };

        // Load the Twitter script
        loadTwitterScript();

        // Calculate top items if data is available
        if (data && authUser()) {
            calculateTopItems();
        }

        // Cleanup function to remove the script when the component unmounts
        return () => {
            const existingScript = document.getElementById('twitter-wjs');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [shareType, data, authUser]);

    // Function to calculate the top items based on shareType
    const calculateTopItems = () => {
        const username = `${authUser()?.username}`
        let items = {};

        // @ts-ignore
        data.filter(item => item.Username === username).forEach(item => {
            let key;
            switch (shareType) {
                case 'albums':
                    key = item.Album;
                    break;
                case 'performers':
                    key = item.Artist;
                    break;
                case 'songs':
                    key = item.Song;
                    break;
                default:
                    return;
            }

            if (!items[key]) {
                items[key] = { totalRating: 0, count: 0 };
            }

            items[key].totalRating += item.Rating;
            items[key].count += 1;
        });

        // Convert to array, calculate averages, and sort
        let sortedItems = Object.entries(items)
            // @ts-ignore
            .map(([name, { totalRating, count }]) => ({
                name,
                averageRating: totalRating / count
            }))
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 5);
        // @ts-ignore
        setTopItems(sortedItems);
    };

    const tweetText = () => {
        if (topItems.length === 0) {
            return '';
        }

        // @ts-ignore
        const itemList = topItems.map(item => `${item.name} (Rating: ${item.averageRating.toFixed(1)})`).join(', ');
        return `Hello, these are my favourite 5 ${shareType} in Armonify: ${itemList}`;
    };

    const encodedTweet = encodeURIComponent(tweetText());

    return (
        <a href={`https://twitter.com/intent/tweet?text=${encodedTweet}`}
           className="twitter-share-button"
           data-size="large">
            Tweet
        </a>
    );
};

export default TweetButton;
