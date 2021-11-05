'use strict';
import * as MODULE from './constants.js';
import { Animation } from './controlAnimation.js';

const APP = {
    animateRandomRectHero() {
        const screenWidth = window.screen.width;
        const rect = document.createElement('div');
        rect.classList.add('background-rect');
        const randomNr = Math.random();
        const randomWidth = (randomNr > 0.5) ? (randomNr * 2 + 16) / 2 : (randomNr * 5 + 16);
        Object.assign(rect.style, {
            width: randomWidth + 'px',
            height: randomWidth + 'px',
            left: `${screenWidth * Math.random()}%`,
            opacity: `${(Math.random() * 4) / 10}` // random opacity from 0->0.4
        })
        const randDirect = Math.random() - Math.random();
        rect.animate([
            {},
            { transform: `translate(${randDirect * screenWidth}px, 1200px) rotate(${randDirect * 50}deg)` }
        ], {
            duration: 5 * 1000,
            iterations: 1
        });
        MODULE.heroImg.appendChild(rect);
        setTimeout(() => {
            rect.remove();
        }, 5000)
    },

    hoverEffectForSubNav(menuList) {
        [...menuList.children].forEach((item, index) => {
            const prElem = item.parentNode;
            item.onmouseover = function () {
                prElem.classList.add('active-hover');
                item.classList.add('active-hover');
            }

            item.onmouseout = function () {
                prElem.classList.remove('active-hover');
                item.classList.remove('active-hover');
            }
        })
    },

    openSubMenu(e) {
        MODULE.navigSub.classList.toggle('active');
        MODULE.navigMenuBtn.classList.toggle('active');
        if (MODULE.navigSub.classList.contains('active')) {
            MODULE.navigSubContent.classList.remove('active');
            MODULE.controlExtraMenuBtn.classList.remove('active');
            MODULE.navigSub.addEventListener('transitionend', function () {
                MODULE.navigSubContent.classList.add('active');
            });
        }
    },

    popUpText(textElement) {
        textElement.innerHTML = textElement.innerText
            .split('')
            .map((character, index) => {
                if (character == ' ') {
                    return '&nbsp'; // white space
                } else if (character == ',') {
                    return `<span style="animation-delay: ${index * 20}ms">,</span></br>`;
                }
                return (`<span style="animation-delay: ${index * 20}ms">${character}</span>`)
            })
            .join('');
    },

    openExtraMenu(e) {
        e.preventDefault();
        // Effect for Links 
        MODULE.navigSubMenu.classList.add('un-active');
        function makeEffectAndDisPlayExtraMenu() {
            // Undisplay Sub Menu
            MODULE.navigSubMenu.classList.add('un-display');
            // Display Extra Sub Navigation
            MODULE.navigExtraMenu.style.display = 'flex';
            // Display links navigation 
            MODULE.navigExtraMenu.classList.remove('un-active');
            // Display button "Go Back"
            MODULE.controlExtraMenuBtn.classList.remove('active');
            MODULE.navigSubMenu.removeEventListener('transitionend', makeEffectAndDisPlayExtraMenu, false);
        }
        MODULE.navigSubMenu.addEventListener('transitionend', makeEffectAndDisPlayExtraMenu, false);
    },

    closeExtraMenu(e) {
        // Effect for "Go Back" button
        MODULE.controlExtraMenuBtn.classList.add('active');
        function makeEffectAndReDisSubMenu() {
            MODULE.navigSubMenu.classList.remove('un-active');
            MODULE.navigSubMenu.classList.remove('un-display');
            MODULE.navigExtraMenu.classList.add('un-active');
            MODULE.navigExtraMenu.style.display = 'none';
            MODULE.controlExtraMenuBtn.removeEventListener('transitionend', makeEffectAndReDisSubMenu, false);
        }
        MODULE.controlExtraMenuBtn.addEventListener('transitionend', makeEffectAndReDisSubMenu, false);
    },

    effectWhenSrollImg() {
        [...arguments].forEach(images => {
            if (images.constructor == NodeList) { // Check if NodeList
                images.forEach(image => {
                    const indexImgWithTop = image.getBoundingClientRect().top;
                    const coordinateMoving = -(indexImgWithTop / (window.screen.height / 2) * 40);
                    image.style.transform = `translateX(${coordinateMoving}px) scale(1.3)`;
                });
            } else {
                const indexImgWithTop = images.getBoundingClientRect().top;
                const coordinateMoving = (indexImgWithTop / (window.screen.height / 2) * 50);
                images.style.transform = `translateX(${coordinateMoving}px) scale(1.3)`;
            }
        })
    },

    driftText(textElement) {
        let childElem = textElement.querySelectorAll('div');
        if ([...childElem].length == 0) {
            childElem = textElement.querySelectorAll('span');
        }
        let html = '';
        let index = 0;
        [...childElem].forEach(item => {
            html +=
                '<div>'
                + item.innerText.split('')
                    .reduce((result, letter) => {
                        return result +=
                            `<span style="animation: 0.6s driftLetter cubic-bezier(.24,1,.88,.12) ${++index * 26}ms;">${letter}</span>`
                    }, '')
                + '</div>';
        });
        textElement.innerHTML = html;
    },

    checkAnimated(element) {
        const indexElemAni = Animation.findIndex(aniElem => element === aniElem.eleAnimate);
        if (indexElemAni + 1 >= 1 && Animation[indexElemAni].flag) {
            return indexElemAni;
        }
        return -1;
    },

    activeDriftTextEffect(element) {
        // Each Effect just appearance 1 time.
        const index = APP.checkAnimated(element);
        if (index >= 0) {
            if (element.getBoundingClientRect().top <= window.screen.height * 0.6) {
                APP.driftText(element);
                Animation[index].flag = false;
            }
        }
    },

    activePopupTextEffect(element) {
        // Check for each effect just appearance 1 time.
        const indexAnimate = APP.checkAnimated(element);
        if (indexAnimate >= 0) {
            if (element.constructor == NodeList) {
                element.forEach((item, index) => {
                    if (item.getBoundingClientRect().top <= window.screen.height * 0.6) {
                        APP.popUpText(item);
                        if (index == 2) {
                            Animation[indexAnimate].flag = false;
                        }
                    }
                })
            } else {
                if (element.getBoundingClientRect().top <= window.screen.height * 0.6) {
                    APP.popUpText(element);
                    Animation[indexAnimate].flag = false;
                }
            }
        }
    },

    swipeEffect(element) {
        if (element.getBoundingClientRect().top <= window.screen.height * 0.6) {
            element.style.left = '100%';
        }
    },

    handleTransBgImageAndDisNav() {
        if (window.scrollY > 200) {
            MODULE.navigBlock.classList.add('navig-block--active');
        } else if (window.scrollY == 0) {
            MODULE.navigBlock.classList.remove('navig-block--active');
        }
        const image = MODULE.heroImg.querySelector('img');
        if (window.scrollY > 1000) {
            image.src = MODULE.srcSubHero;
            MODULE.heroImg.classList.add('active');
            MODULE.subOverlay.classList.add('active');
        } else {
            image.src = MODULE.srcHero;
            MODULE.heroImg.classList.remove('active');
            MODULE.subOverlay.classList.remove('active');
        }
    },

    moveBall(e) {
        MODULE.ball.style.top = e.clientY + 'px';
        MODULE.ball.style.left = e.clientX + 'px';
    },

    handleEvents() {
        const THIS_APP = this;
        window.onscroll = (e) => {
            this.handleTransBgImageAndDisNav();
            // Slide Img Effect
            this.effectWhenSrollImg(MODULE.category.querySelector('img'), MODULE.aboutImg);
            // Drift Effect
            [
                MODULE.cateHeading,
                MODULE.buyProdsSlogan
            ].forEach(THIS_APP.activeDriftTextEffect);
            // PopUp Effect
            [   MODULE.aboutHeadingMainTop,
                MODULE.aboutHeadingMain,
                MODULE.aboutItemDescHeading,
                MODULE.techHeading,
                MODULE.techDescMainHeading
            ]
            .forEach(THIS_APP.activePopupTextEffect);
            // Swipe Effect
            [MODULE.footerSwipeHeading].forEach(THIS_APP.swipeEffect);
        }

        window.onload = () => {
            this.activePopupTextEffect(MODULE.heroSlogan);
        }

        MODULE.navigMenuBtn.addEventListener('click', this.openSubMenu);

        [...MODULE.navigSubMenu.children].forEach(item => {
            item.addEventListener('click', this.openExtraMenu);
        })

        MODULE.controlExtraMenuBtn.addEventListener('click', this.closeExtraMenu);

        window.onmousemove = this.moveBall;

        [MODULE.navigSubMenu, MODULE.navigExtraMenu].forEach(this.hoverEffectForSubNav);
        // Hover effect for logo and button open subNav
        [
            MODULE.navigMenuBtn.querySelector('span'),
            MODULE.$('#logo').querySelector('a'),
            MODULE.navigMenuBtn.querySelector('a span:last-child')
        ]
        .forEach(this.popUpText);
    },

    start() {
        this.handleEvents();
        setInterval(this.animateRandomRectHero, 0);
    }
};

APP.start();

