(function () {
    var root = document.documentElement;

    function loadIncludes() {
        var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
        return Promise.all(
            nodes.map(function (node) {
                return fetch(node.getAttribute("data-include"), { cache: "no-cache" })
                    .then(function (res) {
                        if (!res.ok) throw new Error(res.status);
                        return res.text();
                    })
                    .then(function (html) {
                        node.outerHTML = html;
                    })
                    .catch(function () {
                        node.remove();
                    });
            })
        );
    }

    function setActiveLink() {
        var current = location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-links a").forEach(function (link) {
            var href = link.getAttribute("href");
            if (href === current) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    }

    function initTheme() {
        var toggles = document.querySelectorAll("#theme-toggle, .theme-switch");
        if (!toggles.length) return;
        toggles.forEach(function (toggle) {
            toggle.addEventListener("click", function () {
                var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
                root.setAttribute("data-theme", next);
                try {
                    localStorage.setItem("theme", next);
                } catch (e) { }
            });
        });
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
                var stored = null;
                try {
                    stored = localStorage.getItem("theme");
                } catch (err) { }
                if (!stored) root.setAttribute("data-theme", e.matches ? "dark" : "light");
            });
        }
    }

    function ensureMenuMarkup() {
        var links = document.querySelector(".site-header .nav-links");
        var nav = document.querySelector(".site-header .nav");
        if (!links || !nav) return;
        var menu = document.getElementById("nav-menu");
        if (!menu) {
            menu = links.closest(".nav-menu");
            if (!menu) {
                menu = document.createElement("div");
                menu.className = "nav-menu";
                links.parentNode.insertBefore(menu, links);
                menu.appendChild(links);
            }
            menu.id = "nav-menu";
        }
        if (!document.getElementById("hamburger")) {
            var burger = document.createElement("button");
            burger.className = "hamburger";
            burger.id = "hamburger";
            burger.type = "button";
            burger.setAttribute("aria-label", "Open menu");
            burger.setAttribute("aria-expanded", "false");
            burger.setAttribute("aria-controls", "nav-menu");
            burger.innerHTML = "<span></span><span></span><span></span>";
            var actions = nav.querySelector(".nav-actions");
            if (!actions) {
                actions = document.createElement("div");
                actions.className = "nav-actions";
                nav.appendChild(actions);
            }
            actions.insertBefore(burger, actions.firstChild);
        }
    }

    function initMenu() {
        ensureMenuMarkup();
        var burger = document.getElementById("hamburger");
        var menu = document.getElementById("nav-menu");
        if (!burger || !menu) return;

        function setOpen(open) {
            burger.classList.toggle("open", open);
            menu.classList.toggle("open", open);
            burger.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("menu-open", open);
        }

        burger.addEventListener("click", function () {
            setOpen(!menu.classList.contains("open"));
        });
        menu.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                setOpen(false);
            });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setOpen(false);
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth > 960) setOpen(false);
        });
    }

    function initScroll() {
        var header = document.getElementById("site-header");
        var topBtn = document.getElementById("scroll-top");
        var ticking = false;

        function update() {
            var y = window.scrollY;
            if (header) header.classList.toggle("scrolled", y > 24);
            if (topBtn) topBtn.classList.toggle("show", y > 600);
            ticking = false;
        }

        window.addEventListener(
            "scroll",
            function () {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(update);
                }
            },
            { passive: true }
        );
        update();

        if (topBtn) {
            topBtn.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }

    function initReveal() {
        var items = document.querySelectorAll("[data-reveal]");
        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) {
                el.classList.add("in");
            });
            return;
        }
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        items.forEach(function (el) {
            observer.observe(el);
        });
    }

    function initCounters() {
        var counters = document.querySelectorAll("[data-target]");
        if (!counters.length) return;

        function run(el) {
            var end = parseInt(el.getAttribute("data-target"), 10);
            var suffix = el.getAttribute("data-suffix") || "";
            var duration = 2000;
            var start = null;

            function step(ts) {
                if (start === null) start = ts;
                var p = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(end * eased) + (p === 1 ? suffix : "");
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if (!("IntersectionObserver" in window)) {
            counters.forEach(function (el) {
                el.textContent = el.getAttribute("data-target") + (el.getAttribute("data-suffix") || "");
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        run(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach(function (el) {
            observer.observe(el);
        });
    }

    function initYear() {
        document.querySelectorAll("[data-year]").forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    function initForms() {
        var form = document.getElementById("contactForm");
        if (!form) return;
        var status = form.querySelector(".form-status");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var valid = true;
            form.querySelectorAll("[required]").forEach(function (field) {
                var ok = field.value.trim() !== "";
                field.classList.toggle("invalid", !ok);
                if (!ok) valid = false;
            });
            if (!valid) {
                if (status) status.textContent = "Please fill in all required fields.";
                return;
            }
            var btn = form.querySelector('button[type="submit"]');
            var label = btn.innerHTML;
            btn.disabled = true;
            btn.textContent = "Sending...";
            setTimeout(function () {
                if (status) status.textContent = "Thank you for reaching out. Your message has been sent.";
                form.reset();
                btn.innerHTML = label;
                btn.disabled = false;
            }, 1500);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        loadIncludes().then(function () {
            setActiveLink();
            initTheme();
            initMenu();
            initScroll();
            initReveal();
            initCounters();
            initYear();
            initForms();
        });
    });
})();