# text-embedding-tool
Text embedding tool using zero-width characters

## 使い方
### encode
1. inputに埋め込み先テキストを入れる
2. 埋め込みたいテキストを(())で囲む 例. 重要機密((佐藤さん))書類
3. `ts-node main.ts encode` を実行

### decode
1. inputにencodeで作成したテキストを入れる
2. `ts-node main.ts decode`を実行

## 現状
とりあえず動くところまで<br>
後で整理していく
