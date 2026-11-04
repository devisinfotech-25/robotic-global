(function () {
    var track = document.getElementById('hm-track');
    var prev = document.getElementById('hm-prev');
    var next = document.getElementById('hm-next');
    if (!track) return;

    function step() {
        var card = track.querySelector('.hm-card');
        return card ? card.getBoundingClientRect().width + 20 : 300;
    }

    function update() {
        var max = track.scrollWidth - track.clientWidth - 4;
        prev.disabled = track.scrollLeft <= 4;
        next.disabled = track.scrollLeft >= max;
    }

    prev.addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();