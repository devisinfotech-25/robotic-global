(function () {
    var items = document.querySelectorAll('.acc-item');

    items.forEach(function (item) {
        var head = item.querySelector('.acc-head');
        head.addEventListener('click', function () {
            var open = item.classList.contains('open');
            items.forEach(function (other) {
                other.classList.remove('open');
                other.querySelector('.acc-head').setAttribute('aria-expanded', 'false');
            });
            if (!open) {
                item.classList.add('open');
                head.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();