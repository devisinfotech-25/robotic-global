(function () {
    var root = document.documentElement;
    var theme = "light";
    try {
        var saved = localStorage.getItem("theme");
        theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch (e) { }
    root.setAttribute("data-theme", theme);
    root.classList.add("js");
})();