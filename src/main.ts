import { Carousel } from './lib/carousel'

import './style.css'
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <carousel-component id="carousel1" angle="90" mode="horizontal">
    <div class="item-carousel"><img width="300" src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"/></div>
    <div class="item-carousel">hola</div>
    <div class="item-carousel">
      asdasdasd
    </div>
    <div class="item-carousel">
      asdasdasd
    </div>
    <div class="item-carousel">
      asdasdasd
    </div>
    <div class="item-carousel">
      asdasdasd
    </div>

  </carousel-component>
`
setTimeout(() => {
  const elm = document.querySelector('#carousel1')
  console.log(elm)
  const carousel1 = new Carousel(elm)
  setTimeout(() => {
    carousel1.lockSlides(true)
  }, 1000)
})
