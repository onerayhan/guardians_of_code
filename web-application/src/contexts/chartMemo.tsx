import axios, { AxiosResponse } from 'axios';

interface SongRating {
    song_id: string;
    rating: number;
    rating_timestamp: string;
}

interface AlbumRating {
    album_id: string;
    rating: number;
    rating_timestamp: string;
}

interface PerformerRating {
    performer_id: string;
    rating: number;
    rating_timestamp: string;
}

interface GenrePreference {
    genre: string;
    count: number;
}

interface AlbumPreference {
    album: string;
    count: number;
}

interface PerformerPreference {
    performer: string;
    count: number;
}

type ApiResponse = SongRating[] | AlbumRating[] | PerformerRating[] | GenrePreference[] | AlbumPreference[] | PerformerPreference[];

export class MemoizationModule {
    private cache: Record<string, ApiResponse>;

    constructor() {
        this.cache = {};
    }

    private generateKey(endpoint: string, username: string): string {
        return `${endpoint}-${username}`;
    }

    async fetchData(endpoint: string, username: string): Promise<ApiResponse> {
        const key = this.generateKey(endpoint, username);
        if (this.cache[key]) {
            return this.cache[key]; // Return cached data if available
        }

        try {
            const response: AxiosResponse<ApiResponse> = await axios.post(endpoint, { username });
            this.cache[key] = response.data; // Store data in cache
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    clearCache(): void {
        this.cache = {};
    }

    updateCache(endpoint: string, username: string, data: ApiResponse): void {
        const key = this.generateKey(endpoint, username);
        this.cache[key] = data;
    }
}