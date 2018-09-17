module.exports = {
  base: '/',
  dest: './dist',
  title: 'kurisuのブログ',
  description: 'kurisuのブロぐ',
  themeConfig: {
    repo: 'ryomak',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      {
        text: 'Detail',
        items: [
          { text: 'About', link: '/about/' },
          { text: 'Contact', link: '/contact/' },
        ]
      }
    ],
    sidebar: {
      '/docs/blog/': [
        'axios-excel',
      ]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@asset': './public'
      }
    }
  }
}
