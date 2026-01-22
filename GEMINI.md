# Project Overview

This project is a single-page web application designed to display a curated collection of JavaScript bookmarklets. The page is styled with a dark, "Arch Linux" inspired theme. It allows users to easily view, copy, and use the bookmarklets.

## Key Files

-   **`index.html`**: The main file containing the entire application. It includes the HTML structure, CSS for styling, and JavaScript for dynamic rendering and functionality.
-   **`README.md`**: Provides a brief overview of the project's purpose.
-   **`bookmarks_1_21_26.html` / `bk.md`**: These files serve as the data source for the bookmarklets displayed on the page.

## Building and Running

This is a static web project. No build process is required. To run the application, simply open the `index.html` file in a web browser.

## Development Conventions

-   All application logic is contained within the `index.html` file.
-   Bookmarklet data is stored in a JavaScript array of objects called `bookmarkletsData` within the `<script>` tag of `index.html`. Each object has `name`, `description`, and `code` properties.
-   The page is rendered dynamically using JavaScript. The `renderBookmarklets` function creates the HTML for each bookmarklet and injects it into the DOM.
-   The application includes a search feature to filter bookmarklets by name or description.
-   Styling is done via a `<style>` block in the `<head>` of the HTML document.
