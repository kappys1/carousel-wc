/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './lib'

import './style.css'
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <carousel-component id="carousel1" angle="45" mode="horizontal">
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

})
