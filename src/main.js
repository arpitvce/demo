/**
 * CineAI — Main Entry Point
 * Initializes all components and starts the application
 */
(function initApp() {
    // Wait for DOM
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Initialize components
            Navbar.init();
            Chatbot.init();

            // Initialize router (renders first page)
            Router.init();

            // Hide loading overlay
            setTimeout(() => {
                const overlay = document.getElementById('loading-overlay');
                overlay.classList.add('hidden');
            }, 800);

        } catch (err) {
            console.error('App initialization error:', err);
            document.getElementById('loading-overlay').innerHTML = `
                <div class="loader-container">
                    <p class="loader-text" style="color: var(--danger)">Failed to initialize. Please refresh the page.</p>
                </div>
            `;
        }
    });
})();
