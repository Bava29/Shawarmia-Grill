document.querySelectorAll(".auth-password-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
        const input = button.parentElement.querySelector("input");
        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";
        button.setAttribute("aria-pressed", String(!isVisible));
        button.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
        button.innerHTML = isVisible
            ? '<i class="fa-regular fa-eye" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>';
    });
});
