/**
 * Smart Search Engine with debounced autocomplete
 */
const SearchEngine = (() => {
    let debounceTimer = null;

    function debounce(fn, delay = 350) {
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fn(...args), delay);
        };
    }

    async function search(query) {
        if (!query || query.trim().length < 2) return { movies: [], people: [] };
        try {
            const data = await TMDB.searchMulti(query.trim());
            const movies = [];
            const people = [];
            (data.results || []).forEach(item => {
                if (item.media_type === 'movie' && item.poster_path) {
                    movies.push(item);
                } else if (item.media_type === 'person') {
                    people.push(item);
                }
            });
            return { movies: movies.slice(0, 8), people: people.slice(0, 3) };
        } catch { return { movies: [], people: [] }; }
    }

    // Genre keyword search
    function matchGenre(query) {
        const q = query.toLowerCase();
        const genres = Object.entries(TMDB.GENRE_MAP);
        return genres.filter(([id, name]) => name.toLowerCase().includes(q))
            .map(([id, name]) => ({ id: parseInt(id), name }));
    }

    return { search, matchGenre, debounce };
})();
