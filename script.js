document.addEventListener('DOMContentLoaded', () => {
    // --- WUNSCHZETTEL LOGIK: Erfüllt/Zurücksetzen ---
    const fulfilledButtons = document.querySelectorAll('.mark-fulfilled');
    const wishItems = document.querySelectorAll('.wunsch-item');

    const saveWishStatus = () => {
        const status = {};
        wishItems.forEach(item => {
            const id = item.dataset.wishId;
            status[id] = item.classList.contains('fulfilled');
        });
        localStorage.setItem('wishlistStatus', JSON.stringify(status));
    };

    const loadWishStatus = () => {
        const storedStatus = localStorage.getItem('wishlistStatus');
        if (storedStatus) {
            const status = JSON.parse(storedStatus);
            wishItems.forEach(item => {
                const id = item.dataset.wishId;
                if (status[id]) {
                    item.classList.add('fulfilled');
                } else {
                    item.classList.remove('fulfilled');
                }
            });
        }
    };

    fulfilledButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const wishId = event.target.dataset.wishId;
            const wishItem = document.querySelector(`.wunsch-item[data-wish-id="${wishId}"]`);
            if (wishItem) {
                wishItem.classList.toggle('fulfilled');
                saveWishStatus();
            }
        });
    });

    // Globale Funktion für "Wunschliste zurücksetzen" Button
    window.resetWishes = () => {
        if (confirm("Möchtest du wirklich alle Wünsche auf 'Unerfüllt' zurücksetzen?")) {
            wishItems.forEach(item => {
                item.classList.remove('fulfilled');
                // Optional: Hier könnten wir auch die 'is-visible' Klasse entfernen, 
                // um die Animation beim Zurücksetzen zu wiederholen,
                // aber für "Zurücksetzen" wollen wir sie normalerweise sichtbar lassen.
            });
            saveWishStatus();
        }
    };

    // --- DARK MODE LOGIK ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    const setDarkMode = (isEnabled) => {
        if (isEnabled) {
            document.body.classList.add('dark-mode');
            if (darkModeIcon) {
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
                darkModeToggle.childNodes[1].nodeValue = ' Light Mode';
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeIcon) {
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
                darkModeToggle.childNodes[1].nodeValue = ' Dark Mode';
            }
        }
    };

    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true);
    } else if (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true); 
    } else {
        setDarkMode(false);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            
            if (isDarkMode) {
                localStorage.setItem('darkMode', 'enabled');
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
                darkModeToggle.childNodes[1].nodeValue = ' Light Mode';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
                darkModeToggle.childNodes[1].nodeValue = ' Dark Mode';
            }
        });
    }

    // --- SCROLL ANIMATION LOGIK ---
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Status beim Laden der Seite laden
    loadWishStatus();
});