(function () {
    var chips = document.querySelectorAll('.chip');
    var items = document.querySelectorAll('.project');

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var key = chip.getAttribute('data-filter');
            chips.forEach(function (c) {
                c.classList.toggle('active', c === chip);
            });
            items.forEach(function (item) {
                item.hidden = key !== 'all' && item.getAttribute('data-cat') !== key;
            });
        });
    });
})();