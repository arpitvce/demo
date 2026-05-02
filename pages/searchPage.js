/**
 * Search Results Page
 */
const SearchPage = (() => {
    async function render(container, query) {
        const decodedQuery = decodeURIComponent(query || '');
        container.innerHTML = `
            <div class="discover-page page-enter">
                <h1>Search Results</h1>
                <div class="search-page-input-wrapper">
                    <span class="search-page-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </span>
                    <input type="text" class="search-page-input" id="search-page-input" value="${decodedQuery}" placeholder="Search movies, genres, actors...">
                </div>
                <div class="discover-results-header">
                    <span class="discover-results-count" id="search-results-count"></span>
                </div>
                <div class="movie-grid stagger-children" id="search-results-grid"></div>
            </div>
        `;

        const input = document.getElementById('search-page-input');
        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const q = input.value.trim();
                if (q.length >= 2) {
                    window.location.hash = `#/search/${encodeURIComponent(q)}`;
                }
            }, 500);
        });

        if (decodedQuery) await doSearch(decodedQuery);
    }

    async function doSearch(query) {
        const grid = document.getElementById('search-results-grid');
        const countEl = document.getElementById('search-results-count');
        grid.innerHTML = '';
        for (let i = 0; i < 8; i++) grid.appendChild(MovieCard.createSkeleton());

        try {
            const data = await TMDB.searchMovies(query);
            grid.innerHTML = '';
            const movies = (data.results || []).filter(m => m.poster_path);
            countEl.textContent = `${movies.length} results for "${query}"`;

            if (movies.length === 0) {
                grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><h2 class="empty-state-title">No Results</h2><p class="empty-state-text">Try a different search term</p></div>`;
                return;
            }
            movies.forEach(movie => grid.appendChild(MovieCard.create(movie, 'card-medium')));
        } catch (err) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>Search failed. Please try again.</p></div>`;
        }
    }

    return { render };
})();
