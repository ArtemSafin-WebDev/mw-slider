import gsap from 'gsap';

class CardSlider {
    constructor(element) {
        this.rootElement = element;
        this.cardsWrapper = element.querySelector('.slider__cards');
        this.cards = Array.from(element.querySelectorAll('.slider__card'));
        this.cardsPositions = this.cards.map(card => ({
            card,
            position: 0,
            opacity: 1,
            scale: 1
        }));
        this.startX = 0;
        this.moveX = 0;
        this.offset = 0;
        this.direction = '';
        this.pointerDown = false;
        this.activeIndex = 0;
        this.locked = false;
        this.clonedSlides = [];

        if (!this.cards.length) {
            console.warn('No cards present');
            return;
        }

        this.cardWidth = this.cards[0].offsetWidth;
        this.threshold = this.cardWidth * 0.3;
        this.margin = parseInt(window.getComputedStyle(this.cards[0]).marginRight, 10);
        this.thresholdReached = false;

        console.log('Cards wrapper', this.cardsWrapper);
        console.log('Cards', this.cards);
        console.log('Card positions', this.cardsPositions);
        console.log('Card width', this.cardWidth);
        console.log('Threshold', this.threshold);
        console.log('Margin', this.margin);

        this.bindListeners();
    }

    handleDragStart = event => {
        event.preventDefault();
        if (this.locked) {
            console.log('Slider is locked');
            return;
        }
        this.startX = event.pageX;
        this.pointerDown = true;

        console.log('Drag started', {
            startValue: this.startX
        });
    };


    cloneSlides = () => {
        const clonedCards = this.cards.map(card => card.cloneNode(true));
        this.cardsWrapper.append(...clonedCards);
        this.resetSlider();

       
    }

    resetSlider = () => {
        const currentIndex = this.activeIndex;
        this.cards = Array.from(this.rootElement.querySelectorAll('.slider__card'));
        this.cards.forEach(card => {
            gsap.killTweensOf(card);
            gsap.set(card, {
                clearProps:"all"
            })
        })
        this.cardsPositions = this.cards.map(card => ({
            card,
            position: 0,
            opacity: 1,
            scale: 1
        }));

        this.cardWidth = this.cards[0].offsetWidth;
        this.threshold = this.cardWidth * 0.3;
        this.margin = parseInt(window.getComputedStyle(this.cards[0]).marginRight, 10);

        this.activeIndex = 0;

        this.setActiveSlide(currentIndex, true)
    }

    translateSlides = () => {
        this.cardsPositions.forEach((item, itemIndex) => {
            if (this.direction === 'left') {
                if (itemIndex < this.activeIndex) {
                    gsap.set(item.card, {
                        x: item.position
                    });
                } else if (itemIndex === this.activeIndex) {
                    gsap.set(item.card, {
                        x: item.position,
                        autoAlpha: gsap.utils.interpolate(1, 0, Math.abs(this.offset / this.cardWidth / 1.2)),
                        scale: gsap.utils.interpolate(1, 0, Math.abs(this.offset / this.cardWidth / 1.2))
                    });
                } else {
                    gsap.set(item.card, {
                        x: item.position + this.offset
                    });
                }
            } else {
                if (itemIndex < this.activeIndex) {
                    if (itemIndex === this.activeIndex - 1) {
                        console.log('Offset', this.offset / this.cardWidth * 2);
                        gsap.set(item.card, {
                            x: item.position,
                            autoAlpha: gsap.utils.interpolate(0, 1, Math.abs(this.offset / this.cardWidth * 2)),
                            scale: gsap.utils.interpolate(0, 1, Math.abs(this.offset / this.cardWidth * 2))
                        });
                    } else {
                        gsap.set(item.card, {
                            x: item.position
                        });
                    }
                  
                } else if (itemIndex === this.activeIndex) {
                    gsap.set(item.card, {
                        x: item.position + this.offset
                    });
                } else {
                    gsap.set(item.card, {
                        x: item.position + this.offset
                    });
                }
            }
        });
    };


    translateToOriginalPositions = () => {
        this.locked = true;
        gsap.delayedCall(0.4, () => {
            this.locked = false;
        });
        this.cardsPositions.forEach(item => {
            gsap.to(item.card, {
                x: item.position,
                duration: 0.4,
                scale: item.scale,
                autoAlpha: item.opacity
            });
        });
    }

    setActiveSlide = (index, force = false) => {
        if (index === this.activeIndex) {
            console.warn('Setting the same index');
            return;
        }

        if (!this.cards[index]) {
            console.error('No card with such index');
            return;
        }

        this.locked = true;

        const DURATION = force ? 0 : 0.4;
        gsap.delayedCall(DURATION, () => {
            this.locked = false;
        });

        if (index > this.activeIndex) {
            this.cardsPositions.forEach((item, itemIndex) => {
                if (itemIndex < index) {
                    if (itemIndex < this.activeIndex) {
                        item.opacity = 0;
                        item.scale = 0;
                        gsap.to(item.card, {
                            duration: DURATION,
                            autoAlpha: 0,
                            scale: 0,
                            x: item.position
                        });
                    } else {
                        const newPos =
                            item.position - ((itemIndex - this.activeIndex) * this.cardWidth + (itemIndex - this.activeIndex) * this.margin);
                        item.position = newPos;
                        item.opacity = 0;
                        item.scale = 0;
                        gsap.to(item.card, {
                            duration: DURATION,
                            autoAlpha: 0,
                            scale: 0,
                            x: newPos
                        });
                    }
                } else if (itemIndex === index) {
                    const newPos = item.position - ((index - this.activeIndex) * this.cardWidth + (index - this.activeIndex) * this.margin);
                    item.position = newPos;
                    item.opacity = 1;
                    item.scale = 1;
                    gsap.to(item.card, {
                        duration: DURATION,
                        autoAlpha: 1,
                        scale: 1,
                        x: newPos
                    });
                } else {
                    const newPos = item.position - ((index - this.activeIndex) * this.cardWidth + (index - this.activeIndex) * this.margin);
                    item.position = newPos;
                    item.opacity = 1;
                    item.scale = 1;
                    gsap.to(item.card, {
                        duration: DURATION,
                        autoAlpha: 1,
                        scale: 1,
                        x: newPos
                    });
                }
            });
        } else {
            this.cardsPositions.forEach((item, itemIndex) => {
                if (itemIndex < index) {
                    item.opacity = 0;
                    item.scale = 0;
                    gsap.to(item.card, {
                        duration: DURATION,
                        autoAlpha: 0,
                        scale: 0,
                        x: item.position
                    });
                } else if (itemIndex === index) {
                    item.opacity = 1;
                    item.scale = 1;

                    gsap.to(item.card, {
                        duration: DURATION,
                        autoAlpha: 1,
                        scale: 1,
                        x: item.position
                    });
                } else {
                    if (itemIndex > index && itemIndex <= this.activeIndex) {
                        const newPos = item.position + (itemIndex - index) * this.cardWidth + (itemIndex - index) * this.margin;
                        item.position = newPos;
                        item.opacity = 1;
                        item.scale = 1;
                        gsap.to(item.card, {
                            duration: DURATION,
                            autoAlpha: 1,
                            scale: 1,
                            x: newPos
                        });
                    } else {
                        const newPos = item.position + (this.activeIndex - index) * this.cardWidth + (this.activeIndex - index) * this.margin;
                        item.position = newPos;
                        item.opacity = 1;
                        item.scale = 1;
                        gsap.to(item.card, {
                            duration: DURATION,
                            autoAlpha: 1,
                            scale: 1,
                            x: newPos
                        });
                    }
                }
            });
        }

        this.activeIndex = index;
    };

    handleDragMove = event => {
        event.preventDefault();
        if (!this.pointerDown) return;
        this.moveX = event.pageX;
        this.offset = this.moveX - this.startX;
        this.direction = this.offset > 0 ? 'right' : 'left';

        this.translateSlides();

        if (Math.abs(this.offset) >= this.threshold) {
            this.thresholdReached = true;
            this.handleDragEnd();
            console.log('Threshold reached');
        }
    };

    handleDragEnd = event => {
        if (event) {
            event.preventDefault();
        }

        if (!this.pointerDown) {
            return;
        }
        this.pointerDown = false;

        // Return to the original positions

        if (this.thresholdReached) {
            if (this.direction === 'left' && this.cards[this.activeIndex + 1]) {
                this.setActiveSlide(this.activeIndex + 1);
            } else if (this.direction === 'right' && this.cards[this.activeIndex - 1]) {
                this.setActiveSlide(this.activeIndex - 1);
            } else {
                this.translateToOriginalPositions();
            }
        } else {
            this.translateToOriginalPositions();
        }

        console.log('Drag ended', {
            direction: this.direction,
            offset: this.offset,
            eventType: event ? event.type : 'threshold reached'
        });

        this.offset = 0;
        this.direction = '';
        this.startX = 0;
        this.moveX = 0;
        this.thresholdReached = false;
    };

    bindListeners = () => {
        this.cardsWrapper.addEventListener('pointerdown', this.handleDragStart);
        this.cardsWrapper.addEventListener('pointermove', this.handleDragMove);
        this.cardsWrapper.addEventListener('pointerup', this.handleDragEnd);
        this.cardsWrapper.addEventListener('pointerleave', this.handleDragEnd);
        this.cardsWrapper.addEventListener('pointercancel', this.handleDragEnd);
    };
}

export default CardSlider;
