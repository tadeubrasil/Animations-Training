import Page from 'classes/pages'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home',

      element: '.home',
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.home__link'
      }
    })
  }

  create () {
    super.create()

    this.elements.link.addEventListener('Click', _ => console.log('oh, you clicked me!'))
  }
}
