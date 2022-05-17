//ES module import
import { Component, h } from "@stencil/core";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-side-drawer",
})

//component -> no need of extends here -> done automatically by stencil.js
export class SideDrawer {
  //render method
  render() {
    return (
      <div>
        <h1>The Side Drawer</h1>
      </div>
    );
  }
}
