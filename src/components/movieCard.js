/**
 * Movie Card Component
 */
const MovieCard = (() => {
    const starSVG = `<svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

    function create(movie, size = 'card-medium') {
        const card = document.createElement('div');
        card.className = `movie-card ${size} animate-in`;
        card.setAttribute('data-movie-id', movie.id);

        const genres = TMDB.getGenreNames(movie.genre_ids || []);
        const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';
        const inWatchlist = UserStore.isInWatchlist(movie.id);

        card.innerHTML = `
            <div class="movie-card-poster">
                <img src="${TMDB.imgURL(movie.poster_path, 'w342')}" alt="${movie.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/342x513/1a1a2e/6b7280?text=No+Image'">
                <div class="movie-card-rating">${starSVG} ${rating}</div>
                <button class="movie-card-watchlist ${inWatchlist ? 'active' : ''}" data-movie-id="${movie.id}" aria-label="Toggle watchlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
                <div class="movie-card-overlay">
                    <p class="movie-card-overview">${movie.overview || ''}</p>
                </div>
            </div>
            <div class="movie-card-info">
                <h3 class="movie-card-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-card-meta">
                    <span class="movie-card-year">${year}</span>
                </div>
                <div class="movie-card-genres">
                    ${genres.slice(0, 2).map(g => `<span class="genre-tag ${TMDB.getGenreCSSClass(g)}">${g}</span>`).join('')}
                </div>
            </div>
        `;

        // Click on card -> movie detail
        card.addEventListener('click', (e) => {
            if (e.target.closest('.movie-card-watchlist')) return;
            window.location.hash = `#/movie/${movie.id}`;
        });

        // Watchlist button
        const wlBtn = card.querySelector('.movie-card-watchlist');
        wlBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWatchlist(movie, wlBtn);
        });

        return card;
    }

    function toggleWatchlist(movie, btn) {
        if (UserStore.isInWatchlist(movie.id)) {
            UserStore.removeFromWatchlist(movie.id);
            btn.classList.remove('active');
            Toast.show('Removed from watchlist', 'info');
        } else {
            UserStore.addToWatchlist(movie);
            btn.classList.add('active');
            btn.classList.add('animating');
            setTimeout(() => btn.classList.remove('animating'), 600);
            Toast.show(`Added "${movie.title}" to watchlist`, 'success');
        }
    }

    function createSkeleton(size = 'card-medium') {
        const skel = document.createElement('div');
        skel.className = `movie-card ${size}`;
        skel.innerHTML = `
            <div class="movie-card-poster"><div class="skeleton" style="width:100%;height:100%;aspect-ratio:2/3"></div></div>
            <div class="movie-card-info">
                <div class="skeleton" style="height:16px;width:80%;margin-bottom:8px;border-radius:4px"></div>
                <div class="skeleton" style="height:12px;width:40%;border-radius:4px"></div>
            </div>
        `;
        return skel;
    }

    return { create, createSkeleton };
})();
