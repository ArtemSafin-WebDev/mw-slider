import gsap from 'gsap';

class CardSlider {
    constructor(element) {
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

        if (!this.cards.length) {
            console.warn('No cards present');
            return;
        }

        this.cardWidth = this.cards[0].offsetWidth;
        this.threshold = this.cardWidth * 1.1;
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
        this.startX = event.pageX;
        this.pointerDown = true;

        console.log('Drag started', {
            startValue: this.startX
        });
    };

    setActiveSlide = index => {
        if (index === this.activeIndex) {
            console.warn('Setting the same index');
            return;
        }

        if (index > this.activeIndex) {
            this.cardsPositions.forEach((item, itemIndex) => {
                if (itemIndex < index) {
                    const newPos = item.position - ((itemIndex - this.activeIndex) * this.cardWidth + (itemIndex - this.activeIndex) * this.margin);
                    console.log('New position', newPos, index - this.activeIndex);
                    gsap.to(item.card, {
                        duration: 0.4,
                        autoAlpha: 0,
                        scale: 0,
                        x: newPos,
                        onComplete: () => {
                            (item.position = newPos), (item.opacity = 0), (item.scale = 0);
                        }
                    });
                } else if (itemIndex === index) {
                    const newPos = item.position - ((index - this.activeIndex) * this.cardWidth + (index - this.activeIndex) * this.margin);
                    console.log('New active card position', newPos, index - this.activeIndex);
                    gsap.to(item.card, {
                        duration: 0.4,
                        autoAlpha: 1,
                        scale: 1,
                        x: newPos,
                        onComplete: () => {
                            (item.position = newPos), (item.opacity = 1), (item.scale = 1);
                        }
                    });
                } else {
                    const newPos = item.position - ((index - this.activeIndex) * this.cardWidth + (index - this.activeIndex) * this.margin);
                    console.log('New active card position', newPos, index - this.activeIndex);
                    gsap.to(item.card, {
                        duration: 0.4,
                        autoAlpha: 1,
                        scale: 1,
                        x: newPos,
                        onComplete: () => {
                            (item.position = newPos), (item.opacity = 1), (item.scale = 1);
                        }
                    });
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

        this.cardsPositions.forEach((item, itemIndex) => {
            if (this.direction === 'left') {
                if (itemIndex < this.activeIndex) {
                    gsap.set(item.card, {
                        x: item.position
                    });
                } else if (itemIndex === this.activeIndex) {
                    gsap.set(item.card, {
                        x: item.position,
                        autoAlpha: gsap.utils.interpolate(1, 0, Math.abs(this.offset / this.threshold)),
                        scale: gsap.utils.interpolate(1, 0, Math.abs(this.offset / this.threshold))
                    });
                } else {
                    gsap.set(item.card, {
                        x: item.position + this.offset
                    });
                }
            } else {
                if (itemIndex < this.activeIndex) {
                    gsap.set(item.card, {
                        x: item.position
                    });
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

        this.cardsPositions.forEach(item => {
            gsap.to(item.card, {
                x: item.position,
                duration: 0.4,
                scale: item.scale,
                autoAlpha: item.opacity
            });
        });

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
        this.cardsWrapper.addEventListener('mousedown', this.handleDragStart);
        this.cardsWrapper.addEventListener('mousemove', this.handleDragMove);
        this.cardsWrapper.addEventListener('mouseup', this.handleDragEnd);
        this.cardsWrapper.addEventListener('mouseleave', this.handleDragEnd);
    };
}

export default CardSlider;
