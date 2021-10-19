import { Carousel } from './lib/carousel.component'

import './style.css'
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <carousel-component mode="vertical">
    <div class="item-carousel"><img width="300" src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"/></div>
    <div class="item-carousel">hola</div>
    <div class="item-carousel">
      asdasdasd
    </div>
  </carousel-component>
`

setTimeout(() => {
  Carousel.slideNext()
}, 1000)
