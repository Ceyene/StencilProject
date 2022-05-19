//ES module import
import { Component, h } from "@stencil/core";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-spinner",
  styleUrl: "./spinner.css",
  shadow: true,
})

//component -> no need of extends here -> done automatically by stencil.js
export class Spinner {
  render() {
    return (
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
}
