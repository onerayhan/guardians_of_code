import React, {useState, FormEvent, useEffect} from 'react';
import {
    Box,
    Input,
    Stack,
    Tag,
    TagLabel,
    TagCloseButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button, useToast
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from "axios";
import {useAuthUser} from "react-auth-kit";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

interface TagInputProps {
    // Define props here if needed
}

interface GroupInfo {
    groupName: string;
    tags: string[];
}

const FormFriendGroups: React.FC<TagInputProps> = () => {
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const auth = useAuthUser();
    const toast = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            const apiUrl = "http://13.51.167.155/api/user_followings";
            try {
                const response = await axios.post(apiUrl, { username: `${auth()?.username}` });
                const data = response.data;
                const followerUsernames = data[`Followers of ${auth()?.username}`] || [];
                const followingUsernames = data[`${auth()?.username} follows`] || [];

                setFollowers(followerUsernames);
                setFollowing(followingUsernames);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []);

    const intersection = following.filter(value => followers.includes(value));
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [groupName, setGroupName] = useState<string>("");

    const handleSelect = (item: string) => {
        if (!selectedTags.includes(item)) {
            setSelectedTags([...selectedTags, item]);
        }
    };

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const groupInfo: GroupInfo = {
            groupName,
            tags: selectedTags
        };

        try {
            const url = '';
            const response = await axios.post(url, groupInfo);

            console.log('Success:', response.data);

            toast({
                description: "User followed successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            console.error('Error:', error);

            toast({
                description: "Friend group could not be formed.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <div className="relative w-full flex flex-col items-center top-20">
            <h1 className="text-4xl font-lalezar text-white">Form Friend Groups</h1>
            <div className="w-1/3 mx-auto rounded-2xl bg-white p-12">
            <Box as="form" onSubmit={handleSubmit}>
                <Input
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    mb={4}
                />
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Select Friends
                    </MenuButton>
                    <MenuList>
                        {intersection.map((item, index) => (
                            <MenuItem key={index} onClick={() => handleSelect(item)}>
                                {item}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                <Stack spacing={4} direction="row" align="center" wrap="wrap" mt={4}>
                    {selectedTags.map((tag, index) => (
                        <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => removeTag(tag)} />
                        </Tag>
                    ))}
                </Stack>

                <Button type="submit" colorScheme="orange" mt={4}><AiOutlineUsergroupAdd size={25}/>Form Friend Group</Button>
            </Box>
            </div>
        </div>
    );
};

export default FormFriendGroups;
