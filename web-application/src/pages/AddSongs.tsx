import Header from "../components/Header";
import SongFileUpload from "../components/AddSongs/SongFileUpload";
import {FaFileAudio, FaSpotify} from "react-icons/fa";
import {Field, Form, Formik, FormikHelpers} from "formik";
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import axios, {AxiosError} from 'axios';
import { VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import {useEffect, useState} from "react";
import TweetButton from "../APIClasses/TweetButton";
import * as Yup from "yup";

interface Song {
    song_id: string;
    song_name: string;
    length: string;
    tempo: string;
    recording_type: string;
    listens: string;
    release_year: string;
    added_timestamp: string;
    album_name: string;
    performer_name: string;
    mood: string;
    genre: string;
    instrument: string;
}

const getCurrentTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const validationSchema = Yup.object({
    song_name: Yup.string().required('This field is required.'),
    release_year: Yup.number()
        .min(1900, 'Year must be at least 1900') // Minimum year
        .max(new Date().getFullYear(), 'Year cannot be in the future') // Maximum year
        .integer('Year must be an integer')
        .typeError('Year must be a number'),
    length: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,'Match the following format: HH:MM:SS'),
});

const AddSongs = () => {

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();
    const [spoti_auth, setSpotiAuth] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const recordingTypes = ['LIVE', 'STUDIO', 'RADIO'];
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const auth = useAuthUser();
    const handleSpotifyIntegration = () => {
        navigate(`/${auth()?.username}/settings`);
    };
    const onSubmitRequest = async (song: any) => {
        console.log("Song: ", song);
        setError("");
        try {
            await axios.post(
                "http://51.20.128.164/api/add_song",
                {
                    username: auth()?.username, // Include username
                    song_id: song.song_id, // Replace 'song' with your song object
                    song_name: song.song_name,
                    length: song.length,
                    tempo: song.tempo,
                    recording_type: song.recording_type,
                    listens: song.listens,
                    release_year: song.release_year,
                    album_name: song.album_name,
                    performer_name: song.performer_name,
                    mood: song.mood,
                    genre: song.genre,
                    instrument: song.instrument
                }
            );

        } catch(err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }}

    useEffect(() => {
        const fetch_spoti_status = async () => {
            const apiUrl = `http://51.20.128.164/api/check_spoti_connection/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.check;
                setSpotiAuth(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetch_spoti_status();
    }, []);
    return (
        <body className="bg-[#081730]">
        <Header/>
        <div className="flex relative justify-center top-20">
            <h1 className="text-5xl text-white font-lalezar">There are 2 ways to add a song.</h1>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-[#081730]">
            {/* Left Column */}
            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <h1 className="text-white font-lalezar my-5 text-2xl">Option 1: Manually Enter Song
                    Information</h1>
                <Formik
                    initialValues={
                        {
                            song_id: '',
                            song_name: '',
                            length: '',
                            tempo: '',
                            recording_type: '',
                            listens: '',
                            release_year: '',
                            added_timestamp: '',
                            album_name: '',
                            performer_name: '',
                            mood: '',
                            genre: '',
                            instrument: ''
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={async (song: Song, {setSubmitting, resetForm}: FormikHelpers<Song>) => {
                        try {
                            await onSubmitRequest(song);
                            toast({
                                title: `Song successfully added!`,
                                status: "success",
                            })
                            resetForm();
                        } catch (error) {
                            // Handle error
                            console.error('Submission error:', error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({errors, touched, isValid, isSubmitting}) => (
                        <Form className="flex flex-col items-center justify-center gap-y-4">
                            <div className="relative">
                                <div>
                                    <Field
                                        name="song_name"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Song Name"
                                    />
                                </div>
                                {errors.song_name && touched.song_name ? (
                                    <p className="text-red-500 font">{errors.song_name}</p>
                                ) : null}
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="length"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Length of the Song"
                                    />
                                </div>
                                {errors.length && touched.length ? (
                                    <p className="text-red-500 font">{errors.length}</p>
                                ) : null}
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="tempo"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Tempo"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Field as="select" name="recording_type" placeholder="Select Recording Type"
                                       className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl bg-white">
                                    <option value="">Select Recording Type</option>
                                    {recordingTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Field>
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="listens"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Listen Count"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="release_year"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Year of Release"
                                    />
                                </div>
                                {errors.release_year && touched.release_year ? (
                                    <p className="text-red-500 font">{errors.release_year}</p>
                                ) : null}
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="album_name"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Album Name"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="performer_name"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Performer Name"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="mood"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Mood of the Song"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="genre"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Genre"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <div>
                                    <Field
                                        name="instrument"
                                        className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                                        placeholder="Instrument"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={!isValid || isSubmitting}
                                    className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Submit
                            </button>
                            <p className="text-red-500 font">{error}</p>
                        </Form>
                    )}
                </Formik>
            </div>
            {/* Middle Column */}
            <div className="flex flex-col items-center justify-center h-full pl-14 pl-5">
                <div className="px-20"></div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col items-center justify-center h-full pl-14 pl-5">
                <VStack>
                    <h1 className="text-white font-lalezar text-2xl">Option 2: Import Song Information as Files</h1>
                    <Button
                        onClick={handleOpenModal}
                        colorScheme='yellow'
                        size='lg'
                        className="flex items-center"
                    >
                        <FaFileAudio size={20}/>
                        <span className="pl-5">Import Songs from File</span>
                    </Button>

                    {isModalOpen && <SongFileUpload isOpen={isModalOpen} onClose={handleCloseModal}/>}
                </VStack>
            </div>
        </div>
        <div className="py-5 bg-[#081730]">

        </div>
        </body>
    );
};

export default AddSongs;