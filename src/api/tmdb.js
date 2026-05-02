/**
 * TMDB API Client with Mock Data Fallback
 * Tries the real API first, falls back to MockData if unreachable
 */
const TMDB = (() => {
    const API_KEY = 'b0e66e59ab0843139c72a31e2e2b1b0d';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_BASE = 'https://image.tmdb.org/t/p';
    let apiAvailable = null; // null = unknown, true/false after first check

    const GENRE_MAP = {
        28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
        99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Science Fiction',
        10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'
    };
    const GENRE_CSS_MAP = {
        'Action':'action','Adventure':'action','Animation':'animation','Comedy':'comedy',
        'Crime':'thriller','Documentary':'default','Drama':'drama','Family':'animation',
        'Fantasy':'scifi','History':'default','Horror':'horror','Music':'comedy',
        'Mystery':'thriller','Romance':'romance','Science Fiction':'scifi',
        'TV Movie':'default','Thriller':'thriller','War':'action','Western':'default'
    };

    async function tryAPI(endpoint, params = {}) {
        const url = new URL(`${BASE_URL}${endpoint}`);
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('language', 'en-US');
        Object.entries(params).forEach(([k,v]) => { if(v!=null&&v!=='') url.searchParams.set(k,v); });
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        try {
            const res = await fetch(url.toString(), { signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) throw new Error(res.status);
            apiAvailable = true;
            return await res.json();
        } catch(e) {
            clearTimeout(timeout);
            apiAvailable = false;
            return null;
        }
    }

    function wrapResult(arr) { return { results: arr, total_results: arr.length, total_pages: 1 }; }

    function imgURL(path, size='w500') {
        if (!path) return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" fill="%231a1a2e"><rect width="500" height="750"/><text x="250" y="375" fill="%236b7280" text-anchor="middle" font-size="20">No Image</text></svg>');
        return `${IMG_BASE}/${size}${path}`;
    }
    function backdropURL(path, size='original') {
        if (!path) return '';
        return `${IMG_BASE}/${size}${path}`;
    }
    function getGenreNames(ids) { return (ids||[]).map(id => GENRE_MAP[id]).filter(Boolean); }
    function getGenreCSSClass(name) { return GENRE_CSS_MAP[name] || 'default'; }

    return {
        GENRE_MAP, getGenreNames, getGenreCSSClass, imgURL, backdropURL,

        async getTrending(tw='week', page=1) {
            const data = await tryAPI(`/trending/movie/${tw}`, {page});
            return data || wrapResult(MockData.getTrending());
        },
        async getTopRated(page=1) {
            const data = await tryAPI('/movie/top_rated', {page});
            return data || wrapResult(MockData.getTopRated());
        },
        async getNowPlaying(page=1) {
            const data = await tryAPI('/movie/now_playing', {page});
            return data || wrapResult(MockData.getNowPlaying());
        },
        async getUpcoming(page=1) {
            const data = await tryAPI('/movie/upcoming', {page});
            return data || wrapResult(MockData.getUpcoming());
        },
        async getPopular(page=1) {
            const data = await tryAPI('/movie/popular', {page});
            return data || wrapResult(MockData.getPopular());
        },
        async getMovieDetails(id) {
            const data = await tryAPI(`/movie/${id}`, {append_to_response:'credits,videos,similar,recommendations,keywords'});
            return data || MockData.getMovieDetails(id);
        },
        async getSimilar(id, page=1) {
            const data = await tryAPI(`/movie/${id}/similar`, {page});
            return data || wrapResult(MockData.getSimilar(id));
        },
        async getRecommendations(id, page=1) {
            const data = await tryAPI(`/movie/${id}/recommendations`, {page});
            return data || wrapResult(MockData.getSimilar(id));
        },
        async searchMovies(query, page=1) {
            const data = await tryAPI('/search/movie', {query, page});
            return data || wrapResult(MockData.search(query));
        },
        async searchMulti(query) {
            const data = await tryAPI('/search/multi', {query});
            if (data) return data;
            return { results: MockData.search(query).map(m => ({...m, media_type:'movie'})) };
        },
        async discoverMovies(filters={}) {
            const params = { page: filters.page||1 };
            if(filters.genres) params.with_genres=filters.genres;
            if(filters.sortBy) params.sort_by=filters.sortBy;
            if(filters.minRating) params['vote_average.gte']=filters.minRating;
            if(filters.yearFrom) params['primary_release_date.gte']=`${filters.yearFrom}-01-01`;
            if(filters.yearTo) params['primary_release_date.lte']=`${filters.yearTo}-12-31`;
            if(filters.language) params.with_original_language=filters.language;
            params['vote_count.gte']=50;
            const data = await tryAPI('/discover/movie', params);
            if (data) return data;
            const mocks = MockData.discover(filters);
            return { results: mocks, total_results: mocks.length, total_pages: 1 };
        },
        async getGenres() {
            const data = await tryAPI('/genre/movie/list');
            return data || { genres: Object.entries(GENRE_MAP).map(([id,name])=>({id:parseInt(id),name})) };
        },
        async getByGenre(genreId, page=1) {
            const data = await tryAPI('/discover/movie', {with_genres:genreId, sort_by:'popularity.desc', page, 'vote_count.gte':50});
            return data || wrapResult(MockData.getByGenre(genreId));
        }
    };
})();
