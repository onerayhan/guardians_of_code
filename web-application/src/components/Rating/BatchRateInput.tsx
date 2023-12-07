import React, {useCallback, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {
    Alert, AlertIcon,
    Box,
    Button, Image,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import {useAuthUser} from "react-auth-kit";
import axios from "axios";

interface SongFileUploadProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FileWithPreview extends File {
    preview: string;
}

const MyDropzone: React.FC<{ onFileAccepted: (files: FileWithPreview[]) => void }> = ({ onFileAccepted }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Process files and create a preview URL
        const filesWithPreview: FileWithPreview[] = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        onFileAccepted(filesWithPreview);
    }, [onFileAccepted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

    return (
        <div {...getRootProps()} style={{ padding: 20, border: '2px dashed gray', textAlign: 'center' }}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the files here ...</p> : <p>Accepted Formats Are: .txt, .json</p>}
        </div>
    );
};
const RateFileUpload: React.FC<SongFileUploadProps> = ({ isOpen, onClose }) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const auth = useAuthUser();

    const onFileAccepted = (acceptedFiles: FileWithPreview[]) => {
        setFiles(acceptedFiles);
    };

    const handleUpload = async () => {
        const username = auth()?.username;
        const formData = new FormData();
        formData.append('username', `${username}`)
        files.forEach(file => formData.append('file', file));

        try {
            const response = await axios.post('http://13.51.167.155/api/upload_song', formData, {

            });
            setUploadStatus('success');
            console.log('Response:', response.data);
            // Handle response data
        } catch (error) {
            setUploadStatus('error');
            console.error('Error uploading file:', error);
            // Handle error
        }
    };

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Songs</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <MyDropzone onFileAccepted={onFileAccepted} />
                        {files.map(file => (
                            <Box key={file.name} p={2}>
                                <Image src={file.preview} alt={file.name} />
                            </Box>
                        ))}
                        {uploadStatus === 'success' && <Alert status="success"><AlertIcon />Upload successful!</Alert>}
                        {uploadStatus === 'error' && <Alert status="error"><AlertIcon />Upload failed!</Alert>}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost" onClick={handleUpload}>Upload</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RateFileUpload;