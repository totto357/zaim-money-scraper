chrome.runtime.onMessage.addListener(function () {

  // URLのmonthパラメータにyyyyMMがあるときは使い、ないときは今月を使う
  const yyyyMM = /month=(\d+)$/.test(document.URL)
    ? document.URL.match(/month=(\d+)$/)[1]
    : `${new Date().getFullYear()}${("0" + (new Date().getMonth() + 1)).slice(-2)}`

  // スクレイピング
  const moneys = Array(...document.querySelector("tbody.money-list").rows).map(money => {

    // id
    const url = money.querySelector("td.pencil a").getAttribute("data-url")
    const id = url.match(/\/money\/(\d+)\/edit/)[1]

    // 集計方法
    const calc = money.querySelector("td.calc i").title

    // 日付
    const day = money.querySelector("td.date").textContent.trim().match(/月(\d+)日/)[1]
    const date = yyyyMM + ("0" + day).slice(-2)

    // カテゴリ
    const category = money.querySelector("td.category span").getAttribute("data-title")

    // カテゴリ内訳
    const innerCategory = money.querySelector("td.category a").textContent.trim()

    // 金額
    const price = money.querySelector("td.price").textContent.trim()
    const rawPrice = price.replace(/(¥|,)/g, "")

    // 出金
    const fromAccountEl = money.querySelector("td.from_account img")
    const fromAccount = fromAccountEl && fromAccountEl.getAttribute("data-title")

    // 出金
    const toAccountEl = money.querySelector("td.to_account img")
    const toAccount = toAccountEl && toAccountEl.getAttribute("data-title")

    // お店
    const placeEl = money.querySelector("td.place span")
    // ツールチップ表示後は`title`から`data-original-title`に移動するという謎仕様
    const place = placeEl.getAttribute("data-original-title") || placeEl.getAttribute("title")

    // 品名
    const nameEl = money.querySelector("td.name span")
    const name = nameEl.getAttribute("data-original-title") || nameEl.getAttribute("title")

    // メモ
    const commentEl = money.querySelector("td.comment span")
    const comment = commentEl.getAttribute("data-original-title") || commentEl.getAttribute("title")

    return [
      id,
      calc,
      date,
      category,
      innerCategory,
      rawPrice,
      fromAccount,
      toAccount,
      place,
      name,
      comment
    ].join(",")

  })

  // ヘッダを先頭に追加
  moneys.unshift(["ID", "集計", "日付", "カテゴリ", "カテゴリ内訳", "金額", "出金", "入金", "お店", "品名", "メモ"].join(","))

  // 出力するcsv文字列
  const csv = moneys.join("\n")
  console.log(csv)

  //選択中文字列をクリップボードに入れる
  const textArea = document.createElement("textarea")
  document.body.appendChild(textArea)
  textArea.value = csv
  textArea.select()
  document.execCommand("copy")
  document.body.removeChild(textArea)

  // 画面左下に通知を表示
  const notification = document.createElement("div")
  notification.textContent = `${yyyyMM}のCSVをクリップボードにコピーしました。`
  notification.style = `
    position: fixed;
    left: 0;
    border: 0;
    bottom: 0;
    padding: 16px;
    margin: 40px;
    background: #333;
    color: #fff;
    border-radius: 8px;
  }`
  document.body.appendChild(notification)

  // 通知を3秒後に消す
  setTimeout((el) => {
    document.body.removeChild(el)
  }, 3000, notification)

})