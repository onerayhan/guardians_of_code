import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthUser } from 'react-auth-kit';
import { AwesomeButtonSocial } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss"

interface RatedArray {
    artist: string;
    album: string;
    song: string;
    song_rating: number;
}

interface TopItem {
    name: string;
    averageRating: number;
}

interface TweetButtonProps {
    shareType: 'albums' | 'performers' | 'songs';
}

const TweetButton: React.FC<TweetButtonProps> = ({ shareType }) => {
    const authUser = useAuthUser();
    const [topItems, setTopItems] = useState<TopItem[]>([]);

    useEffect(() => {
        const calculateTopItems = async () => {
            try {
                const username = authUser()?.username;
                if (!username) throw new Error("Username is undefined");

                const response = await axios.get(`http://51.20.128.164/api/user_song_ratings/${username}`);
                const ratedArray: RatedArray[] = response.data[`user_song_ratings`];

                let items: { [key: string]: { totalRating: number; count: number } } = {};
                ratedArray.forEach((item) => {
                    let key: string;
                    switch (shareType) {
                        case 'albums':
                            key = item.album;
                            break;
                        case 'performers':
                            key = item.artist;
                            break;
                        case 'songs':
                            key = item.song;
                            break;
                        default:
                            return;
                    }

                    items[key] = items[key
                        ] || { totalRating: 0, count: 0 };
                    items[key].totalRating += item.song_rating;
                    items[key].count += 1;
                });

                const sortedItems: TopItem[] = Object.entries(items)
                    .map(([name, { totalRating, count }]) => ({
                        name,
                        averageRating: totalRating / count
                    }))
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 3);

                setTopItems(sortedItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        calculateTopItems();
    }, []);

    return (
        <>
            <div className="py-2">
                <AwesomeButtonSocial
                    cssModule={AwesomeButtonStyles}
                    type="twitter"
                    sharer={{
                        message: `Hello, these are my favourite 3 ${shareType} in Armonify:
                            1. ${topItems[0]?.name} - ${topItems[0]?.averageRating}, 2. ${topItems[1]?.name} - ${topItems[1]?.averageRating}, 3. ${topItems[2]?.name} - ${topItems[2]?.averageRating}`,
                    }}
                >
                    Post to Twitter
                </AwesomeButtonSocial>
            </div>
        </>

    );
};

export default TweetButton;