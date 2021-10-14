import './lib/carousel.component'
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <carousel-component>
    <div class="item-carousel"><img width="300" src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"/></div>
    <div class="item-carousel">hola</div>
    <div class="item-carousel">
      asdasdasd
    </div>
  </carousel-component>
`
