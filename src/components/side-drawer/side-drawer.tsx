//ES module import
import { Component, h } from "@stencil/core";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-side-drawer",
  styleUrl: "./side-drawer.css",
  shadow: true, //shadow DOM -> stencil provides polyfills to older browsers
  //scoped: true, //styles scoped only for this component -> doesn't use the shadow DOM for this -> good support for older browsers too
})

//component -> no need of extends here -> done automatically by stencil.js
export class SideDrawer {
  //render method
  render() {
    return (
      <aside>
        <h1>The Side Drawer</h1>
      </aside>
    );
  }
}
