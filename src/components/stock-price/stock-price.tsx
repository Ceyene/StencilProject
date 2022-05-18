//ES module import
import { Component, h, State, Prop } from "@stencil/core";
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
  @State() error: string;

  //prop (stock symbol now can be set from inside and outside the component)
  //stock symbol here is set from outside the component, through props
  @Prop() stockSymbol: string;

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
    //stock symbol here is set from inside the component, using its input value
    const stockSymbol = this.stockInput.value;
    //fetching data -> HTTP Request
    this.fetchStockPrice(stockSymbol);
  }

  //lifecycle hooks
  componentDidLoad() {
    //if there is a value inside our props, make an HTTP Request
    if (this.stockSymbol) {
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  fetchStockPrice(stockSymbol: string) {
    //fetching data -> HTTP Request
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Request failed!");
        }
        return res.json();
      })
      .then((parsedRes) => {
        //checking if our response exists
        if (!parsedRes["Global Quote"]["05. price"]) {
          throw new Error("Invalid symbol requested");
        }
        this.error = null;
        this.fetchedPrice = +parsedRes["Global Quote"]["05. price"];
      })
      .catch((err) => {
        this.error = err.message;
      });
  }

  //rendering component
  render() {
    //rendering response
    let dataContent = <p>Please, enter a symbol</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }
    if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

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
      <div>{dataContent}</div>,
    ];
  }
}
