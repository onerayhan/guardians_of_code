import React, { useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { Avatar } from 'flowbite-react';


interface Following{
    id: number;
    name: string;
    imageUrl: string;
  }
  
  const Followings: React.FC = () => {
  
    const [openModal, setOpenModal] = useState(false);
  
    const followings: Following[]=[
      { id: 1, name: 'User 1', imageUrl: 'user1.jpg' },
      { id: 2, name: 'User 2', imageUrl: 'user2.jpg' },
      { id: 3, name: 'User 3', imageUrl: 'user3.jpg' },
      { id: 1, name: 'User 1', imageUrl: 'user1.jpg' },
      { id: 2, name: 'User 2', imageUrl: 'user2.jpg' },
      { id: 3, name: 'User 3', imageUrl: 'user3.jpg' },
      { id: 1, name: 'User 1', imageUrl: 'user1.jpg' },
      { id: 2, name: 'User 2', imageUrl: 'user2.jpg' },
      { id: 3, name: 'User 3', imageUrl: 'user3.jpg' },
      { id: 1, name: 'User 1', imageUrl: 'user1.jpg' },
      { id: 2, name: 'User 2', imageUrl: 'user2.jpg' },
      { id: 3, name: 'User 3', imageUrl: 'user3.jpg' },
      { id: 1, name: 'User 1', imageUrl: 'user1.jpg' },
      { id: 2, name: 'User 2', imageUrl: 'user2.jpg' },
      { id: 3, name: 'User 3', imageUrl: 'user3.jpg' },
      { id: 1, name: 'User 1', imageUrl: 'user1.jpg' },
      { id: 2, name: 'User 2', imageUrl: 'user2.jpg' },
      { id: 3, name: 'User 3', imageUrl: 'user3.jpg' },
  
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

    return (
      <>
        <Button className="ml-2" gradientDuoTone="pinkToOrange" onClick={() => setOpenModal(true)}>Following:1000</Button>
        <Modal show={openModal} size="sm" onClose={() => setOpenModal(false)}>
          <Modal.Header>Following</Modal.Header>
          <Modal.Body>
          <ul className="items-center p-[20px] divide-y">
            {followings.map((following) => (
          <li key={following.id} className="flex items-center w-[250px] h-[50px] bg-white rounded mb-4 p-px">
          <Avatar img="/images/people/profile-picture-5.jpg" rounded>
              <div className="space-y-1 font-medium dark:text-white">
              <div className="text-[10px] font-medium text-black mx-auto my-0">{following.name}</div>
              </div>
          </Avatar>
          </li>
          ))}
          </ul>
          </Modal.Body>
        </Modal>
      </>
    );
  
  }

  export default Followings;