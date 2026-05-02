/**
 * Profile Page — User dashboard with watchlist, history, ratings, preferences
 */
const ProfilePage = (() => {
    async function render(container) {
        const profile = UserStore.getProfile();
        const stats = UserStore.getStats();
        const watchlist = UserStore.getWatchlist();
        const history = UserStore.getHistory();
        const ratings = UserStore.getRatings();
        const topGenres = UserStore.getTopGenres(8);

        container.innerHTML = `
            <div class="profile-page page-enter">
                <!-- Header -->
                <div class="profile-header">
                    <div class="profile-avatar-large">${profile.avatar || '🎬'}</div>
                    <div class="profile-info">
                        <h1>${profile.name}</h1>
                        <p class="profile-subtitle">CineAI Member · Personalized recommendations powered by AI</p>
                    </div>
                </div>

                <!-- Stats -->
                <div class="profile-stats">
                    <div class="stat-card hover-lift">
                        <div class="stat-value">${stats.moviesWatched}</div>
                        <div class="stat-label">Movies Watched</div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-value">${stats.watchlistCount}</div>
                        <div class="stat-label">In Watchlist</div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-value">${stats.moviesRated}</div>
                        <div class="stat-label">Movies Rated</div>
                    </div>
                    <div class="stat-card hover-lift">
                        <div class="stat-value">${stats.avgRating}</div>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                </div>

                <!-- Genre Preferences -->
                ${topGenres.length > 0 ? `
                <div class="profile-section">
                    <div class="profile-section-header">
                        <h2 class="profile-section-title">🎭 Your Genre Preferences</h2>
                    </div>
                    <div class="genre-pref-list">
                        ${topGenres.map(g => `
                            <div class="genre-pref-tag">
                                <span>${g.name}</span>
                                <span class="count">${g.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Watchlist -->
                <div class="profile-section">
                    <div class="profile-section-header">
                        <h2 class="profile-section-title">📋 My Watchlist</h2>
                        <span style="color:var(--text-secondary);font-size:var(--fs-sm)">${watchlist.length} movies</span>
                    </div>
                    <div id="profile-watchlist-grid"></div>
                </div>

                <!-- Watch History -->
                <div class="profile-section">
                    <div class="profile-section-header">
                        <h2 class="profile-section-title">📺 Watch History</h2>
                        <span style="color:var(--text-secondary);font-size:var(--fs-sm)">${history.length} movies</span>
                    </div>
                    <div id="profile-history-grid"></div>
                </div>

                <!-- Rated Movies -->
                <div class="profile-section">
                    <div class="profile-section-header">
                        <h2 class="profile-section-title">⭐ Your Ratings</h2>
                    </div>
                    <div id="profile-ratings-grid"></div>
                </div>

                <!-- Settings -->
                <div class="profile-section">
                    <div class="profile-section-header">
                        <h2 class="profile-section-title">⚙️ Settings</h2>
                    </div>
                    <div class="profile-settings">
                        <button class="btn-secondary" id="clear-data-btn">🗑️ Clear All Data</button>
                    </div>
                </div>
            </div>
        `;

        // Render watchlist grid
        const wlGrid = document.getElementById('profile-watchlist-grid');
        if (watchlist.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'movie-grid stagger-children';
            watchlist.forEach(movie => grid.appendChild(MovieCard.create(movie, 'card-medium')));
            wlGrid.appendChild(grid);
        } else {
            wlGrid.innerHTML = `<div class="empty-state" style="padding:var(--space-xl)"><div class="empty-state-icon">📋</div><p class="empty-state-text">No movies in your watchlist yet. Browse and add some!</p><a href="#/" class="btn-primary" style="margin-top:16px">Browse Movies</a></div>`;
        }

        // Render history
        const histGrid = document.getElementById('profile-history-grid');
        if (history.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'movie-grid stagger-children';
            history.slice(0, 20).forEach(movie => grid.appendChild(MovieCard.create(movie, 'card-medium')));
            histGrid.appendChild(grid);
        } else {
            histGrid.innerHTML = `<div class="empty-state" style="padding:var(--space-xl)"><div class="empty-state-icon">📺</div><p class="empty-state-text">No watch history yet. Start exploring movies!</p></div>`;
        }

        // Render ratings
        const ratGrid = document.getElementById('profile-ratings-grid');
        const ratedMovies = Object.entries(ratings);
        if (ratedMovies.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'movie-grid stagger-children';
            ratedMovies.forEach(([id, data]) => {
                const movie = history.find(m => m.id === parseInt(id)) || watchlist.find(m => m.id === parseInt(id));
                if (movie) {
                    const card = MovieCard.create(movie, 'card-medium');
                    grid.appendChild(card);
                }
            });
            if (grid.children.length > 0) ratGrid.appendChild(grid);
            else ratGrid.innerHTML = `<div class="empty-state" style="padding:var(--space-xl)"><p class="empty-state-text">Rate some movies to see them here!</p></div>`;
        } else {
            ratGrid.innerHTML = `<div class="empty-state" style="padding:var(--space-xl)"><div class="empty-state-icon">⭐</div><p class="empty-state-text">You haven't rated any movies yet.</p></div>`;
        }

        // Clear data
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
                UserStore.clearAllData();
                Toast.show('All data cleared', 'info');
                ProfilePage.render(container);
            }
        });
    }

    return { render };
})();
