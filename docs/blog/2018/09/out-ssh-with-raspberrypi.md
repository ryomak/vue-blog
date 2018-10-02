---
title: ラズベリーパイを外部からSSHでアクセスする方法
description: ラズパイに外部からSSHでアクセスするための設定方法をメモ程度にまとめました．
link: 2018/09/out-ssh-with-raspberrypi
date: 2018-09-22
img: "out-ssh/logo.png"
show: true

meta:
  - name: description
    content: ラズパイに外部からSSHでアクセスするための設定方法をメモ程度にまとめました．
  - name: keywords
    content: ssh ラズパイ raspberry 外部ssh プライベートIP
  - property: og:title
	content: ラズベリーパイを外部からSSHでアクセスする方法

---

# ラズベリーパイを外部からSSHでアクセスする方法

## 目的
ラズパイを外部からSSHでアクセスする

## 方法

1. ラズパイにプライベットネットーワークアドレスを固定する
2. ラズパイ側のポート解放
3. ルータのポート解放&解放したポートのアクセスを全て特定のプライベートIPアドレスに渡す

![An image](./../../image/out-ssh/gazo.png)

## 注意
また有線でルータと接続させています．
ルータはAtermを用いています

## 1.ラズパイにプライベ−トIPアドレスを固定する

1. ラズパイにログイン
2. ```sudo vi /etc/dhcpcd.conf```で編集->一番最後に以下の文章(コメントアウト以外)を追記
3. [ここ](https://qiita.com/MarieKawasuji/items/b088ffb252a92eee8f5d)を参照

```/etc/dhcpcd.conf
...
#無線の場合はwlan0等
interface eth0
#固定したいプライベートIPアドレス
#後々，Atermの場合はポート解放の際，プライベートIPアドレス192.168.10.XXのXXは機種によって，DHCPの自動割り当て範囲外に設定する必要があるため確認してください
#ex)http://www.aterm.jp/support/guide/category/enjoy/port/005/main.html
static ip_address=192.168.10.XX/24
#ゲートウェイ
static routers=192.168.XX.XX
# (ルータの設定ページにて)情報->現在の状態->拡張表示でDNSサーバを取得
static domain_name_servers=192.168.XX.XX

```

3. ```sudo reboot```で再起動


## 2.ラズパイ側のポート解放
今回はufwを用います（iptablesのラッパらしい)

1. ```sudo apt-get ufw ```でインストール
2. ```sudo ufw enable ```でufw起動
3. ```sudo ufw allow ssh ```でssh通信を起動(他のポートの許可の場合```sudo ufw allow <port>```)
4. ```sudo ufw status ```　でポートが解放されているか確認

## 3.ルータのポート解放&解放したポートのアクセスを全て特定のプライベートIPアドレスに渡す
ルータによっては設定の仕方が違うので注意してください

1. ```192.168.10.1```にブラウザでアクセスしルータの設定ページを開く
2. 詳細設定->ポートマッピング設定
3. 先ほど設定したプライベートIPアドレスを指定して，開けるポートを書いて保存
4. [ここ](http://www.cman.jp/network/support/port.html)でポートが空いているか確認


## アクセスしてみる

```ssh pi@(グローバルIP)```

## 最後に
### 問題
- 契約しているブロードバンドが動的にグローバルIPアドレスを割り当てている
	- DDNS設定
	- 定期的に現状のグローバルIPアドレスを通知する	
今回は面倒だったので後者を選択しました．

```
#!/bin/sh
ip_adress=`curl -s ifconfig.me`
curl -X POST -H 'Authorization:Bearer ＜トークン＞' -F "message=$ip_adress" https://notify-api.line.me/api/notify
```
これを```crontab```で定期実行し，Linenotifyに自動通知するようにしました．

## おまけ

sshのポートをデフォルトの22で開けていると変なアクセスが多数来るため，変更しておいた方が良い
[ここ](https://webkaru.net/linux/change-ssh-port/)を参考にしたらできました

## 最後に

初めての事ばかりで戸惑いましたが，なんとかなりました．
セキュリティが最低限もできていないため，これからなんとかします．

slackにログイン履歴を通知するようにしたので，勝手にログインされていれば，すぐサーバ閉じます笑

また，これから
- NextCloud
- vpn(大学のプロキシが面倒臭いため)
やっていきます
