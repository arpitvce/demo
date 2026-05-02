/**
 * User Store — LocalStorage-based user data management
 * Manages watchlist, watch history, ratings, preferences, and mood history
 */
const UserStore = (() => {
    const KEYS = {
        watchlist: 'cineai_watchlist',
        history: 'cineai_history',
        ratings: 'cineai_ratings',
        preferences: 'cineai_preferences',
        moodHistory: 'cineai_mood_history',
        profile: 'cineai_profile'
    };

    const listeners = {};

    function get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }
    function set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        emit(key, value);
    }
    function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    }
    function emit(event, data) {
        (listeners[event] || []).forEach(cb => cb(data));
    }

    // ===== Watchlist =====
    function getWatchlist() { return get(KEYS.watchlist) || []; }
    function addToWatchlist(movie) {
        const list = getWatchlist();
        if (list.find(m => m.id === movie.id)) return false;
        list.unshift({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
            release_date: movie.release_date,
            overview: movie.overview,
            addedAt: Date.now()
        });
        set(KEYS.watchlist, list);
        updateGenrePreferences(movie);
        return true;
    }
    function removeFromWatchlist(movieId) {
        const list = getWatchlist().filter(m => m.id !== movieId);
        set(KEYS.watchlist, list);
    }
    function isInWatchlist(movieId) {
        return getWatchlist().some(m => m.id === movieId);
    }

    // ===== Watch History =====
    function getHistory() { return get(KEYS.history) || []; }
    function addToHistory(movie) {
        let list = getHistory().filter(m => m.id !== movie.id);
        list.unshift({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
            viewedAt: Date.now()
        });
        if (list.length > 100) list = list.slice(0, 100);
        set(KEYS.history, list);
        updateGenrePreferences(movie);
    }

    // ===== Ratings =====
    function getRatings() { return get(KEYS.ratings) || {}; }
    function rateMovie(movieId, rating, movie = null) {
        const ratings = getRatings();
        ratings[movieId] = { rating, ratedAt: Date.now(), title: movie?.title, poster_path: movie?.poster_path };
        set(KEYS.ratings, ratings);
        if (movie) updateGenrePreferences(movie, rating);
    }
    function getMovieRating(movieId) {
        const ratings = getRatings();
        return ratings[movieId] ? ratings[movieId].rating : 0;
    }

    // ===== Genre Preferences (ML-like feature) =====
    function getPreferences() { return get(KEYS.preferences) || { genres: {} }; }
    function updateGenrePreferences(movie, rating = null) {
        const prefs = getPreferences();
        if (!prefs.genres) prefs.genres = {};
        const genreIds = movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []);
        genreIds.forEach(gid => {
            if (!prefs.genres[gid]) prefs.genres[gid] = { count: 0, totalRating: 0, ratedCount: 0 };
            prefs.genres[gid].count++;
            if (rating) {
                prefs.genres[gid].totalRating += rating;
                prefs.genres[gid].ratedCount++;
            }
        });
        set(KEYS.preferences, prefs);
    }
    function getTopGenres(n = 5) {
        const prefs = getPreferences();
        if (!prefs.genres) return [];
        return Object.entries(prefs.genres)
            .map(([id, data]) => ({
                id: parseInt(id),
                name: TMDB.GENRE_MAP[id] || 'Unknown',
                score: data.count + (data.ratedCount > 0 ? (data.totalRating / data.ratedCount) * 2 : 0),
                count: data.count
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, n);
    }

    // ===== Mood History =====
    function getMoodHistory() { return get(KEYS.moodHistory) || []; }
    function addMoodEntry(mood) {
        let list = getMoodHistory();
        list.unshift({ mood, timestamp: Date.now() });
        if (list.length > 50) list = list.slice(0, 50);
        set(KEYS.moodHistory, list);
    }

    // ===== Profile =====
    function getProfile() {
        return get(KEYS.profile) || { name: 'Movie Lover', avatar: '🎬' };
    }
    function updateProfile(data) {
        const profile = { ...getProfile(), ...data };
        set(KEYS.profile, profile);
    }

    // ===== Stats =====
    function getStats() {
        const history = getHistory();
        const ratings = getRatings();
        const watchlist = getWatchlist();
        const ratingValues = Object.values(ratings).map(r => r.rating);
        const avgRating = ratingValues.length > 0
            ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1) : '—';
        const topGenres = getTopGenres(3);
        return {
            moviesWatched: history.length,
            moviesRated: ratingValues.length,
            watchlistCount: watchlist.length,
            avgRating,
            favoriteGenre: topGenres[0]?.name || '—',
            topGenres
        };
    }

    // ===== Clear Data =====
    function clearAllData() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }

    return {
        getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist,
        getHistory, addToHistory,
        getRatings, rateMovie, getMovieRating,
        getPreferences, getTopGenres, updateGenrePreferences,
        getMoodHistory, addMoodEntry,
        getProfile, updateProfile,
        getStats, clearAllData, on
    };
})();
