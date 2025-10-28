// ==========================================================
// NEU: WEIHNACHTS-COUNTDOWN FUNKTION
// ==========================================================

function updateCountdown() {
    // Ziel: Heiligabend, 24. Dezember dieses Jahres (00:00 Uhr)
    const now = new Date();
    
    // Wir nehmen das aktuelle Jahr, um den 24. Dezember festzulegen.
    let year = now.getFullYear();
    
    // Überprüfen, ob Weihnachten dieses Jahr schon vorbei ist (nach dem 24. Dez)
    if (now.getMonth() === 11 && now.getDate() > 24) {
        year = year + 1; // Zähle bis nächstes Jahr
    }

    // Heiligabend am 24. Dezember um 00:00:00 Uhr
    const christmas = new Date(year, 11, 24, 0, 0, 0).getTime();
    
    const distance = christmas - now.getTime();

    // Berechnung für Tage, Stunden, Minuten und Sekunden
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdownTimer');
    
    if (countdownElement) {
        if (distance < 0) {
            // Falls der Zähler abgelaufen ist
            countdownElement.innerHTML = "🎄 FROHE WEIHNACHTEN! 🎅";
        } else {
            // Zeigt den Countdown an
            countdownElement.innerHTML = `${days} TAGE, ${hours} STD., ${minutes} MIN., ${seconds} SEK.`;
        }
    }
}

// Countdown sofort starten und jede Sekunde aktualisieren
updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================================
// BESTEHENDER CODE: WUNSCHLISTE & DARK MODE ETC.
// ==========================================================

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
            // Findet den Button selbst, oder das Elternelement mit data-wish-id, falls der Click auf dem Icon war
            const targetButton = event.target.closest('.mark-fulfilled'); 
            const wishId = targetButton.dataset.wishId;
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