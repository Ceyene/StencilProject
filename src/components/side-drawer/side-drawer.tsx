//ES module import
import { Component, h, Prop } from "@stencil/core";

//decorator -> Component -> receives a configuration object
@Component({
  tag: "uc-side-drawer",
  styleUrl: "./side-drawer.css",
  shadow: true, //shadow DOM -> stencil provides polyfills to older browsers
  //scoped: true, //styles scoped only for this component -> doesn't use the shadow DOM for this -> good support for older browsers too
})

//component -> no need of extends here -> done automatically by stencil.js
export class SideDrawer {
  //decorator -> prop -> setting property or listening changes of property
  @Prop() title: string;

  //render method
  render() {
    return (
      <aside>
        <header>
          <h1>{this.title}</h1>
        </header>
        <main>
          <slot />
        </main>
      </aside>
    );
  }
}
