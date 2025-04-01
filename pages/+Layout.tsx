import { ThemeContextProvider } from "@/contexts/theme";
import "@/styles/app.css";

import getTitle from "@/utils/get-title";
import { createSignal, type FlowProps } from "solid-js";
import { useMetadata } from "vike-metadata-solid";

useMetadata.setGlobalDefaults({
  title: getTitle("Home"),
  description: "Stuff",
});

export default function RootLayout(props: FlowProps) {
  return (
    <>
      <ThemeContextProvider>{props.children}</ThemeContextProvider>
    </>
  );
}
