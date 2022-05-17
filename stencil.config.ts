import { Config } from "@stencil/core";
import dotenv from "rollup-plugin-dotenv";

export const config: Config = {
  namespace: "mycomponent",
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "www",
      serviceWorker: null,
    },
  ],
  plugins: [dotenv()],
};
