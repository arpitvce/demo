/**
 * Toast Notification System
 */
const Toast = (() => {
    function show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;
        toast.style.cssText = `
            display: flex; align-items: center; gap: 10px; padding: 12px 20px;
            background: var(--bg-elevated); border: 1px solid var(--border-subtle);
            border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
            font-size: var(--fs-sm); animation: toastSlideIn 0.3s ease;
            min-width: 250px; max-width: 400px;
        `;
        if (type === 'success') toast.style.borderColor = 'rgba(16,185,129,0.3)';
        if (type === 'error') toast.style.borderColor = 'rgba(239,68,68,0.3)';
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    return { show };
})();
