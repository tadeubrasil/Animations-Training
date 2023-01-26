import Page from 'classes/pages'

export default class About extends Page {
  constructor () {
    super({
      id: 'about',

      element: '.about',
      elements: {
        navigation: document.querySelector('.navigation'),
        title: '.about__title'
      }
    })
  }
}
