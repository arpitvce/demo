/**
 * Mood Selector Component
 */
const MoodSelector = (() => {
    function create() {
        const section = document.createElement('section');
        section.className = 'mood-section animate-in';
        section.innerHTML = `
            <h2 class="section-title" style="padding:0 var(--space-lg)"><span class="emoji">🎭</span> How Are You Feeling?</h2>
            <p class="mood-subtitle" style="color:var(--text-secondary);font-size:var(--fs-sm);margin-bottom:var(--space-lg);padding:0 var(--space-lg)">Pick your mood and we'll find the perfect movies for you</p>
            <div class="mood-grid"></div>
            <div class="mood-results" id="mood-results"></div>
        `;
        const grid = section.querySelector('.mood-grid');
        MoodEngine.MOODS.forEach(mood => {
            const card = document.createElement('div');
            card.className = `mood-card ${mood.cssClass}`;
            card.innerHTML = `
                <span class="mood-emoji">${mood.emoji}</span>
                <span class="mood-label">${mood.label}</span>
            `;
            card.addEventListener('click', () => selectMood(section, mood, grid));
            grid.appendChild(card);
        });
        return section;
    }

    async function selectMood(section, mood, grid) {
        // Toggle active state
        grid.querySelectorAll('.mood-card').forEach(c => c.classList.remove('active'));
        const card = grid.querySelector(`.mood-card.${mood.cssClass}`);
        card.classList.add('active');

        const results = section.querySelector('#mood-results');
        results.innerHTML = '<div style="text-align:center;padding:var(--space-xl)"><div class="loader-ring" style="margin:0 auto"></div></div>';

        const movies = await MoodEngine.getMoviesForMood(mood.id);
        if (movies.length > 0) {
            results.innerHTML = '';
            const row = MovieRow.create(`${mood.emoji} ${mood.label} Movies`, movies, '', null, 'card-medium');
            results.appendChild(row);
        } else {
            results.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:var(--space-xl)">No movies found for this mood. Try another!</p>';
        }
    }

    return { create };
})();
