//ES module import
import { Component, h, State } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-stock-price",
  styleUrl: "./stock-price.css",
  shadow: true,
})

//component -> no need of extends here -> done automatically by stencil.js
export class StockPrice {
  //accessing DOM element without decorators, only with a normal property ->
  stockInput: HTMLInputElement;
  //decorator -> state
  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;

  //input handler (two way binding)
  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    //input validation (when not empty = valid)
    if (this.stockUserInput.trim() !== "") {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }
  //fetching data handler
  onFetchStockPrice(event: Event) {
    event.preventDefault();
    //accessing the DOM element's value through reference
    const stockSymbol = this.stockInput.value;
    //fetching data -> HTTP Request
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
    )
      .then((res) => {
        return res.json();
      })
      .then((parsedRes) => {
        this.fetchedPrice = +parsedRes["Global Quote"]["05. price"];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //rendering component
  render() {
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input
          id="stock-symbol"
          ref={(el) => (this.stockInput = el)}
          value={this.stockUserInput}
          onInput={this.onUserInput.bind(this)}
        />
        <button type="submit" disabled={!this.stockInputValid}>
          Fetch
        </button>
      </form>,
      <div>
        <p>Price: ${this.fetchedPrice}</p>
      </div>,
    ];
  }
}
