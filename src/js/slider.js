import gsap from 'gsap';

class CardSlider {
    constructor(element) {
        this.cardsWrapper = element.querySelector('.slider__cards');
        this.cards = Array.from(element.querySelectorAll('.slider__card'));
        this.cardsPositions = this.cards.map(card => ({
            card,
            position: 0
        }));
        this.startX = 0;
        this.moveX = 0;
        this.offset = 0;
        this.direction = '';
        this.pointerDown = false;
      

        if (!this.cards.length) {
            console.warn('No cards present');
            return;
        }

        this.cardWidth = this.cards[0].offsetWidth;
        this.threshold = this.cardWidth * 1.1;
        this.margin = parseInt(window.getComputedStyle(this.cards[0]).marginRight, 10)

        console.log('Cards wrapper', this.cardsWrapper);
        console.log('Cards', this.cards);
        console.log('Card positions', this.cardsPositions);
        console.log('Card width', this.cardWidth);
        console.log('Threshold', this.threshold);
        console.log('Margin', this.margin)

        this.bindListeners();
    }

    handleDragStart = event => {
        event.preventDefault();
        this.startX = event.pageX;
        this.pointerDown = true;

        console.log('Drag started', {
            startValue: this.startX,
        })
    };

    handleDragMove = event => {
        event.preventDefault();
        if (!this.pointerDown) return;
        this.moveX = event.pageX;
        this.offset = this.moveX - this.startX;
        this.direction = this.offset > 0 ? 'right' : 'left';

        this.cardsPositions.forEach(item => {
            gsap.set(item.card, {
                x: item.position + this.offset
            });
        });


        if (Math.abs(this.offset) >= this.threshold) {
            this.handleDragEnd();
            console.log('Threshold reached')
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
                duration: 0.4
            });
        });

        console.log('Drag ended', {
            direction: this.direction,
            offset: this.offset,
            eventType: event.type
        });

        this.offset = 0;
        this.direction = '';
        this.startX = 0;
        this.moveX = 0;
    };

    bindListeners = () => {
        this.cardsWrapper.addEventListener('mousedown', this.handleDragStart);
        this.cardsWrapper.addEventListener('mousemove', this.handleDragMove);
        this.cardsWrapper.addEventListener('mouseup', this.handleDragEnd);
        this.cardsWrapper.addEventListener('mouseleave', this.handleDragEnd)
    };
}

export default CardSlider;
