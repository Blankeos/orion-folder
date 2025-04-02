import { createSignal, onMount } from "solid-js";
import { useMetadata } from "vike-metadata-solid";
import { useDocumentTitle } from "bagon-hooks";
import { useThemeContext } from "@/contexts/theme";
import { usePageContext } from "vike-solid/usePageContext";
import { isServer } from "solid-js/web";

function serializeTitle(title: string): string {
  // Replace spaces with hyphens and convert to lowercase for URL-friendliness
  return encodeURIComponent(title);
}

const FAVICON = "/favicon.ico";
// const FAVICON =
//   "https://raw.githubusercontent.com/FadeMind/W-ICO/refs/heads/master/ICO/Apps%20(Windows%2011)/Adobe/Disk/Premiere%20Pro.ico";

export function Page() {
  const { urlParsed } = usePageContext();

  function getInitTitle() {
    let initialTitle = (urlParsed.search?.title as string) || "New Folder";
    try {
      // Decode the URL component twice to handle double encoding
      initialTitle = decodeURIComponent(decodeURIComponent(initialTitle));
    } catch (e) {
      console.error("Error decoding initial title:", e);
      // If decoding fails, leave the title as is or provide a default
      initialTitle = "New Folder";
    }
    return initialTitle;
  }
  const initialTitle = getInitTitle();

  const [title, setTitle] = createSignal(initialTitle);
  useDocumentTitle(title);

  // const [favicon, setFavicon] = createSignal(FAVICON);
  // useFavicon(favicon);

  useMetadata({
    // eslint-disable-next-line solid/reactivity
    title: title(),
    otherJSX: () => (
      <>
        <link rel="icon" href={FAVICON} type="image/svg+xml" />
        {/* <link
          rel="icon"
          href="https://raw.githubusercontent.com/FadeMind/W-ICO/refs/heads/master/ICO/Apps%20(Windows%2011)/Adobe/Disk/Premiere%20Pro.ico"
        />
        <link
          rel="mask-icon"
          href="https://raw.githubusercontent.com/FadeMind/W-ICO/refs/heads/master/ICO/Apps%20(Windows%2011)/Adobe/Disk/Premiere%20Pro.ico"
        /> */}
      </>
    ),
  });

  let inputRef!: HTMLInputElement;
  onMount(() => {
    // Set initial title in the input field after hydration
    const clientSideInitialTitle = getInitTitle();
    setTitle(clientSideInitialTitle);
    inputRef.value = clientSideInitialTitle;
  });

  const handleInput = (e: Event) => {
    const newTitle = (e.target as HTMLInputElement).value;
    setTitle(newTitle);
    window.document.title = newTitle; // Update title in Window.
    const newSlug = serializeTitle(newTitle);
    const url = new URL(window.location.href);
    url.searchParams.set("title", newSlug);
    window.history.replaceState(null, newTitle, url.toString());
  };

  const { theme, setTheme } = useThemeContext();

  return (
    <div
      class={`flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white bg-purple-50 text-gray-900`}
    >
      <div class="flex flex-col items-center gap-y-6">
        <div class="text-5xl font-extrabold">🗂️ Orion Folder</div>
        <div class="text-lg opacity-50">Quick and easy folders for the Orion Browser</div>
        <input
          ref={inputRef}
          type="text"
          value={title()}
          onInput={handleInput}
          placeholder="New Tab"
          class={`px-4 py-2 text-lg border rounded-lg w-96 text-center outline-none shadow-sm focus:ring focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-purple-400 dark:focus:ring-purple-200 border-gray-300 bg-white focus:border-purple-400 focus:ring-purple-200`}
        />
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme() === "light"}
              onChange={() => setTheme("light")}
              class="form-radio h-5 w-5 text-purple-500 focus:ring-purple-500"
            />
            <span>Light</span>
          </label>
          <label class="flex items-center gap-x-2">
            <input
              autofocus
              type="radio"
              name="theme"
              value="dark"
              checked={theme() === "dark"}
              onChange={() => setTheme("dark")}
              class="form-radio h-5 w-5 text-purple-500 focus:ring-purple-500"
            />
            <span>Dark</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={theme() === "system"}
              onChange={() => setTheme("system")}
              class="form-radio h-5 w-5 text-purple-500 focus:ring-purple-500"
            />
            <span>System</span>
          </label>
        </div>
      </div>
    </div>
  );
}
