---
title: VueのMethodでthisが使えない場合
description: VueでMethodでthisが使えなくなった
link: 2018/11/vue-this
date: 2018-11-13
img: "vue-this/logo.png"
show: true
meta:
  - name: description
    content: 
  - name: keywords
    content: Vue this undefined
  - property: og:title
    content: this undefined vue
  - property: og:description
    content: VueのMethodでthisが使えなくなった
---

# VueでMethod内でthisが使えなくなった

## 前提知識

[Vueのライフサイクル](https://jp.vuejs.org/v2/guide/instance.html#ライフサイクルダイアグラム)

## 例

```js

export default {
  name: 'App',
  data(){
    return{
      test:1,
    }
  },
  created(){
    this.hello();
  },
  methods:{
    hello:()=>{
      console.log(this.test)
    }
  }
}
```

実行結果

```
undefined
```

## 問題点
アロー関数内でのthisは親コンテキストを参照するため,```undefined```になる

## 解決策
```
  hello:function(){
      console.log(this.test)
  }

  or 

  hello(){
      console.log(this.test)
  }

  ```
