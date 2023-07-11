/**
 * @class ThemeProvider
 * @description Provides the theme for the application based on the user's preferences and saved cookies.
 * @param {Object} options - Configuration options for the ThemeProvider.
 * @param {string} options.theme - Theme source ('system' or 'cookie').
 * @param {string} options.preference - User preference for theme ('light' or 'dark').
 * @param {string} options.target - Attribute name used to set the theme on elements.
 * @param {string} options.toggle - Attribute name used to identify theme toggle buttons.
 * @example
 * const theme = new ThemeProvider({
 *    theme: 'system',
 *    preference: 'light',
 *    target: 'data-theme',
 *    toggle: 'data-toggle-theme'
 *    });
 */
class ThemeProvider {
    constructor({theme, preference, target, toggle}) {
        this.theme = theme;
        this.preference = preference;
        this.target = target;
        this.toggle = toggle;

        this.init();
    }

    /**
     * Initializes the ThemeProvider by setting the initial theme and adding event listeners.
     */
    init() {
        this.setTheme();
        this.setListener();
    }

    /**
     * Sets the theme on elements with the specified target attribute.
     */
    setTheme() {
        const theme = this.getTheme();
        const target = document.querySelectorAll(`[${this.target}]`);
        target.forEach((item) => {
            item.setAttribute(this.target, theme);
        });
    }

    /**
     * Adds event listeners to theme toggle buttons.
     */
    setListener() {
        const toggle = document.querySelectorAll(`[${this.toggle}]`);
        toggle.forEach((item) => {
            item.addEventListener('click', () => {
                this.toggleTheme();
            });
        });
    }

    /**
     * Toggles the theme between light and dark and updates the attribute value of target elements accordingly.
     * Also updates the theme preference cookie.
     */
    toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        const target = document.querySelectorAll(`[${this.target}]`);
        target.forEach((item) => {
            item.setAttribute(this.target, newTheme);
        });

        this.setCookie(newTheme);
    }

    /**
     * Retrieves the current theme based on the specified theme source, user preference, and cookie value.
     * @returns {string} The current theme ('light' or 'dark').
     */
    getTheme() {
        const theme = this.theme;
        const preference = this.getPreference();
        const cookie = this.getCookie();

        if (theme === 'system') {
            if (preference === 'dark') {
                return 'dark';
            } else if (preference === 'light') {
                return 'light';
            } else {
                // Check if browser preference is set to dark mode
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                } else {
                    return 'light';
                }
            }
        } else if (theme === 'cookie') {
            if (cookie === 'dark') {
                return 'dark';
            } else if (cookie === 'light') {
                return 'light';
            } else {
                return 'light';
            }
        } else {
            return 'light';
        }
    }

    /**
     * Retrieves the user preference for the theme.
     * @returns {string} The user preference for the theme ('light' or 'dark').
     */
    getPreference() {
        const preference = this.preference;
        if (preference === 'dark') {
            return 'dark';
        } else if (preference === 'light') {
            return 'light';
        } else {
            return 'light';
        }
    }

    /**
     * Retrieves the value of the theme preference cookie.
     * @returns {string} The value of the theme preference cookie.
     */
    getCookie() {
        const name = 'theme=';
        const cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let c = cookie[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    /**
     * Sets the theme preference cookie with the specified value.
     * @param {string} value - The value to be set in the theme preference cookie.
     */
    setCookie(value) {
        const name = 'theme=';
        const date = new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + value + ';' + expires + ';path=/';
    }

    /**
     * Deletes the theme preference cookie.
     */
    deleteCookie() {
        const name = 'theme=';
        const date = new Date();
        date.setTime(date.getTime() - 365 * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + ';' + expires + ';path=/';
    }
}
