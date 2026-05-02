/**
 * AI Chatbot Component
 * Provides conversational movie recommendations using NLP keyword matching
 * and the recommendation engine
 */
const Chatbot = (() => {
    const genreKeywords = {
        'comedy': [35], 'funny': [35], 'laugh': [35], 'humor': [35], 'hilarious': [35],
        'action': [28], 'fight': [28], 'explosion': [28], 'battle': [28],
        'horror': [27], 'scary': [27], 'creepy': [27], 'terrifying': [27], 'ghost': [27],
        'romance': [10749], 'love': [10749], 'romantic': [10749], 'date': [10749],
        'thriller': [53], 'suspense': [53], 'tense': [53], 'mystery': [9648, 53],
        'drama': [18], 'emotional': [18], 'intense': [18], 'serious': [18],
        'sci-fi': [878], 'science fiction': [878], 'space': [878], 'future': [878], 'alien': [878],
        'fantasy': [14], 'magic': [14], 'wizard': [14], 'dragon': [14],
        'animation': [16], 'animated': [16], 'cartoon': [16], 'pixar': [16],
        'documentary': [99], 'doc': [99], 'real': [99],
        'adventure': [12], 'explore': [12], 'journey': [12],
        'family': [10751], 'kids': [10751], 'children': [10751],
        'crime': [80], 'detective': [80], 'heist': [80], 'mafia': [80],
        'war': [10752], 'military': [10752], 'soldier': [10752],
        'western': [37], 'cowboy': [37],
        'music': [10402], 'musical': [10402], 'sing': [10402]
    };

    const moodKeywords = {
        'happy': 'happy', 'cheerful': 'happy', 'joyful': 'happy', 'feel good': 'happy',
        'sad': 'sad', 'cry': 'sad', 'depressed': 'sad', 'melancholy': 'sad',
        'excited': 'excited', 'pumped': 'excited', 'energetic': 'excited', 'adrenaline': 'excited',
        'scared': 'scared', 'frightened': 'scared', 'spooky': 'scared',
        'thoughtful': 'thoughtful', 'think': 'thoughtful', 'mind': 'thoughtful', 'intellectual': 'thoughtful',
        'relaxed': 'relaxed', 'chill': 'relaxed', 'calm': 'relaxed', 'cozy': 'relaxed', 'lazy': 'relaxed'
    };

    function init() {
        const toggle = document.getElementById('chatbot-toggle');
        const panel = document.getElementById('chatbot-panel');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');

        toggle.addEventListener('click', () => panel.classList.toggle('active'));
        close.addEventListener('click', () => panel.classList.remove('active'));

        sendBtn.addEventListener('click', () => sendMessage(input.value));
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(input.value); });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => sendMessage(btn.dataset.prompt));
        });
    }

    async function sendMessage(text) {
        if (!text || !text.trim()) return;
        const input = document.getElementById('chatbot-input');
        input.value = '';
        addMessage(text, 'user');
        showTyping();

        const response = await processMessage(text.toLowerCase());
        hideTyping();
        addMessage(response.text, 'bot', response.movies);
    }

    async function processMessage(text) {
        // Check for watchlist-based recommendations
        if (text.includes('watchlist') || text.includes('my list')) {
            return await handleWatchlistRec();
        }
        // Check for "what to watch" type queries
        if (text.includes('watch tonight') || text.includes('what should i watch') || text.includes('what to watch') || text.includes('recommend') || text.includes('suggest')) {
            // Check if genre or mood is specified
            const detectedGenres = detectGenres(text);
            const detectedMood = detectMood(text);
            if (detectedGenres.length > 0) {
                return await handleGenreRec(detectedGenres);
            } else if (detectedMood) {
                return await handleMoodRec(detectedMood);
            } else {
                return await handleGeneralRec();
            }
        }
        // Genre-specific
        const detectedGenres = detectGenres(text);
        if (detectedGenres.length > 0) return await handleGenreRec(detectedGenres);
        // Mood-specific
        const detectedMood = detectMood(text);
        if (detectedMood) return await handleMoodRec(detectedMood);
        // Top rated / best
        if (text.includes('best') || text.includes('top') || text.includes('highest rated')) {
            return await handleTopRated();
        }
        // Trending
        if (text.includes('trending') || text.includes('popular') || text.includes('new')) {
            return await handleTrending();
        }
        // Default
        return await handleGeneralRec();
    }

    function detectGenres(text) {
        const found = new Set();
        Object.entries(genreKeywords).forEach(([keyword, ids]) => {
            if (text.includes(keyword)) ids.forEach(id => found.add(id));
        });
        return [...found];
    }

    function detectMood(text) {
        for (const [keyword, mood] of Object.entries(moodKeywords)) {
            if (text.includes(keyword)) return mood;
        }
        return null;
    }

    async function handleGenreRec(genreIds) {
        const genreStr = genreIds.join(',');
        const data = await TMDB.discoverMovies({ genres: genreStr, sortBy: 'popularity.desc', minRating: 6.5 });
        const movies = (data.results || []).slice(0, 4);
        const genreNames = genreIds.map(id => TMDB.GENRE_MAP[id]).filter(Boolean).join(', ');
        return { text: `Great taste! Here are some awesome ${genreNames} movies I'd recommend:`, movies };
    }

    async function handleMoodRec(mood) {
        const moodData = MoodEngine.MOODS.find(m => m.id === mood);
        const movies = await MoodEngine.getMoviesForMood(mood, 4);
        return { text: `${moodData.emoji} Feeling ${moodData.label.toLowerCase()}? These movies are perfect for your mood:`, movies };
    }

    async function handleGeneralRec() {
        try {
            const recs = await RecommendationEngine.getPersonalizedRecommendations(4);
            if (recs.length > 0) {
                return { text: '🎯 Based on your taste, here are my top picks for you:', movies: recs.slice(0, 4) };
            }
        } catch {}
        const data = await TMDB.getPopular();
        return { text: "Here are some popular movies you might enjoy! The more you use CineAI, the better my recommendations get.", movies: (data.results || []).slice(0, 4) };
    }

    async function handleWatchlistRec() {
        const watchlist = UserStore.getWatchlist();
        if (watchlist.length === 0) {
            return { text: "Your watchlist is empty! Start adding movies and I'll recommend similar ones. Try browsing the trending section! 🎬", movies: [] };
        }
        const recentMovie = watchlist[0];
        const movies = await RecommendationEngine.getBecauseYouLiked(recentMovie.id);
        return { text: `Since you have "${recentMovie.title}" in your watchlist, you'll love these:`, movies: movies.slice(0, 4) };
    }

    async function handleTopRated() {
        const data = await TMDB.getTopRated();
        return { text: '⭐ Here are the highest rated movies of all time:', movies: (data.results || []).slice(0, 4) };
    }

    async function handleTrending() {
        const data = await TMDB.getTrending('week');
        return { text: '🔥 Here\'s what\'s trending right now:', movies: (data.results || []).slice(0, 4) };
    }

    function addMessage(text, sender, movies = []) {
        const container = document.getElementById('chatbot-messages');
        const msg = document.createElement('div');
        msg.className = `chat-message ${sender}`;
        const avatar = sender === 'bot' ? '🤖' : '👤';
        let movieHTML = '';
        if (movies && movies.length > 0) {
            movieHTML = movies.map(m => `
                <div class="chat-movie-suggestion" onclick="window.location.hash='#/movie/${m.id}'">
                    <img class="chat-movie-poster" src="${TMDB.imgURL(m.poster_path, 'w92')}" alt="${m.title}" onerror="this.style.display='none'">
                    <div class="chat-movie-info">
                        <h4>${m.title}</h4>
                        <p>⭐ ${m.vote_average?.toFixed(1)} · ${m.release_date ? m.release_date.substring(0, 4) : ''}</p>
                    </div>
                </div>
            `).join('');
        }
        msg.innerHTML = `
            <span class="chat-avatar">${avatar}</span>
            <div class="chat-bubble">${text}${movieHTML}</div>
        `;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        const container = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.className = 'chat-message bot';
        typing.id = 'typing-indicator';
        typing.innerHTML = `
            <span class="chat-avatar">🤖</span>
            <div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
        `;
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    return { init };
})();
