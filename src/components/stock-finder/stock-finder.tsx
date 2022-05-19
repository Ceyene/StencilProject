//ES module import
import { Component, h, State } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-stock-finder",
  styleUrl: "./stock-finder.css",
  shadow: true,
})

//component -> no need of extends here -> done automatically by stencil.js
export class StockFinder {
  //property for input ref
  stockNameInput: HTMLInputElement;
  //decorator -> state
  @State() error: string;

  //form handler
  onFindStocks(event: Event) {
    event.preventDefault();
    //taking value from DOM element with ref
    const stockName = this.stockNameInput.value;
    //searching coincidences with characters from user input
    fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Request failed!");
        }
        return res.json();
      })
      .then((parsedRes) => {
        //checking if our response exists
        if (!parsedRes) {
          throw new Error("Invalid stock requested");
        }
        this.error = null;
        console.log(parsedRes);
      })
      .catch((err) => {
        this.error = err.message;
      });
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" ref={(el) => (this.stockNameInput = el)} />
        <button type="submit">Find Stock Symbol!</button>
      </form>,
    ];
  }
}