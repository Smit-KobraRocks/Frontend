// submit.js

export const SubmitButton = () => {

    return (
        <div className="submit">
            <button type="submit" className="submit__button">
                <span>Launch pipeline</span>
                <svg className="submit__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                        d="M3.25 8h7.69L7.22 4.28a.75.75 0 011.06-1.06l4.75 4.75a.75.75 0 010 1.06l-4.75 4.75a.75.75 0 11-1.06-1.06L10.94 9.5H3.25a.75.75 0 010-1.5z"
                        fill="currentColor"
                    />
                </svg>
            </button>
            <p className="submit__hint">Your configuration is saved automatically while you design.</p>
        </div>
    );
};
