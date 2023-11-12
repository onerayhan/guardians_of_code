import React, { useEffect, useState } from 'react';
import {FcLike} from 'react-icons/fc';
import {BiRepost} from 'react-icons/bi';
import { Button } from 'flowbite-react';


interface PostedSongsArray {
    id: number;
    songName: string;
    owner: string;
    genre: string;
    time: string;
    likes: number;
    reposts: number;
    postedDate: string;
  
  }

  const PostedSongsComponent:React.FC = () => { 
 
    const postedsongs: PostedSongsArray[] = [
      {
        id: 1,
        songName: 'Song 5000',
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

    /*const [postedsongs, setPostedSongs] = useState<PostedSongsArray[]>([]);
  
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
            {postedsongs.map((postedsong) => (
              <div key={postedsong.id} className="w-[950px] h-[100px] flex items-center ml-2.5 mt-2.5 mx-auto my-0 p-2.5 rounded-lg">
                <div className="w-[75px] h-[75px] border mr-2.5 border-solid border-black">
                  <img src={"emre.url"} alt={""} />
                </div>
                <h3>{postedsong.songName}</h3>
                <p className='ml-2'>By {postedsong.owner}</p>
                <p className='ml-2'>Genre: {postedsong.genre}</p>
                <p className='ml-2'>Time: {postedsong.time}</p>
                <div className="flex ml-2 flex-wrap gap-2">
                </div>
                <p className="text-sm ml-[5px]">Posted on {postedsong.postedDate}</p>
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

  export default PostedSongsComponent;