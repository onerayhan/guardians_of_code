import React from "react";
import { Label, TextInput, Select, Button } from 'flowbite-react';



const SongUploadForm: React.FC= () =>{
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-white">Upload Your Song!</h1>
        <div>
          <TextInput id="name" placeholder="Name Of The Song" required color="gray" />
        </div>
        <div >
          <TextInput id="artistname" placeholder="Artist" required color="gray" />
        </div >
        <div >
          <TextInput id="input-success" placeholder="Input Success" required color="gray" />
        </div>
        <div>
          <TextInput id="artistname" placeholder="" required color="gray" />
        </div>
        <div>
          <TextInput id="input-warning" placeholder="Input Warning" required color="gray" />
        </div>
        <div>
        <Select id="genre" required>
            <option>Pop</option>
            <option>Rock</option>
            <option>Electronic</option>
            <option>Hip Hop</option>
        </Select>
        </div>

      </div>
    );
  }
    
    
    export default SongUploadForm;