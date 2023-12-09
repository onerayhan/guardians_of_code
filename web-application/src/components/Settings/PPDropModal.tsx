import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Alert, AlertIcon } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    useDisclosure,
    Box
} from '@chakra-ui/react';
import {useAuthUser} from "react-auth-kit";

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
            {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
        </div>
    );
};

const PPDropModal: React.FC = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const auth = useAuthUser();

    const onFileAccepted = (acceptedFiles: FileWithPreview[]) => {
        setFiles(acceptedFiles);
    };

    const handleUpload = async () => {
        const username = auth()?.username;
        const formData = new FormData();
        formData.append('username', `${username}`)
        files.forEach(file => formData.append('photo', file));

        try {
            const response = await axios.post('http://51.20.128.164/api/upload_photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
            <Button onClick={onOpen} colorScheme="orange">Upload Photo</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Your Profile Photo</ModalHeader>
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

export default PPDropModal;