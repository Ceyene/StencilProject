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
  //decorator -> prop -> setting property or listening changes of property (props are inmmutable from inside the component)
  //reflecting prop values to their respective attributes
  @Prop({ reflect: true }) title: string;
  //mutable prop
  @Prop({ reflect: true, mutable: true }) open: boolean;

  //handlers
  onCloseDrawer() {
    this.open = false; //mutating prop
    console.log("Closing side drawer...");
  }
  onContentChange(content: string) {}

  //render method
  render() {
    //content to be rendered with an event listener on tabs
    let mainContent = <slot />;
    mainContent = (
      <div>
        <h2>Contact Information</h2>
        <p>You can reach us via phone or email</p>
        <ul>
          <li>Phone: 54911111111</li>
          <li>
            E-mail: <a href="mailto:email@email.com">email@email.com</a>
          </li>
        </ul>
      </div>
    );

    return (
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.onCloseDrawer.bind(this)}> X </button>
        </header>
        <section class="tabs">
          <button
            class="active"
            onClick={this.onContentChange.bind(this, "nav")}
          >
            Navigation
          </button>
          <button onClick={this.onContentChange.bind(this, "contact")}>
            Contact
          </button>
        </section>
        <main>{mainContent}</main>
      </aside>
    );
  }
}
