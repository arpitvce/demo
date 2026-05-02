/**
 * Filter Panel Component for Discover page
 */
const FilterPanel = (() => {
    const LANGUAGES = [
        { code: '', label: 'All Languages' },
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'Hindi' },
        { code: 'es', label: 'Spanish' },
        { code: 'fr', label: 'French' },
        { code: 'ja', label: 'Japanese' },
        { code: 'ko', label: 'Korean' },
        { code: 'zh', label: 'Chinese' },
        { code: 'de', label: 'German' },
        { code: 'it', label: 'Italian' }
    ];
    const SORT_OPTIONS = [
        { value: 'popularity.desc', label: 'Most Popular' },
        { value: 'vote_average.desc', label: 'Highest Rated' },
        { value: 'primary_release_date.desc', label: 'Newest First' },
        { value: 'primary_release_date.asc', label: 'Oldest First' },
        { value: 'revenue.desc', label: 'Highest Revenue' }
    ];

    function create(onFilterChange) {
        const panel = document.createElement('div');
        panel.className = 'filter-panel';
        panel.innerHTML = `
            <div class="filter-section">
                <div class="filter-label">Genre</div>
                <div class="filter-genre-grid" id="filter-genres"></div>
            </div>
            <div class="filter-section">
                <div class="filter-label">Min Rating</div>
                <input type="range" class="filter-range" id="filter-rating" min="0" max="10" step="0.5" value="0">
                <div class="filter-range-value" id="filter-rating-value">Any</div>
            </div>
            <div class="filter-section">
                <div class="filter-label">Year From</div>
                <input type="range" class="filter-range" id="filter-year-from" min="1970" max="2026" value="1970">
                <div class="filter-range-value" id="filter-year-from-value">1970</div>
            </div>
            <div class="filter-section">
                <div class="filter-label">Year To</div>
                <input type="range" class="filter-range" id="filter-year-to" min="1970" max="2026" value="2026">
                <div class="filter-range-value" id="filter-year-to-value">2026</div>
            </div>
            <div class="filter-section">
                <div class="filter-label">Language</div>
                <select class="filter-select" id="filter-language">
                    ${LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join('')}
                </select>
            </div>
            <div class="filter-section">
                <div class="filter-label">Sort By</div>
                <select class="filter-select" id="filter-sort">
                    ${SORT_OPTIONS.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
                </select>
            </div>
            <div class="filter-actions">
                <button class="btn-primary" id="filter-apply">Apply Filters</button>
                <button class="btn-secondary" id="filter-clear">Clear</button>
            </div>
        `;

        // Populate genres
        const genreGrid = panel.querySelector('#filter-genres');
        const selectedGenres = new Set();
        Object.entries(TMDB.GENRE_MAP).forEach(([id, name]) => {
            const btn = document.createElement('button');
            btn.className = 'filter-genre-btn';
            btn.textContent = name;
            btn.dataset.genreId = id;
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                if (selectedGenres.has(id)) selectedGenres.delete(id);
                else selectedGenres.add(id);
            });
            genreGrid.appendChild(btn);
        });

        // Rating slider
        const ratingSlider = panel.querySelector('#filter-rating');
        const ratingValue = panel.querySelector('#filter-rating-value');
        ratingSlider.addEventListener('input', () => {
            ratingValue.textContent = ratingSlider.value > 0 ? `${ratingSlider.value}+` : 'Any';
        });

        // Year sliders
        const yearFrom = panel.querySelector('#filter-year-from');
        const yearFromVal = panel.querySelector('#filter-year-from-value');
        yearFrom.addEventListener('input', () => { yearFromVal.textContent = yearFrom.value; });
        const yearTo = panel.querySelector('#filter-year-to');
        const yearToVal = panel.querySelector('#filter-year-to-value');
        yearTo.addEventListener('input', () => { yearToVal.textContent = yearTo.value; });

        // Apply
        panel.querySelector('#filter-apply').addEventListener('click', () => {
            const filters = {
                genres: [...selectedGenres].join(','),
                sortBy: panel.querySelector('#filter-sort').value,
                minRating: ratingSlider.value > 0 ? ratingSlider.value : undefined,
                yearFrom: yearFrom.value > 1970 ? yearFrom.value : undefined,
                yearTo: yearTo.value < 2026 ? yearTo.value : undefined,
                language: panel.querySelector('#filter-language').value || undefined
            };
            onFilterChange(filters);
        });

        // Clear
        panel.querySelector('#filter-clear').addEventListener('click', () => {
            selectedGenres.clear();
            panel.querySelectorAll('.filter-genre-btn').forEach(b => b.classList.remove('active'));
            ratingSlider.value = 0; ratingValue.textContent = 'Any';
            yearFrom.value = 1970; yearFromVal.textContent = '1970';
            yearTo.value = 2026; yearToVal.textContent = '2026';
            panel.querySelector('#filter-language').value = '';
            panel.querySelector('#filter-sort').value = 'popularity.desc';
            onFilterChange({});
        });

        return panel;
    }

    return { create };
})();
