---
title: Excelファイルをaxiosで扱う時の注意点
description: axios.getではblobファイルを直接扱うと文字化けを起こすため，それを回避する必要があります．
link: 2018/09/axios-excel
date: 2018-09-17
img: "axios-excel/logo.png"
show: true

meta:
  - name: description
    content: axiosでBlobファイルを取得するときに文字化けする
  - name: keyword
    content: axios,blob,文字化け,vue
---
## ハマったポイント

サーバ処理

```go
return c.Blob(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buf.Bytes())
```

上記のレスポンスをaxiosでExcelデータとして取得し,処理する時

```js
axios.get('/ex').then(res=>{
    let blob = new Blob([res.data]);
     ....
});
```

これだと，ファイルは文字化けしてしまう．

## ミス
axios.getは ***デフォルトが一度文字列*** として，処理する．

## 解決策
getでファイルタイプを選択しておく．

```js
axios.get('/ex',{
    responseType:'blob',
    dataType:'binary',
}).then(res=>{
    let blob = new Blob([res.data]);
     ....
});
```
