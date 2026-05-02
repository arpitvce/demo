/**
 * Mood-Based Recommendation Engine
 * Maps user moods to genre combinations and fetches relevant movies
 */
const MoodEngine = (() => {
    const MOODS = [
        {
            id: 'happy',
            emoji: '😊',
            label: 'Happy',
            description: 'Feel-good movies to keep the vibes going',
            genres: [35, 16, 10402, 10751], // Comedy, Animation, Music, Family
            keywords: 'feel good,uplifting,fun',
            cssClass: 'happy'
        },
        {
            id: 'sad',
            emoji: '😢',
            label: 'Sad',
            description: 'Emotional stories that resonate',
            genres: [18, 10749], // Drama, Romance
            keywords: 'emotional,heartfelt,tearjerker',
            cssClass: 'sad'
        },
        {
            id: 'excited',
            emoji: '🤩',
            label: 'Excited',
            description: 'High-energy action and adventure',
            genres: [28, 12, 878], // Action, Adventure, Sci-Fi
            keywords: 'action,thrilling,epic',
            cssClass: 'excited'
        },
        {
            id: 'scared',
            emoji: '😨',
            label: 'Scared',
            description: 'Horror and suspense to keep you on edge',
            genres: [27, 53], // Horror, Thriller
            keywords: 'scary,suspense,creepy',
            cssClass: 'scared'
        },
        {
            id: 'thoughtful',
            emoji: '🤔',
            label: 'Thoughtful',
            description: 'Mind-bending mysteries and documentaries',
            genres: [9648, 99, 878], // Mystery, Documentary, Sci-Fi
            keywords: 'mind-bending,intellectual,thought-provoking',
            cssClass: 'thoughtful'
        },
        {
            id: 'relaxed',
            emoji: '😌',
            label: 'Relaxed',
            description: 'Light-hearted family and fantasy',
            genres: [10751, 14, 16], // Family, Fantasy, Animation
            keywords: 'relaxing,cozy,lighthearted',
            cssClass: 'relaxed'
        }
    ];

    async function getMoviesForMood(moodId, count = 12) {
        const mood = MOODS.find(m => m.id === moodId);
        if (!mood) return [];

        UserStore.addMoodEntry(moodId);

        const genreStr = mood.genres.join(',');
        try {
            const data = await TMDB.discoverMovies({
                genres: genreStr,
                sortBy: 'popularity.desc',
                minRating: 6
            });

            // Apply user preference weighting if available
            const userVector = RecommendationEngine.buildUserVector();
            const hasPrefs = Object.values(userVector).some(v => v > 0);

            let movies = data.results || [];
            if (hasPrefs) {
                movies = movies.map(m => ({
                    ...m,
                    moodScore: RecommendationEngine.scoreMovie(m, userVector)
                }));
                movies.sort((a, b) => b.moodScore - a.moodScore);
            }

            return movies.slice(0, count);
        } catch (err) {
            console.error('Mood engine error:', err);
            return [];
        }
    }

    return { MOODS, getMoviesForMood };
})();
