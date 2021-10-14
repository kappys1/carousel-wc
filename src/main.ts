import './lib/carousel.component'
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <carousel-component>
    <div class="item-carousel">hola</div>
    <div class="item-carousel">hola</div>
    <div class="item-carousel">
      <img src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"/>
    </div>
  </carousel-component>
`
