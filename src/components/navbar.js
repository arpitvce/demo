/**
 * Navbar Component — scroll effects, search, mobile menu
 */
const Navbar = (() => {
    let searchDebounceTimer = null;

    function init() {
        const navbar = document.getElementById('navbar');
        const searchContainer = document.getElementById('search-container');
        const searchToggle = document.getElementById('search-toggle');
        const searchInput = document.getElementById('search-input');
        const searchDropdown = document.getElementById('search-dropdown');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');

        // Scroll effect
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Search toggle
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
        });

        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchContainer.classList.remove('active');
                searchDropdown.classList.remove('active');
            }
        });

        // Search input
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounceTimer);
            const query = searchInput.value.trim();
            if (query.length < 2) { searchDropdown.classList.remove('active'); return; }
            searchDebounceTimer = setTimeout(async () => {
                const results = await SearchEngine.search(query);
                renderSearchResults(results, searchDropdown);
            }, 350);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.hash = `#/search/${encodeURIComponent(query)}`;
                    searchContainer.classList.remove('active');
                    searchDropdown.classList.remove('active');
                }
            }
        });

        // Mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        // Close mobile on link click
        mobileOverlay.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        });
    }

    function renderSearchResults(results, dropdown) {
        dropdown.innerHTML = '';
        if (results.movies.length === 0 && results.people.length === 0) {
            dropdown.classList.remove('active');
            return;
        }

        if (results.movies.length > 0) {
            dropdown.innerHTML += `<div class="search-category-label">🎬 Movies</div>`;
            results.movies.forEach(movie => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
                item.innerHTML = `
                    <img class="search-result-poster" src="${TMDB.imgURL(movie.poster_path, 'w92')}" alt="${movie.title}" onerror="this.style.display='none'">
                    <div class="search-result-info">
                        <div class="search-result-title">${movie.title}</div>
                        <div class="search-result-meta">⭐ ${movie.vote_average?.toFixed(1)} · ${year}</div>
                    </div>
                `;
                item.addEventListener('click', () => {
                    window.location.hash = `#/movie/${movie.id}`;
                    dropdown.classList.remove('active');
                    document.getElementById('search-container').classList.remove('active');
                });
                dropdown.appendChild(item);
            });
        }

        if (results.people.length > 0) {
            dropdown.innerHTML += `<div class="search-category-label">👤 People</div>`;
            results.people.forEach(person => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div class="search-result-info">
                        <div class="search-result-title">${person.name}</div>
                        <div class="search-result-meta">${person.known_for_department || 'Actor'}</div>
                    </div>
                `;
                item.addEventListener('click', () => {
                    window.location.hash = `#/search/${encodeURIComponent(person.name)}`;
                    dropdown.classList.remove('active');
                });
                dropdown.appendChild(item);
            });
        }

        dropdown.classList.add('active');
    }

    function setActivePage(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
    }

    return { init, setActivePage };
})();
