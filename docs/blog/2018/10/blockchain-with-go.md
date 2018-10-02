---
title: Go言語でBlockchainを作ってみた 
description: Go言語でBlockchainの基本の機能を実装しました
link: 2018/10/blockchain-with-go
date: 2018-10-02
img: "blockchain-with-go/logo.png"
show: true
meta:
  - name: description
    content: Go言語でBlockchainを作ってみた
  - name: keywords
    content: GO Blockchain
  - property: og:title
    content: Go言語でBlockchainを作ってみた
  - property: og:description
    content: Go言語でBlockchainの基本の機能を実装しました．
---
# blockchainをGoで実装してみた

## はじめに
[この記事](https://hackernoon.com/learn-blockchains-by-building-one-117428612f46)がPythonで書かれている為，この記事を参考にしながらGo言語で実装しました

## 実装機能
- Proof Of Work
- コイン量計算
- 他のノードとつなぐ
- 他のノードとチェーンを比較する
- マイニング
- トランザクション追加

## Blockchainの構造
```go
type Blockchain struct {
	Chain              []Block 
	CurrentTransactions []Transaction
	Nodes              []string
}
type Block struct {
	Index        int
	Timestamp    int64
	Transactions  []Transaction
	Proof        int
	PreviousHash string
}

type Transaction struct {
	Sender    string
	Recipient string
	Amount    int
}
```

## Blockchainの機能全コード
```go
package blockchain

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/http"
	"time"
	"strconv"
	"strings"
)

type FullChain struct {
	Chain  []Block `json:"chain"`
	Length int     ` json:"length"`
}

type Blockchain struct {
	Chain              []Block 
	CurrentTransactions []Transaction
	Nodes              []string
}
type Block struct {
	Index        int
	Timestamp    int64
	Transactions  []Transaction
	Proof        int
	PreviousHash string
}

type Transaction struct {
	Sender    string
	Recipient string
	Amount    int
}

var WORKLEVEL = 4

func Init()*Blockchain{
	bc := new(Blockchain)
	bc.NewBlock(100, "1")
	return bc
}

func (bc *Blockchain) NewBlock(proof int, previousHash ...string) Block {
	var pg string
	if len(previousHash) != 0 {
		pg = previousHash[0]
	} else {
		pg = bc.Hash(bc.Chain[len(bc.Chain)-1])
	}
	block := Block{
		Index:        (len(bc.Chain) + 1),
		Timestamp:    time.Now().Unix(),
		Transactions:  bc.CurrentTransactions,
		Proof:        proof,
		PreviousHash: pg,
	}
	bc.CurrentTransactions = []Transaction{}
	bc.Chain = append(bc.Chain, block)
	return block
}

func (bc Blockchain) LastBlock() Block {
	return bc.Chain[len(bc.Chain)-1]
}

func (bc *Blockchain) NewTransaction(sender, recipient string, amount int) int {
	if (bc.GetAmount(sender)-amount)<0 && sender != "0"/*minus amount  &&!genesis*/{
		return 0
	}
	bc.CurrentTransactions = append(bc.CurrentTransactions,Transaction{
		Sender:    sender,
		Recipient: recipient,
		Amount:    amount,
	})
	return bc.LastBlock().Index + 1
}

func (bc *Blockchain) Hash(block Block) string {
	blockString, err := json.Marshal(block)
	if err != nil {
		panic(err)
	}
	hashData := sha256.Sum256([]byte(blockString))
	return hex.EncodeToString(hashData[:])
}

func (bc *Blockchain) RegisterNode(address string) error {
	res, err := http.Get(address + "/chain")
	if err != nil || res.StatusCode != http.StatusOK {
		return err
	}
	for _, v := range bc.Nodes {
		if v == address {
			return errors.New("すでに登録されています")
		}
	}
	bc.Nodes = append(bc.Nodes, address)
	return nil
}

unc ValidProof(lastProof, proof int, level int) bool {
	guess := []byte(strconv.Itoa(lastProof) + strconv.Itoa(proof))
	hashData := sha256.Sum256(guess)
	guessHash := hex.EncodeToString(hashData[:])
	return guessHash[:level] == strings.Repeat("0", level)
}

func (bc *Blockchain) ValidChain(chain []Block) bool {
	lastBlock := chain[0]
	currentIndex := 1
	for currentIndex < len(chain) {
		block := chain[currentIndex]
		if block.PreviousHash != bc.Hash(lastBlock) {
			return false
		}
		if !ValidProof(lastBlock.Proof, block.Proof, WORKLEVEL) {
			guess := []byte(strconv.Itoa(lastBlock.Proof) + strconv.Itoa(block.Proof))
			hashData := sha256.Sum256(guess)
			guessHash := hex.EncodeToString(hashData[:])
			log.Println(guessHash)
			log.Println(lastBlock.Proof)
			log.Println(block.Proof)
			return false
		}
		lastBlock = block
		currentIndex++
	}
	return true
}

func (bc Blockchain) ProofOfWork(lastProof, level int) int {
	proof := 0
	for !ValidProof(lastProof, proof, level) {
		proof++
	}
	return proof
}

func (bc *Blockchain) ResolveConflicts() bool {
	neighbours := bc.Nodes
	newChain := []Block{}

	maxLength := len(bc.Chain)
	for _, node := range neighbours {
		res, err := http.Get(node + "/chain")
		if err != nil {
			log.Println(err.Error())
			continue
		}
		if res.StatusCode != http.StatusOK {
			log.Println(err.Error())
			continue
		}
		var fullChain FullChain
		if err := json.NewDecoder(res.Body).Decode(&fullChain); err != nil {
			log.Println(err.Error())
			continue
		}
		log.Println(fullChain.Length,":",maxLength,":",bc.ValidChain(fullChain.Chain))
		if fullChain.Length > maxLength && bc.ValidChain(fullChain.Chain) {
			maxLength = fullChain.Length
			newChain = fullChain.Chain
		}
	}
	if len(newChain) != 0 {
		bc.Chain = newChain
		return true
	}
	return false
}

func (bc *Blockchain)GetAmount(nodeIdent string)int{
	amount := 0
	for _,v := range bc.Chain{
		for _,t := range v.Transactions{
			if t.Sender == nodeIdent{
				amount -= t.Amount
			}
			if t.Recipient == nodeIdent{
				amount += t.Amount
			}
		}
	}
	return amount
}

```

## さいごに

このブロックチェーンの機能にhttp通信でかつJson形式で利用てきるよう実装しているので
[このレポジトリ](https://github.com/ryomak/blockchain-with-go/blob/master/controller/controller.go)を参照してください