/**
 * Movie Row Component — Horizontal scrolling movie row (Netflix-style)
 */
const MovieRow = (() => {
    function create(title, movies, emoji = '🎬', seeAllLink = null, size = 'card-medium') {
        const section = document.createElement('section');
        section.className = 'movie-row-section animate-in';

        const headerHTML = `
            <div class="movie-row-header">
                <h2 class="movie-row-title"><span>${emoji}</span> ${title}</h2>
                ${seeAllLink ? `<a href="${seeAllLink}" class="movie-row-seeall">See All →</a>` : ''}
            </div>
        `;

        section.innerHTML = `
            ${headerHTML}
            <div class="movie-row-wrapper">
                <button class="movie-row-arrow left" aria-label="Scroll left">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div class="movie-row-scroll"></div>
                <button class="movie-row-arrow right" aria-label="Scroll right">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        `;

        const scroll = section.querySelector('.movie-row-scroll');
        movies.forEach((movie, i) => {
            const card = MovieCard.create(movie, size);
            card.style.animationDelay = `${i * 50}ms`;
            scroll.appendChild(card);
        });

        // Arrow scroll
        const leftArrow = section.querySelector('.movie-row-arrow.left');
        const rightArrow = section.querySelector('.movie-row-arrow.right');
        leftArrow.addEventListener('click', () => { scroll.scrollBy({ left: -600, behavior: 'smooth' }); });
        rightArrow.addEventListener('click', () => { scroll.scrollBy({ left: 600, behavior: 'smooth' }); });

        return section;
    }

    function createSkeleton(title, count = 8) {
        const section = document.createElement('section');
        section.className = 'movie-row-section';
        section.innerHTML = `
            <div class="movie-row-header"><h2 class="movie-row-title">${title}</h2></div>
            <div class="movie-row-wrapper"><div class="movie-row-scroll"></div></div>
        `;
        const scroll = section.querySelector('.movie-row-scroll');
        for (let i = 0; i < count; i++) scroll.appendChild(MovieCard.createSkeleton());
        return section;
    }

    return { create, createSkeleton };
})();
