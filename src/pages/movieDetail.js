/**
 * Movie Detail Page
 */
const MovieDetailPage = (() => {
    const starSVG = `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>`;

    async function render(container, movieId) {
        container.innerHTML = `<div class="detail-page" id="detail-page">
            <div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
                <div class="loader-ring"></div>
            </div>
        </div>`;

        try {
            const movie = await TMDB.getMovieDetails(movieId);
            const page = document.getElementById('detail-page');

            // Add to history
            UserStore.addToHistory(movie);

            const genres = movie.genres || [];
            const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
            const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
            const trailer = (movie.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const cast = (movie.credits?.cast || []).slice(0, 12);
            const userRating = UserStore.getMovieRating(movie.id);
            const inWatchlist = UserStore.isInWatchlist(movie.id);

            page.innerHTML = `
                <!-- Hero backdrop -->
                <div class="detail-hero">
                    <div class="detail-backdrop">
                        <img src="${TMDB.backdropURL(movie.backdrop_path)}" alt="${movie.title}">
                        <div class="detail-backdrop-overlay"></div>
                    </div>
                    <div class="detail-content page-enter">
                        <div class="detail-poster-wrapper">
                            <img class="detail-poster" src="${TMDB.imgURL(movie.poster_path, 'w500')}" alt="${movie.title}">
                        </div>
                        <div class="detail-info">
                            ${movie.tagline ? `<p class="detail-tagline">"${movie.tagline}"</p>` : ''}
                            <h1 class="detail-title">${movie.title}</h1>
                            <div class="detail-meta">
                                <span class="detail-rating">${starSVG} ${movie.vote_average?.toFixed(1)}</span>
                                <span class="detail-year">${year}</span>
                                ${runtime ? `<span class="detail-runtime">⏱ ${runtime}</span>` : ''}
                                <span class="detail-language">${(movie.spoken_languages?.[0]?.english_name) || ''}</span>
                            </div>
                            <div class="detail-genres">
                                ${genres.map(g => `<span class="genre-tag ${TMDB.getGenreCSSClass(g.name)}">${g.name}</span>`).join('')}
                            </div>
                            <p class="detail-overview">${movie.overview || 'No overview available.'}</p>
                            <div class="detail-actions">
                                ${trailer ? `
                                    <a href="#trailer-section" class="btn-primary" onclick="document.getElementById('trailer-section').scrollIntoView({behavior:'smooth'})">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                        Watch Trailer
                                    </a>
                                ` : ''}
                                <button class="btn-secondary" id="detail-watchlist-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWatchlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                    ${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                                </button>
                            </div>
                            <div class="detail-user-rating">
                                <h3>Rate This Movie</h3>
                                <div class="star-input" id="star-input">
                                    ${[1,2,3,4,5].map(i => `<button data-rating="${i}" class="${i <= userRating ? 'filled' : ''}">⭐</button>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trailer -->
                ${trailer ? `
                <div class="detail-trailer" id="trailer-section">
                    <h2>🎬 Official Trailer</h2>
                    <div class="trailer-embed">
                        <iframe src="https://www.youtube.com/embed/${trailer.key}?rel=0" title="${movie.title} Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen loading="lazy"></iframe>
                    </div>
                </div>
                ` : ''}

                <!-- Cast -->
                ${cast.length > 0 ? `
                <div class="detail-cast-section">
                    <h2>👥 Cast & Crew</h2>
                    <div class="cast-scroll">
                        ${cast.map(c => `
                            <div class="cast-card">
                                <img class="cast-photo" src="${c.profile_path ? TMDB.imgURL(c.profile_path, 'w185') : 'https://via.placeholder.com/185x185/1a1a2e/6b7280?text=No+Photo'}" alt="${c.name}" loading="lazy">
                                <div class="cast-name">${c.name}</div>
                                <div class="cast-character">${c.character || ''}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Similar Movies -->
                <div class="detail-similar" id="detail-similar"></div>
            `;

            // Watchlist button
            const wlBtn = page.querySelector('#detail-watchlist-btn');
            wlBtn.addEventListener('click', () => {
                if (UserStore.isInWatchlist(movie.id)) {
                    UserStore.removeFromWatchlist(movie.id);
                    wlBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Add to Watchlist`;
                    Toast.show('Removed from watchlist', 'info');
                } else {
                    UserStore.addToWatchlist(movie);
                    wlBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> In Watchlist`;
                    Toast.show(`Added "${movie.title}" to watchlist`, 'success');
                }
            });

            // Star rating
            const starInput = page.querySelector('#star-input');
            starInput.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    const rating = parseInt(btn.dataset.rating);
                    UserStore.rateMovie(movie.id, rating, movie);
                    starInput.querySelectorAll('button').forEach((b, i) => {
                        b.classList.toggle('filled', i < rating);
                    });
                    Toast.show(`Rated "${movie.title}" ${rating}/5 ⭐`, 'success');
                });
            });

            // Load similar movies
            const similarContainer = page.querySelector('#detail-similar');
            const [similar, recs] = await Promise.all([
                TMDB.getSimilar(movie.id).catch(() => ({ results: [] })),
                TMDB.getRecommendations(movie.id).catch(() => ({ results: [] }))
            ]);

            if (similar.results.length > 0) {
                similarContainer.appendChild(MovieRow.create('Similar Movies', similar.results, '🎯'));
            }
            if (recs.results.length > 0) {
                similarContainer.appendChild(MovieRow.create('You Might Also Like', recs.results, '💡'));
            }

        } catch (err) {
            console.error('Movie detail error:', err);
            container.innerHTML = `
                <div class="empty-state" style="padding-top:120px">
                    <div class="empty-state-icon">🎬</div>
                    <h2 class="empty-state-title">Movie Not Found</h2>
                    <p class="empty-state-text">We couldn't find this movie. It may have been removed.</p>
                    <a href="#/" class="btn-primary" style="margin-top:24px">← Back to Home</a>
                </div>
            `;
        }
    }

    return { render };
})();
