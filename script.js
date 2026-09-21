document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------
    // 1. Dark/Light Mode Toggle
    // ----------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;
    const icon = themeToggleBtn.querySelector("i");

    // Check Local Storage for saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.add("light-mode");
        icon.classList.replace("fa-sun", "fa-moon");
    }

    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        
        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            icon.classList.replace("fa-sun", "fa-moon");
        } else {
            localStorage.setItem("theme", "dark");
            icon.classList.replace("fa-moon", "fa-sun");
        }
    });

    // ----------------------------------------
    // 2. Scroll Animations (Intersection Observer)
    // ----------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    const fadeSections = document.querySelectorAll(".fade-in-section");
    fadeSections.forEach(section => {
        observer.observe(section);
    });

    // ----------------------------------------
    // 3. Smooth Scrolling logic fix for offset
    // ----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target){
                // Header offset
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });
});
