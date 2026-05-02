/**
 * Hero Carousel Component
 */
const HeroCarousel = (() => {
    let currentSlide = 0;
    let autoPlayTimer = null;
    const starSVG = `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

    function create(movies) {
        const featured = movies.slice(0, 5);
        const section = document.createElement('section');
        section.className = 'hero-section';

        featured.forEach((movie, i) => {
            const genres = TMDB.getGenreNames(movie.genre_ids || []);
            const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
            const slide = document.createElement('div');
            slide.className = `hero-slide ${i === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <img class="hero-backdrop" src="${TMDB.backdropURL(movie.backdrop_path)}" alt="${movie.title}">
                <div class="hero-gradient-overlay"></div>
                <div class="hero-content">
                    <span class="hero-badge">⚡ Trending Now</span>
                    <h1 class="hero-title">${movie.title}</h1>
                    <div class="hero-meta">
                        <span class="hero-rating">${starSVG} ${movie.vote_average?.toFixed(1)}</span>
                        <span class="hero-year">${year}</span>
                        <span class="hero-genre-text">${genres.slice(0, 3).join(' · ')}</span>
                    </div>
                    <p class="hero-overview">${movie.overview}</p>
                    <div class="hero-actions">
                        <button class="hero-btn-primary" onclick="window.location.hash='#/movie/${movie.id}'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            View Details
                        </button>
                        <button class="hero-btn-secondary" data-hero-watchlist="${movie.id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                            Watchlist
                        </button>
                    </div>
                </div>
            `;
            section.appendChild(slide);
        });

        // Dots
        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'hero-dots';
        featured.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(section, i));
            dotsDiv.appendChild(dot);
        });
        section.appendChild(dotsDiv);

        // Watchlist buttons
        section.querySelectorAll('[data-hero-watchlist]').forEach(btn => {
            const movieId = parseInt(btn.dataset.heroWatchlist);
            const movie = featured.find(m => m.id === movieId);
            btn.addEventListener('click', () => {
                if (UserStore.isInWatchlist(movieId)) {
                    UserStore.removeFromWatchlist(movieId);
                    Toast.show('Removed from watchlist', 'info');
                } else {
                    UserStore.addToWatchlist(movie);
                    Toast.show(`Added "${movie.title}" to watchlist`, 'success');
                }
            });
        });

        // Auto play
        startAutoPlay(section, featured.length);

        return section;
    }

    function goToSlide(section, index) {
        const slides = section.querySelectorAll('.hero-slide');
        const dots = section.querySelectorAll('.hero-dot');
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index]?.classList.add('active');
        dots[index]?.classList.add('active');
        currentSlide = index;
    }

    function startAutoPlay(section, total) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % total;
            goToSlide(section, currentSlide);
        }, 6000);
    }

    function destroy() {
        clearInterval(autoPlayTimer);
    }

    return { create, destroy };
})();
