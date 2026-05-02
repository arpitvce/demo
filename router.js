/**
 * Hash-based SPA Router
 */
const Router = (() => {
    const routes = [];
    let currentCleanup = null;

    function addRoute(pattern, handler) {
        routes.push({ pattern, handler });
    }

    function matchRoute(hash) {
        const path = hash.replace('#', '') || '/';
        for (const route of routes) {
            const regex = new RegExp('^' + route.pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
            const match = path.match(regex);
            if (match) {
                return { handler: route.handler, params: match.slice(1) };
            }
        }
        return null;
    }

    async function navigate() {
        const container = document.getElementById('app-content');
        const hash = window.location.hash || '#/';

        // Run cleanup if needed
        if (currentCleanup) { currentCleanup(); currentCleanup = null; }

        const matched = matchRoute(hash);
        if (matched) {
            // Scroll to top
            window.scrollTo(0, 0);
            // Update nav
            const page = hash.includes('/movie/') ? '' :
                         hash.includes('/discover') ? 'discover' :
                         hash.includes('/profile') ? 'profile' :
                         hash.includes('/search') ? '' : 'home';
            Navbar.setActivePage(page);
            // Render
            await matched.handler(container, ...matched.params);
        } else {
            container.innerHTML = `
                <div class="empty-state" style="padding-top:120px">
                    <div class="empty-state-icon">🤷</div>
                    <h2 class="empty-state-title">Page Not Found</h2>
                    <p class="empty-state-text">The page you're looking for doesn't exist.</p>
                    <a href="#/" class="btn-primary" style="margin-top:24px">← Go Home</a>
                </div>
            `;
        }
    }

    function init() {
        // Define routes
        addRoute('/', (c) => HomePage.render(c));
        addRoute('/discover', (c) => DiscoverPage.render(c));
        addRoute('/profile', (c) => ProfilePage.render(c));
        addRoute('/movie/:id', (c, id) => {
            currentCleanup = () => HeroCarousel.destroy();
            MovieDetailPage.render(c, id);
        });
        addRoute('/search/:query', (c, query) => SearchPage.render(c, query));
        addRoute('/search', (c) => SearchPage.render(c, ''));

        // Listen for hash changes
        window.addEventListener('hashchange', navigate);

        // Initial route
        navigate();
    }

    return { init };
})();
