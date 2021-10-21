# Carousel Web Component

Light Carousel library for mobile and desktop.

### status : In development

This is an adapted library of [ngx-carousel](https://github.com/kappys1/ngx-carousel) but now for all technologies.
The reason to develop it in Web Components is to make easy the adaptability to all frameworks.
In a future, it will be available to each specific modern framework

Simple Demo : [Here](https://carousel-web-component.vercel.app/)

## Usage

HTML:

```html
<carousel-component id="carousel1" angle="90" mode="horizontal">
  <div class="item-carousel">
    <img width="300" src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"/>
  </div>
  <div class="item-carousel">foo</div>
  <div class="item-carousel">dev</div>
  <div class="item-carousel">stack</div>
</carousel-component>
```

JS
```js
// if you don want to control anything
import 'carousel-wc'
// if you want to control everything of carousel
import {Carousel} from './lib'


const elm = document.querySelector('#carousel1')
const carousel1 = new Carousel(elm)
setTimeout(() => {
  carousel1.slideNext()
}, 1000)
```

### Development

Dev mode : ```npm run serve```
Build: ```npm run build```
Commit: ```npm run co```  To follow the rules.
Release: ```npm run release```



### Author
Alex Marcos Gutierrez

### License
MIT
