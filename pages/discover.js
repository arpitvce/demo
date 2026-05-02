/**
 * Discover Page — Browse with filters
 */
const DiscoverPage = (() => {
    let currentPage = 1;
    let currentFilters = {};
    let totalPages = 1;

    async function render(container) {
        currentPage = 1;
        currentFilters = {};

        container.innerHTML = `
            <div class="discover-page page-enter">
                <h1>🔍 Discover Movies</h1>
                <div class="active-filters" id="active-filters"></div>
                <div class="discover-layout">
                    <aside class="discover-sidebar" id="discover-sidebar"></aside>
                    <div class="discover-main">
                        <div class="discover-results-header">
                            <span class="discover-results-count" id="results-count"></span>
                        </div>
                        <div class="movie-grid stagger-children" id="discover-grid"></div>
                        <button class="btn-primary load-more-btn" id="load-more" style="display:none">Load More</button>
                    </div>
                </div>
            </div>
        `;

        // Filter panel
        const sidebar = document.getElementById('discover-sidebar');
        const filterPanel = FilterPanel.create(async (filters) => {
            currentFilters = filters;
            currentPage = 1;
            await loadMovies(true);
        });
        sidebar.appendChild(filterPanel);

        // Load more
        document.getElementById('load-more').addEventListener('click', async () => {
            if (currentPage < totalPages) {
                currentPage++;
                await loadMovies(false);
            }
        });

        // Initial load
        await loadMovies(true);
    }

    async function loadMovies(replace = true) {
        const grid = document.getElementById('discover-grid');
        const loadMore = document.getElementById('load-more');
        const countEl = document.getElementById('results-count');

        if (replace) {
            grid.innerHTML = '';
            // Show skeletons
            for (let i = 0; i < 12; i++) grid.appendChild(MovieCard.createSkeleton());
        }

        try {
            const data = await TMDB.discoverMovies({ ...currentFilters, page: currentPage });
            totalPages = Math.min(data.total_pages || 1, 20);

            if (replace) grid.innerHTML = '';

            (data.results || []).forEach(movie => {
                grid.appendChild(MovieCard.create(movie, 'card-medium'));
            });

            countEl.textContent = `${data.total_results || 0} movies found`;
            loadMore.style.display = currentPage < totalPages ? 'block' : 'none';
        } catch (err) {
            console.error('Discover error:', err);
            if (replace) grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">😵</div><p>Failed to load movies</p></div>`;
        }
    }

    return { render };
})();
