document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----------------------------------------
       1. Dark / Light mode
    ---------------------------------------- */
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn.querySelector("i");

    const setIcon = () => {
        const light = body.classList.contains("light-mode");
        themeIcon.className = light ? "fas fa-moon" : "fas fa-sun";
    };

    if (localStorage.getItem("theme") === "light") body.classList.add("light-mode");
    setIcon();

    themeBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
        setIcon();
    });

    /* ----------------------------------------
       2. Mobile menu
    ---------------------------------------- */
    const navToggle = document.getElementById("nav-toggle");
    const nav = document.querySelector("nav");

    navToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        navToggle.querySelector("i").className = open ? "fas fa-times" : "fas fa-bars";
    });

    /* ----------------------------------------
       3. Smooth scroll with header offset
    ---------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;
            e.preventDefault();

            const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: this.getAttribute("href") === "#home" ? 0 : top, behavior: "smooth" });

            nav.classList.remove("open");
            navToggle.querySelector("i").className = "fas fa-bars";
        });
    });

    /* ----------------------------------------
       4. Scroll progress bar + header shadow
    ---------------------------------------- */
    const progress = document.getElementById("scroll-progress");
    const header = document.getElementById("header");

    const onScroll = () => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
        header.classList.toggle("scrolled", scrolled > 30);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ----------------------------------------
       5. Reveal on scroll (with stagger delay)
    ---------------------------------------- */
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(el => {
        el.style.setProperty("--delay", (el.dataset.delay || 0) + "ms");
        revealObserver.observe(el);
    });

    /* ----------------------------------------
       6. Active nav link on scroll
    ---------------------------------------- */
    const links = document.querySelectorAll(".nav-links a");
    const sections = [...links]
        .map(l => document.querySelector(l.getAttribute("href")))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(s => sectionObserver.observe(s));

    // Clear active link when back at the top (hero)
    window.addEventListener("scroll", () => {
        if (window.scrollY < 200) links.forEach(l => l.classList.remove("active"));
    }, { passive: true });

    /* ----------------------------------------
       7. Typing effect
    ---------------------------------------- */
    const typingEl = document.getElementById("typing");
    const roles = [
        "Aspiring Full-Stack .NET Developer",
        "Frontend Web Developer",
        "AI & Computer Vision Enthusiast"
    ];

    if (reduceMotion) {
        typingEl.textContent = roles[0];
    } else {
        let roleIndex = 0, charIndex = 0, deleting = false;

        const type = () => {
            const current = roles[roleIndex];
            typingEl.textContent = current.substring(0, charIndex);

            let delay = deleting ? 35 : 75;

            if (!deleting && charIndex === current.length) {
                delay = 1800;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 400;
            }

            charIndex += deleting ? -1 : 1;
            setTimeout(type, delay);
        };
        type();
    }

    /* ----------------------------------------
       8. 3D tilt on cards
    ---------------------------------------- */
    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".tilt").forEach(card => {
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.setProperty("--ry", (x * 10) + "deg");
                card.style.setProperty("--rx", (-y * 10) + "deg");
            });
            card.addEventListener("mouseleave", () => {
                card.style.setProperty("--rx", "0deg");
                card.style.setProperty("--ry", "0deg");
            });
        });
    }

    /* ----------------------------------------
       9. Cursor glow
    ---------------------------------------- */
    const glow = document.getElementById("cursor-glow");

    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
        window.addEventListener("mousemove", e => {
            glow.style.opacity = "1";
            glow.style.left = e.clientX + "px";
            glow.style.top = e.clientY + "px";
        });
        document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
    }

    /* ----------------------------------------
       10. Particles background (hero)
    ---------------------------------------- */
    const canvas = document.getElementById("particles");

    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let w, h;
        const mouse = { x: null, y: null };

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            const count = Math.min(80, Math.floor((w * h) / 18000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2 + 1
            }));
        };

        canvas.parentElement.addEventListener("mousemove", e => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const color = getComputedStyle(body).getPropertyValue("--primary-color").trim() || "#3b82f6";
            ctx.fillStyle = color;
            ctx.strokeStyle = color;

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < 120) {
                        ctx.globalAlpha = (1 - d / 120) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                    if (d < 150) {
                        ctx.globalAlpha = (1 - d / 150) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        resize();
        draw();
    }

    /* ----------------------------------------
       11. Contact form (AJAX via FormSubmit)
    ---------------------------------------- */
    const form = document.getElementById("contact-form");
    const statusBox = document.getElementById("form-status");

    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const EMAIL = "arwamahmoudfci2023@gmail.com";

        form.addEventListener("submit", async e => {
            e.preventDefault();

            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            statusBox.className = "form-status";
            statusBox.textContent = "";

            try {
                const res = await fetch(form.dataset.ajax, {
                    method: "POST",
                    headers: { Accept: "application/json" },
                    body: new FormData(form)
                });
                const data = await res.json();

                if (res.ok && (data.success === true || data.success === "true")) {
                    statusBox.className = "form-status success";
                    statusBox.innerHTML = "<i class='fas fa-check-circle'></i> Thank you! Your message has been sent. I'll get back to you soon.";
                    form.reset();
                } else {
                    throw new Error(data.message || "Request failed");
                }
            } catch (err) {
                statusBox.className = "form-status error";
                statusBox.innerHTML = "<i class='fas fa-exclamation-circle'></i> Something went wrong. Please email me directly at <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }
});
