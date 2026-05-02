/**
 * Home Page — Main dashboard with personalized recommendations
 */
const HomePage = (() => {
    async function render(container) {
        container.innerHTML = '<div class="home-page" id="home-page"></div>';
        const page = document.getElementById('home-page');

        // Show skeleton loaders while loading
        page.appendChild(MovieRow.createSkeleton('Loading...'));

        try {
            // Fetch all data in parallel
            const [trending, topRated, nowPlaying, upcoming] = await Promise.all([
                TMDB.getTrending('week'),
                TMDB.getTopRated(),
                TMDB.getNowPlaying(),
                TMDB.getUpcoming()
            ]);

            // Get personalized recommendations
            let personalizedRecs = [];
            try {
                personalizedRecs = await RecommendationEngine.getPersonalizedRecommendations(20);
            } catch (e) {
                console.log('Rec engine fallback:', e);
            }

            // Clear skeletons
            page.innerHTML = '';

            // 1. Hero Carousel
            const hero = HeroCarousel.create(trending.results);
            page.appendChild(hero);

            // 2. Mood Selector
            const mood = MoodSelector.create();
            page.appendChild(mood);

            // 3. Recommended For You (AI-powered)
            if (personalizedRecs.length > 0) {
                const hasUserData = UserStore.getHistory().length > 0 || UserStore.getWatchlist().length > 0;
                const recTitle = hasUserData ? 'Recommended For You' : 'Popular Picks For You';
                const recRow = MovieRow.create(recTitle, personalizedRecs, '🎯', '#/discover');
                page.appendChild(recRow);
            }

            // 4. "Because you liked" section
            const history = UserStore.getHistory();
            if (history.length > 0) {
                try {
                    const liked = history[0];
                    const becauseMovies = await RecommendationEngine.getBecauseYouLiked(liked.id);
                    if (becauseMovies.length > 0) {
                        const becauseRow = MovieRow.create(`Because You Liked "${liked.title}"`, becauseMovies, '💡');
                        page.appendChild(becauseRow);
                    }
                } catch {}
            }

            // 5. Trending Now
            const trendingRow = MovieRow.create('Trending This Week', trending.results, '🔥', '#/discover');
            page.appendChild(trendingRow);

            // 6. Top Rated
            const topRow = MovieRow.create('Top Rated of All Time', topRated.results, '⭐');
            page.appendChild(topRow);

            // 7. Now Playing
            const nowRow = MovieRow.create('Now Playing in Theaters', nowPlaying.results, '🎬');
            page.appendChild(nowRow);

            // 8. Upcoming
            const upcomingRow = MovieRow.create('Coming Soon', upcoming.results, '🆕');
            page.appendChild(upcomingRow);

            // 9. Genre quick browse — show top user genres
            const topGenres = UserStore.getTopGenres(3);
            for (const genre of topGenres) {
                try {
                    const genreData = await TMDB.getByGenre(genre.id);
                    if (genreData.results.length > 0) {
                        const genreRow = MovieRow.create(`${genre.name} Movies`, genreData.results, '🎭');
                        page.appendChild(genreRow);
                    }
                } catch {}
            }

            // Record that user visited home
            UserStore.addToHistory && false; // don't add page visits to history

        } catch (err) {
            console.error('Home page error:', err);
            page.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">😵</div>
                    <h2 class="empty-state-title">Oops! Something went wrong</h2>
                    <p class="empty-state-text">We couldn't load the movies. Please check your internet connection and try again.</p>
                    <button class="btn-primary" onclick="window.location.reload()" style="margin-top:24px">Retry</button>
                </div>
            `;
        }
    }

    return { render };
})();
