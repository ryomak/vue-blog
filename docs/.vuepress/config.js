module.exports = {
  base: '/',
  dest: './dist',
  title: 'kurisuのブログ',
  description: 'kurisuのブログ',
  ga: 'UA-125943474-1',
  head: [
    ['meta',{ name:"google-site-verification", content:"qaMSP7OaSQ1W9LjCjdsxPcQWt8RkTEpCdJsexYkqeqg"}],
  ],
  themeConfig: {
    repo: 'ryomak',
    logo: '/img/dog.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      {
        text: 'Detail',
        items: [
          { text: 'About', link: '/about/' },
          { text: 'Contact', link: '/contact/' },
        ]
      },
      { text: 'Logo-Tshit', link: 'https://peppar.fashionstore.jp/'},
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@asset': './public'
      }
    }
  }
}
