import { Config } from "@stencil/core";
import dotenv from "rollup-plugin-dotenv";

export const config: Config = {
  namespace: "StockFinder",
  outputTargets: [
    {
      type: "dist",
    },
    // {
    //   type: "www",
    //   serviceWorker: null,
    // },
  ],
  plugins: [dotenv()],
};
