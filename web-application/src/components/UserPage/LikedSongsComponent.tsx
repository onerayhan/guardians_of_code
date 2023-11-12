import React, { useEffect, useState } from 'react';
import {FcLike} from 'react-icons/fc';
import {BiRepost} from 'react-icons/bi';
import { Button } from 'flowbite-react';



interface LikedSongsArray {
    id: number;
    songName: string;
    owner: string;
    genre: string;
    time: string;
    likes: number;
    reposts: number;
    postedDate: string;
  
  }

const LikedSongsComponent:React.FC = () => { 
 
    const likedsongs: LikedSongsArray[] = [
      {
        id: 1,
        songName: 'Song 1',
        owner: 'Artist 1',
        genre: 'Pop',
        time: '3:45',
        likes: 100,
        reposts: 20,
        postedDate: 'October 15, 2023'
      },
      {
        id: 2,
        songName: 'Song 1',
        owner: 'Artist 1',
        genre: 'Pop',
        time: '3:45',
        likes: 100,
        reposts: 20,
        postedDate: 'October 15, 2023'
      },
      {
        id: 3,
        songName: 'Song 1',
        owner: 'Artist 1',
        genre: 'Pop',
        time: '3:45',
        likes: 100,
        reposts: 20,
        postedDate: 'October 15, 2023'
      },
      {
        id: 4,
        songName: 'Song 1',
        owner: 'Artist 1',
        genre: 'Pop',
        time: '3:45',
        likes: 100,
        reposts: 20,
        postedDate: 'October 15, 2023'
      },
      {
        id: 5,
        songName: 'Song 1',
        owner: 'Artist 1',
        genre: 'Pop',
        time: '3:45',
        likes: 100,
        reposts: 20,
        postedDate: 'October 15, 2023'
      },
      {
        id: 6,
        songName: 'Song 1',
        owner: 'Artist 1',
        genre: 'Pop',
        time: '3:45',
        likes: 100,
        reposts: 20,
        postedDate: 'October 15, 2023'
      },
     
    ];
   
   
    /*const [likedsongs, setLikedSongs] = useState<LikedSongsArray[]>([]);
  
    useEffect(() => {
      
      const apiUrl = 'https://api.example.com/songs';
  
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setSongs(data))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);
  */
    
  return(
  <div className="w-5/6 p-4 divide-y">
  
            {likedsongs.map((likedsong) => (
              <div key={likedsong.id} className="w-[950px] h-[100px] flex items-center ml-2.5 mt-2.5 mx-auto my-0 p-2.5 rounded-lg">
                <div className="w-[75px] h-[75px] border mr-2.5 border-solid border-black">
                  <img src={"emre.url"} alt={""} />
                </div>
                <h3>{likedsong.songName}</h3>
                <p className='ml-2'>By {likedsong.owner}</p>
                <p className='ml-2'>Genre: {likedsong.genre}</p>
                <p className='ml-2'>Time: {likedsong.time}</p>
                <div className="flex ml-2 flex-wrap gap-2">
                </div>
                <p className="text-sm ml-[5px]">Posted on {likedsong.postedDate}</p>
                <Button color="white" className='ml-3'>
                  <FcLike className="h-6 w-6" />
                </Button>
                <Button color="white">
                  <BiRepost className="h-6 w-6" />
                </Button>
              
              </div>
            ))}
          </div>
  );
  
  };

export default LikedSongsComponent;