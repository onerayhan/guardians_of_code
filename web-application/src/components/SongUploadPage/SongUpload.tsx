import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";
import { Button } from 'flowbite-react';

// Initialize once (at the start of your app).
const uploader = Uploader({
  apiKey: "free" // Get production API keys from Bytescale
});

// Configuration options: https://www.bytescale.com/docs/upload-widget/frameworks/react#customize
const options = { multi: true };

const SongUpload = () => (
  <UploadButton uploader={uploader}
                options={options}
                onComplete={files => alert(files.map(x => x.fileUrl).join("\n"))}>
    {({onClick}) =>
    <div>
      <Button gradientDuoTone="pinkToOrange" className="mt-5"onClick={onClick}>
        Upload a file...
      </Button>
    </div>
    }
  </UploadButton>
);

export default SongUpload;