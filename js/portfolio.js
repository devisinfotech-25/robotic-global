(function () {
    var tabs = document.querySelectorAll('.tab');
    var items = document.querySelectorAll('.work');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var key = tab.getAttribute('data-filter');
            tabs.forEach(function (t) {
                t.classList.toggle('active', t === tab);
            });
            items.forEach(function (item) {
                item.hidden = key !== 'all' && item.getAttribute('data-cat') !== key;
            });
        });
    });
})();