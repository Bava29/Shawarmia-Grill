/* =========================================================
   SHAWARMIA GRILL
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MENU CATEGORY NAVIGATION
       ========================= */
    const menuLinks = Array.from(document.querySelectorAll(".menu-filter-link"));
    const menuSections = Array.from(document.querySelectorAll(".menu-category"));

    if (menuLinks.length && menuSections.length) {
        let menuNavigationTimer = null;
        let menuNavigationTarget = null;
        let isMenuNavigationScrolling = false;

        const setActiveMenuLink = function (id) {
            menuLinks.forEach(function (link) {
                const active = link.dataset.menuTarget === id;
                link.classList.toggle("is-active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        };

        menuLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const target = document.getElementById(link.dataset.menuTarget);
                if (!target) return;
                event.preventDefault();
                history.replaceState(null, "", "#" + target.id);
                menuNavigationTarget = target.id;
                isMenuNavigationScrolling = true;
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveMenuLink(target.id);

                window.clearTimeout(menuNavigationTimer);
                menuNavigationTimer = window.setTimeout(function () {
                    isMenuNavigationScrolling = false;
                    if (menuNavigationTarget) setActiveMenuLink(menuNavigationTarget);
                    menuNavigationTarget = null;
                }, 180);
            });
        });

        window.addEventListener("scroll", function () {
            if (!isMenuNavigationScrolling) return;
            window.clearTimeout(menuNavigationTimer);
            menuNavigationTimer = window.setTimeout(function () {
                isMenuNavigationScrolling = false;
                if (menuNavigationTarget) setActiveMenuLink(menuNavigationTarget);
                menuNavigationTarget = null;
            }, 180);
        }, { passive: true });

        if ("IntersectionObserver" in window) {
            const menuObserver = new IntersectionObserver(function (entries) {
                if (isMenuNavigationScrolling) return;
                const visible = entries.filter(function (entry) { return entry.isIntersecting; })
                    .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
                if (visible.length) setActiveMenuLink(visible[0].target.id);
            }, { rootMargin: "-24% 0px -62% 0px", threshold: [0, 0.1, 0.25, 0.5] });

            menuSections.forEach(function (section) { menuObserver.observe(section); });
        }

        if (window.location.hash) {
            const initialTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
            if (initialTarget && initialTarget.classList.contains("menu-category")) {
                setActiveMenuLink(initialTarget.id);
            }
        }
    }

    /* =========================
       MOBILE MENU
       ========================= */

    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mobileNavigation = document.getElementById("mobileNavigation");

    if (mobileMenuToggle && mobileNavigation) {

        mobileMenuToggle.addEventListener("click", function () {

            const isOpen = mobileNavigation.classList.toggle("active");

            mobileMenuToggle.classList.toggle("active", isOpen);

            mobileMenuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

        });

    }


    /* =========================
       MOBILE DROPDOWNS
       ========================= */

    const mobileDropdownToggles =
        document.querySelectorAll(".mobile-dropdown-toggle");

    mobileDropdownToggles.forEach(function (toggle) {

        toggle.addEventListener("click", function () {

            const parent = toggle.closest(".mobile-has-dropdown");

            if (!parent) return;

            /* Close other dropdowns */
            document
                .querySelectorAll(".mobile-has-dropdown.open")
                .forEach(function (item) {

                    if (item !== parent) {
                        item.classList.remove("open");
                    }

                });

            /* Toggle current dropdown */
            parent.classList.toggle("open");

        });

    });


    /* =========================
       DARK MODE
       ========================= */

    const themeToggles =
        document.querySelectorAll(".theme-toggle");

    const savedTheme =
        localStorage.getItem("shawarmia-theme");

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-mode");
    }


    function updateThemeIcons() {

        const isDark =
            document.documentElement.classList.contains("dark-mode");

        document.querySelectorAll("[data-theme-light][data-theme-dark]")
            .forEach(function (image) {
                image.src = isDark
                    ? image.dataset.themeDark
                    : image.dataset.themeLight;
            });

        themeToggles.forEach(function (button) {

            const icon = button.querySelector("i");

            if (icon) {
                icon.className = isDark
                    ? "fa-solid fa-sun"
                    : "fa-solid fa-moon";
            }

        });

    }

    updateThemeIcons();


    themeToggles.forEach(function (button) {

        button.addEventListener("click", function () {

            document.documentElement.classList.toggle("dark-mode");

            const isDark =
                document.documentElement.classList.contains("dark-mode");

            localStorage.setItem(
                "shawarmia-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcons();

        });

    });


    /* =========================
       RTL MODE
       ========================= */

    const rtlToggles =
        document.querySelectorAll(".rtl-toggle");

    const savedDirection =
        localStorage.getItem("shawarmia-direction");

    if (savedDirection === "rtl") {
        document.documentElement.setAttribute("dir", "rtl");
    }


    rtlToggles.forEach(function (button) {

        button.addEventListener("click", function () {

            const currentDirection =
                document.documentElement.getAttribute("dir");

            if (currentDirection === "rtl") {

                document.documentElement.setAttribute("dir", "ltr");

                localStorage.setItem(
                    "shawarmia-direction",
                    "ltr"
                );

            } else {

                document.documentElement.setAttribute("dir", "rtl");

                localStorage.setItem(
                    "shawarmia-direction",
                    "rtl"
                );

            }

        });

    });


    /* =========================
       CLOSE MOBILE MENU
       AFTER NORMAL LINK CLICK
       ========================= */

    const mobileNormalLinks =
        document.querySelectorAll(
            ".mobile-nav-item > a:not(.mobile-dropdown-link)"
        );

    mobileNormalLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (mobileNavigation) {
                mobileNavigation.classList.remove("active");
            }

            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove("active");
                mobileMenuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });

    });


    /* =========================
       CLOSE MOBILE MENU
       WHEN RESIZING TO DESKTOP
       ========================= */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 1024) {

            if (mobileNavigation) {
                mobileNavigation.classList.remove("active");
            }

            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove("active");
                mobileMenuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            document
                .querySelectorAll(".mobile-has-dropdown.open")
                .forEach(function (item) {
                    item.classList.remove("open");
                });

        }

    });

});

/* =========================================
   SCROLL TO TOP
========================================= */

const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {
            scrollTopBtn.classList.add("active");
        } else {
            scrollTopBtn.classList.remove("active");
        }

    });

    scrollTopBtn.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}
