chrome.runtime.onMessage.addListener(function () {

  const moneyList = document.querySelector("tbody.money-list")
  const yyyyMM = document.URL.match(/month=(\d+)$/)[1]

  const moneys = Array(...moneyList.rows).map(money => {
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
  moneys.unshift(["ID", "集計", "日付", "カテゴリ", "カテゴリ内訳", "金額", "出金", "入金", "お店", "品名", "メモ"])

  const str = moneys.join("\n")

  //選択中文字列をクリップボードに入れる
  const textArea = document.createElement("textarea")
  document.body.appendChild(textArea)
  textArea.value = str
  textArea.select()
  document.execCommand("copy")
  document.body.removeChild(textArea)

  // ログ出力
  console.log(str)

})