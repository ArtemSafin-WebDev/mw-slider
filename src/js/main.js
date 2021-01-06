import polyfills from './polyfills';
import detectTouch from './detectTouch';
import CardSlider from './slider';

document.addEventListener('DOMContentLoaded', function() {
    polyfills();
    detectTouch();



    const sliderElement = document.querySelector('.js-slider');

    window.cardSlider = new CardSlider(sliderElement);
});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    setTimeout(() => document.body.classList.add('animatable'), 300)
})
