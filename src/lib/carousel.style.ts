import { css } from 'lit'

export const carouselStyle = css`
:host{
    display: flex;
}

:host .container {
    margin: 0 auto;
    width: 600px;
    height: 400px;
    position: relative;
}
:host .container .carousel {
    height: 100%;
    width: 100%;
    position: absolute;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -o-transform-style: preserve-3d;
    transform-style: preserve-3d;

}
:host.ready .carousel {
    -webkit-transition: -webkit-transform 300ms;
    -moz-transition:-moz-transform 300ms;
    -o-transition: -o-transform 300ms;
    transition: transform 300ms;
}
/* .container .carousel .item-carousel {  */
:host .container .carousel ::slotted(.item-carousel) {
    display: block;
    position: absolute;
    border:1px solid black;
    width: 100%;
    height: 100%;
    text-align: center;
    transform-style: preserve-3d;
    opacity: 0;
    color: red;
}


:host .container .carousel::content > .item-carousel img {
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    border: 1px solid red;
}

:host .container .carousel ::slotted(.item-carousel.next),
:host .container .carousel ::slotted(.item-carousel.prev),
:host .container .carousel ::slotted(.item-carousel.actual){
    opacity: 0.95;
}
`
