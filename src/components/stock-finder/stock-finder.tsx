//ES module import
import { Component, h, State, Event, EventEmitter } from "@stencil/core";
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
  @State() searchResults: { symbol: string; name: string }[] = []; //assigning an empty array to avoid an error when trying to run map on undefined
  @State() error: string;
  @State() loading = false;
  //decorator -> event -> creating custom event of EventEmitter generic type
  @Event({ bubbles: true, composed: true })
  ucSymbolSelected: EventEmitter<string>;

  //form handler
  onFindStocks(event: Event) {
    event.preventDefault();
    //start loading
    this.loading = true;
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
        //finished loading
        this.loading = false;
        //checking if our response exists
        if (!parsedRes) {
          throw new Error("Invalid stock requested");
        }
        this.error = null;
        this.searchResults = parsedRes["bestMatches"].map((match) => {
          return { name: match["2. name"], symbol: match["1. symbol"] };
        });
      })
      .catch((err) => {
        this.error = err.message;
      });
  }
  //emitting custom events when clicking on item from search results
  onSelectSymbol(symbol: string) {
    this.ucSymbolSelected.emit(symbol);
  }

  render() {
    //rendering content conditionally
    let content = (
      <ul>
        {this.searchResults.map((result) => (
          <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
            <strong>{result.symbol}</strong> - {result.name}
          </li>
        ))}
      </ul>
    );
    if (this.loading) {
      content = <uc-spinner />;
    }
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" ref={(el) => (this.stockNameInput = el)} />
        <button type="submit">Find Stock Symbol!</button>
      </form>,
      content,
    ];
  }
}
