/* Apply the existing saved theme before the page stylesheet paints. */
try {
    if (localStorage.getItem("shawarmia-theme") === "dark") {
        document.documentElement.classList.add("dark-mode");
    }

    const updateThemeLogos = function (root) {
        if (root.matches && root.matches("[data-theme-light][data-theme-dark]")) {
            root.src = document.documentElement.classList.contains("dark-mode")
                ? root.dataset.themeDark
                : root.dataset.themeLight;
        }
        if (root.querySelectorAll) {
            root.querySelectorAll("[data-theme-light][data-theme-dark]")
                .forEach(updateThemeLogos);
        }
    };

    updateThemeLogos(document.documentElement);
    new MutationObserver(function (records) {
        records.forEach(function (record) {
            record.addedNodes.forEach(updateThemeLogos);
        });
    }).observe(document.documentElement, { childList: true, subtree: true });
} catch (error) {
    // Keep the page usable when browser storage is unavailable.
}
