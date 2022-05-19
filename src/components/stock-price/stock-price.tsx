//ES module import
import { Component, h, State, Prop, Watch, Listen } from "@stencil/core";
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
  @State() loading = false;

  //prop (stock symbol now can be set from inside and outside the component)
  //stock symbol here is set from outside the component, through props
  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  //watching prop changes and reacting to those changes
  @Watch("stockSymbol")
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.stockInputValid = true;
      this.fetchStockPrice(newValue);
    }
  }

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
    this.stockSymbol = this.stockInput.value;
    //fetching data -> no need of making here an HTTP Request, it will be made from the watch prop method
    //this.fetchStockPrice(stockSymbol);
  }

  //lifecycle hooks
  componentWillLoad() {
    console.log("Component will load..."); //runs before render method
    console.log(this.stockSymbol); //it gets access to this value right before the component is loaded
    if (this.stockSymbol) {
      this.stockInputValid = true; //enabling form button
      this.stockUserInput = this.stockSymbol; //rendering the initial symbol from props in the input
    }
  }
  componentDidLoad() {
    console.log("Component did load");
    //don't change here states -> it will render again
    //if there is a value inside our props, make an HTTP Request
    if (this.stockSymbol) {
      this.fetchStockPrice(this.stockSymbol);
    }
  }
  componentWillUpdate() {
    console.log("Component will update");
  }
  componentDidUpdate() {
    console.log("Component did update");
    //checking if stock symbol has changed from the initial value and making another HTTP Request
  }
  disconnectedCallback() {
    console.log("Component removed from the DOM");
  }

  //listening custom events from other components
  //adding a target to ensure it's listening globally
  @Listen("ucSymbolSelected", { target: "body" })
  onStockSymbolSelected(event: CustomEvent) {
    console.log("Stock Symbol selected: " + event.detail);
    //checking if there is a new stock symbol and it's not the same as the current one
    if (event.detail && event.detail !== this.stockSymbol) {
      //updating state and triggering a new HTTP Request
      this.stockSymbol = event.detail;
    }
  }

  //fetching data handler
  fetchStockPrice(stockSymbol: string) {
    //loading state: loading
    this.loading = true;
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
        //finished loading
        this.loading = false;
      })
      .catch((err) => {
        this.error = err.message;
        this.fetchedPrice = null; //removing any previous price value and rendering an invalid input message
        //finished loading
        this.loading = false;
      });
  }

  //returns object with metadata about custom element
  //runs each time component is re-evaluated and re-executed
  hostData() {
    return {
      class: this.error ? "error" : "",
    };
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
    if (this.loading) {
      dataContent = (
        <div class="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input
          id="stock-symbol"
          ref={(el) => (this.stockInput = el)}
          value={this.stockUserInput}
          onInput={this.onUserInput.bind(this)}
        />
        <button type="submit" disabled={!this.stockInputValid || this.loading}>
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>,
    ];
  }
}
