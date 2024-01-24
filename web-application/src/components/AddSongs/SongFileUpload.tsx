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
    ModalOverlay, useToast,
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
            <input {...getInputProps()} data-testid="dropzone"/>
            {isDragActive ? <p>Drop the files here ...</p> : <p>Accepted Formats Are: .json</p>}
        </div>
    );
};
const SongFileUpload: React.FC<SongFileUploadProps> = ({ isOpen, onClose }) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const auth = useAuthUser();
    const toast = useToast();

    const onFileAccepted = (acceptedFiles: FileWithPreview[]) => {
        setFiles(acceptedFiles);
    };

    const handleUpload = async () => {
        const username = auth()?.username;
        if (!username) {
            console.error("No username found");
            return;
        }

        let filePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {
                        try {
                            const fileAsJson = JSON.parse(result);
                            resolve(fileAsJson); // This could be an object or an array
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error('File read did not return a string'));
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
        });

        try {
            const filesContents = await Promise.all(filePromises);
            // Flatten in case some files contain an array of songs
            const allSongs = filesContents.flat();

            const response = await axios.post('http://51.20.128.164/api/add_songs_batch', { username, songs: allSongs }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response.data);
            setUploadStatus('success');
        } catch (error) {
            setUploadStatus('error');
            console.log('Error uploading file:', error);
            toast(
                {
                    title: "Error",
                    description: `${error}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                }
            )
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
                                <Image alt={file.name} />
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

export default SongFileUpload;