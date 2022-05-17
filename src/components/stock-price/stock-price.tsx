//ES module import
import { Component, h } from "@stencil/core";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-stock-price",
  styleUrl: "./stock-price.css",
  shadow: true,
})

//component -> no need of extends here -> done automatically by stencil.js
export class StockPrice {
  //handler
  onFetchStockPrice(event: Event) {
    event.preventDefault();
    //fetching data -> HTTP Request
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo${process.env.API_KEY}`
    )
      .then((res) => {
        return res.json();
      })
      .then((parsedRes) => {
        console.log(parsedRes);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //rendering component
  render() {
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol" />
        <button>Fetch</button>
      </form>,
      <div>
        <p>Price: {0}</p>
      </div>,
    ];
  }
}
