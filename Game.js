class Game {
  constructor(start) {
    this.stats = new Statistics();
    this.wallet = new Wallet(start);

    document
      .getElementById("start")
      .addEventListener("click", this.startGame.bind(this));
    this.spanWallet = document.querySelector(".panel span.wallet");
    this.boards = [...document.querySelectorAll("div.color")];
    this.inputBid = document.getElementById("bid");
    this.spanResult = document.querySelector(".score span.result");
    this.spanGames = document.querySelector(".score span.number");
    this.spanWins = document.querySelector(".score span.win");
    this.spanLosses = document.querySelector(".score span.loss");

    this.render();
  }

  render(
    colors = ["#2ee", "#2ee", "#2ee"],
    money = this.wallet.getWalletValue(),
    result = "",
    gamesStatistics = [0, 0, 0],
    bid = 0,
    wonMoney = 0
  ) {
    // console.log("gramy!!");

    this.boards.forEach((board, i) => {
      board.style.backgroundColor = colors[i];
    });

    this.spanWallet.textContent = money;
    if (result) {
      result = `Wygrałeś ${wonMoney}$. `;
    } else if (!result && result !== "") {
      result = `Przegrałeś ${bid}$. `;
    }
    this.spanResult.textContent = result;
    this.spanGames.textContent = gamesStatistics[0];
    this.spanWins.textContent = gamesStatistics[1];
    this.spanLosses.textContent = gamesStatistics[2];

    this.inputBid.value = "";
  }

  startGame() {
    if (this.inputBid.value < 1)
      return alert("Kwota, którą chcesz grać jest za mała!");
    const bid = Math.floor(this.inputBid.value);

    if (!this.wallet.checkCanPlay(bid)) {
      return alert(
        "masz za mało środków lub podana została nieprawidłowa wartość"
      );
    }

    this.wallet.changeWallet(bid, "-");

    this.draw = new Draw();
    const colors = this.draw.getDrawResult();
    const win = Result.checkWinner(colors); // return true lub false
    const wonMoney = Result.moneyWinInGame(win, bid); // za win podstawiamy true lub false i stawka zakladu
    this.wallet.changeWallet(wonMoney); // za wonMoney podstawiamy 0 gdy przegramy (wonMoney return false) lub 3*bid gdy wygramy (wonMoney return true)
    this.stats.addGameToStatistics(win, bid);

    this.render(
      colors,
      this.wallet.getWalletValue(),
      win,
      this.stats.showGameStatistics(),
      bid,
      wonMoney
    );
  }
}
