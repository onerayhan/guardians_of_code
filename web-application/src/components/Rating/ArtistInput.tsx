import React, { useState } from 'react';
import { Box, Button, Input, Flex, Stack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';

const ArtistInput = () => {
    const [genre, setGenre] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
    };

    const addGenre = () => {
        const trimmedGenre = genre.trim();
        if (trimmedGenre !== '' && !selectedGenres.includes(trimmedGenre)) {
            setSelectedGenres(prevGenres => [...prevGenres, trimmedGenre]);
            setGenre(''); // Reset input field after adding
        }
    };

    const removeGenre = (genreToRemove: string) => {
        setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
    };

    return (
        <Box className="flex flex-col">
            <Flex>
                <Input
                    placeholder="Type Artist"
                    value={genre}
                    onChange={handleGenreChange}
                    size="sm"
                    mr={2}
                    className="text-white"
                />
                <Button onClick={addGenre} size="sm">Add Artist</Button>
            </Flex>

            {/* Display added genres as tags */}
            <Stack spacing={4} direction="row" align="center" wrap="wrap" mt={4}>
                {selectedGenres.map((tag, index) => (
                    <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => removeGenre(tag)} />
                    </Tag>
                ))}
            </Stack>
        </Box>
    );
};

export default ArtistInput;