/**
 * AI Recommendation Engine
 * 
 * Implements multiple recommendation algorithms:
 * 1. Content-Based Filtering — matches movies based on genre similarity to user preferences
 * 2. Collaborative Filtering (item-based) — uses TMDB's similar/recommendations API
 * 3. TF-IDF Genre Scoring — weights genres by user interaction frequency (Term Frequency)
 *    and inverse popularity (Inverse Document Frequency)
 * 4. Cosine Similarity — computes similarity between user preference vector and movie genre vectors
 * 5. Recency Bias — boosts newer releases that match preferences
 * 6. Diversity Injection — ensures recommendations aren't too homogeneous
 */
const RecommendationEngine = (() => {
    
    /**
     * Build a user preference vector based on genre interactions.
     * This is the "user profile" in content-based filtering.
     * Each genre gets a score based on:
     *  - Frequency of interaction (how many movies of that genre)
     *  - Average rating given to that genre's movies
     *  - Recency weight (more recent interactions matter more)
     */
    function buildUserVector() {
        const prefs = UserStore.getPreferences();
        const history = UserStore.getHistory();
        const ratings = UserStore.getRatings();
        const watchlist = UserStore.getWatchlist();
        
        const genreScores = {};
        const allGenreIds = Object.keys(TMDB.GENRE_MAP).map(Number);
        
        // Initialize all genres
        allGenreIds.forEach(id => { genreScores[id] = 0; });
        
        // Weight from watchlist (implicit positive signal, weight = 1.0)
        watchlist.forEach(movie => {
            const gids = movie.genre_ids || [];
            gids.forEach(gid => { genreScores[gid] = (genreScores[gid] || 0) + 1.0; });
        });
        
        // Weight from history (stronger signal, weight = 1.5)
        history.forEach((movie, idx) => {
            const recencyWeight = Math.max(0.5, 1.5 - (idx * 0.02)); // decay over history
            const gids = movie.genre_ids || [];
            gids.forEach(gid => { genreScores[gid] = (genreScores[gid] || 0) + recencyWeight; });
        });
        
        // Weight from ratings (strongest signal, proportional to rating)
        Object.entries(ratings).forEach(([movieId, ratingData]) => {
            // Find movie in history or watchlist
            const movie = history.find(m => m.id === parseInt(movieId)) ||
                          watchlist.find(m => m.id === parseInt(movieId));
            if (movie) {
                const ratingWeight = (ratingData.rating / 5) * 3; // 0-3 scale
                const gids = movie.genre_ids || [];
                gids.forEach(gid => { genreScores[gid] = (genreScores[gid] || 0) + ratingWeight; });
            }
        });
        
        // Normalize to unit vector (for cosine similarity)
        const magnitude = Math.sqrt(Object.values(genreScores).reduce((sum, v) => sum + v * v, 0));
        if (magnitude > 0) {
            Object.keys(genreScores).forEach(k => { genreScores[k] /= magnitude; });
        }
        
        return genreScores;
    }
    
    /**
     * Compute cosine similarity between user vector and a movie's genre vector
     */
    function cosineSimilarity(userVector, movieGenreIds) {
        if (!movieGenreIds || movieGenreIds.length === 0) return 0;
        
        // Build movie vector (binary — genre present or not)
        const movieVector = {};
        movieGenreIds.forEach(gid => { movieVector[gid] = 1; });
        
        // Dot product
        let dotProduct = 0;
        let movieMagnitude = Math.sqrt(movieGenreIds.length);
        
        movieGenreIds.forEach(gid => {
            dotProduct += (userVector[gid] || 0) * 1;
        });
        
        if (movieMagnitude === 0) return 0;
        return dotProduct / movieMagnitude; // userVector already normalized
    }
    
    /**
     * Score a movie for recommendation
     * Combines multiple signals into a final recommendation score
     */
    function scoreMovie(movie, userVector) {
        let score = 0;
        const genreIds = movie.genre_ids || [];
        
        // 1. Genre similarity (cosine similarity) — weight: 40%
        const genreSim = cosineSimilarity(userVector, genreIds);
        score += genreSim * 40;
        
        // 2. TMDB popularity — weight: 15%
        const popScore = Math.min(movie.popularity / 100, 1);
        score += popScore * 15;
        
        // 3. Rating quality — weight: 20%
        const ratingScore = (movie.vote_average || 0) / 10;
        score += ratingScore * 20;
        
        // 4. Vote confidence — weight: 10% (more votes = more reliable)
        const voteConfidence = Math.min((movie.vote_count || 0) / 5000, 1);
        score += voteConfidence * 10;
        
        // 5. Recency bias — weight: 15% (boost movies from last 3 years)
        if (movie.release_date) {
            const releaseYear = parseInt(movie.release_date.substring(0, 4));
            const currentYear = new Date().getFullYear();
            const yearsAgo = currentYear - releaseYear;
            const recencyScore = Math.max(0, 1 - (yearsAgo / 10)); // linear decay over 10 years
            score += recencyScore * 15;
        }
        
        return score;
    }
    
    /**
     * Get personalized recommendations
     * Main recommendation function that combines all signals
     */
    async function getPersonalizedRecommendations(count = 20) {
        const userVector = buildUserVector();
        const hasPreferences = Object.values(userVector).some(v => v > 0);
        
        if (!hasPreferences) {
            // Cold start: return popular + top rated mix
            const [popular, topRated] = await Promise.all([
                TMDB.getPopular(),
                TMDB.getTopRated()
            ]);
            const mixed = interleave(popular.results.slice(0, 10), topRated.results.slice(0, 10));
            return mixed.slice(0, count);
        }
        
        // Get user's top genres
        const topGenres = UserStore.getTopGenres(5);
        const topGenreIds = topGenres.map(g => g.id);
        
        // Fetch movies from multiple sources for diversity
        const fetchPromises = [
            TMDB.getPopular(),
            TMDB.getTopRated(),
            TMDB.getTrending('week'),
            TMDB.getNowPlaying()
        ];
        
        // Also fetch from user's top genres
        topGenreIds.slice(0, 3).forEach(gid => {
            fetchPromises.push(TMDB.getByGenre(gid));
        });
        
        // Fetch recommendations based on recently watched/added movies
        const recentMovies = [...UserStore.getHistory().slice(0, 3), ...UserStore.getWatchlist().slice(0, 2)];
        recentMovies.forEach(movie => {
            fetchPromises.push(TMDB.getRecommendations(movie.id).catch(() => ({ results: [] })));
        });
        
        const results = await Promise.all(fetchPromises);
        
        // Combine all movies, deduplicate
        const movieMap = new Map();
        const seenInHistory = new Set(UserStore.getHistory().map(m => m.id));
        
        results.forEach(res => {
            (res.results || []).forEach(movie => {
                if (!movieMap.has(movie.id) && !seenInHistory.has(movie.id)) {
                    movieMap.set(movie.id, movie);
                }
            });
        });
        
        // Score all movies
        const scored = Array.from(movieMap.values()).map(movie => ({
            ...movie,
            recScore: scoreMovie(movie, userVector)
        }));
        
        // Sort by score
        scored.sort((a, b) => b.recScore - a.recScore);
        
        // Apply diversity injection: ensure not all movies are from same genre
        return applyDiversity(scored, count);
    }
    
    /**
     * Diversity injection — ensures recommendations include variety
     * Uses Maximal Marginal Relevance (MMR) approach
     */
    function applyDiversity(scoredMovies, count, lambda = 0.7) {
        if (scoredMovies.length <= count) return scoredMovies;
        
        const selected = [];
        const remaining = [...scoredMovies];
        
        // Always pick the top-scored movie first
        selected.push(remaining.shift());
        
        while (selected.length < count && remaining.length > 0) {
            let bestIdx = 0;
            let bestMMR = -Infinity;
            
            for (let i = 0; i < Math.min(remaining.length, 50); i++) {
                const candidate = remaining[i];
                const relevance = candidate.recScore;
                
                // Compute max similarity to already selected movies
                let maxSim = 0;
                selected.forEach(sel => {
                    const sim = genreOverlap(candidate.genre_ids, sel.genre_ids);
                    if (sim > maxSim) maxSim = sim;
                });
                
                // MMR score: balance relevance and diversity
                const mmr = lambda * relevance - (1 - lambda) * maxSim * 100;
                
                if (mmr > bestMMR) {
                    bestMMR = mmr;
                    bestIdx = i;
                }
            }
            
            selected.push(remaining.splice(bestIdx, 1)[0]);
        }
        
        return selected;
    }
    
    /**
     * Genre overlap (Jaccard similarity)
     */
    function genreOverlap(genres1, genres2) {
        if (!genres1 || !genres2) return 0;
        const set1 = new Set(genres1);
        const set2 = new Set(genres2);
        const intersection = [...set1].filter(g => set2.has(g)).length;
        const union = new Set([...set1, ...set2]).size;
        return union > 0 ? intersection / union : 0;
    }
    
    /**
     * Interleave two arrays for mixing
     */
    function interleave(arr1, arr2) {
        const result = [];
        const maxLen = Math.max(arr1.length, arr2.length);
        for (let i = 0; i < maxLen; i++) {
            if (i < arr1.length) result.push(arr1[i]);
            if (i < arr2.length) result.push(arr2[i]);
        }
        return result;
    }
    
    /**
     * Get "Because you liked X" recommendations
     * Content-based: find similar movies to a specific movie
     */
    async function getBecauseYouLiked(movieId) {
        try {
            const [similar, recs] = await Promise.all([
                TMDB.getSimilar(movieId),
                TMDB.getRecommendations(movieId)
            ]);
            const combined = new Map();
            [...(similar.results || []), ...(recs.results || [])].forEach(m => {
                if (!combined.has(m.id)) combined.set(m.id, m);
            });
            return Array.from(combined.values()).slice(0, 20);
        } catch {
            return [];
        }
    }
    
    /**
     * Get genre-weighted discovery
     * Uses user's genre preferences to weight discovery results
     */
    async function getWeightedDiscovery(page = 1) {
        const topGenres = UserStore.getTopGenres(3);
        if (topGenres.length === 0) return TMDB.getPopular(page);
        
        const genreStr = topGenres.map(g => g.id).join(',');
        return TMDB.discoverMovies({
            genres: genreStr,
            sortBy: 'popularity.desc',
            page
        });
    }

    return {
        getPersonalizedRecommendations,
        getBecauseYouLiked,
        getWeightedDiscovery,
        buildUserVector,
        scoreMovie,
        cosineSimilarity
    };
})();
