// =====================================================================
// DOM Assignment - script.js (Sections A to E)
// Student: Lorenzo, Mhel Pablo | 22-UR-1115T | BSIT 3rd Year
// The starter HTML (index.html) is NOT edited. Everything is done here.
// =====================================================================
"use strict";

// ---------------------------------------------------------------------
// CSS for the things I add with JavaScript. The HTML file must not be
// edited, so I create a <style> block from here (B.3 task 2 and 4).
// ---------------------------------------------------------------------
const styleBlock = document.createElement("style");
styleBlock.id = "practice-styles";
styleBlock.textContent = `
  :root { --main-color: #1F3A5F; }
  body { font-family: Arial, sans-serif; margin: 0; padding: 0 24px 40px; background: #ffffff; color: #222; }
  header.top { padding: 12px 0; border-bottom: 3px solid var(--main-color); }
  h1, h2 { color: var(--main-color); }
  #menu { list-style: none; display: flex; gap: 8px; padding: 0; }
  .menu-item a { display: block; padding: 6px 14px; border-radius: 6px; text-decoration: none; color: var(--main-color); border: 1px solid var(--main-color); }
  .menu-item.active a { background: var(--main-color); color: #fff; }
  .toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
  button { cursor: pointer; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--main-color); background: var(--main-color); color: #fff; }
  button:disabled { opacity: 0.45; cursor: not-allowed; }
  [hidden] { display: none !important; }
  .card { color: #222; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
  .card h3 { margin: 0 0 4px; }
  .card p { margin: 0 0 8px; font-weight: bold; }
  /* Inline styles (B.3 task 1) beat class rules for the same property, so
     .active-card only uses properties that are not set inline. */
  .active-card { outline: 3px solid var(--main-color); box-shadow: 0 4px 12px rgba(0,0,0,0.3); transform: scale(1.02); }
  .delete-btn { background: #c62828; border-color: #c62828; }
  .note { font-style: italic; color: #555; }
  .sibling-highlight { outline: 2px dashed orange; }
  #add-product { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
  #add-product input, #signup input { padding: 6px; }
  #signup { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
  #number-list { max-height: 120px; overflow-y: auto; border: 1px solid #ccc; padding-left: 36px; }
  body.dark { background: #121826; color: #e8e8e8; }
  body.dark h1, body.dark h2 { color: #8ab4f8; }
  body.dark .note { color: #bbb; }
  body.dark .menu-item a { color: #8ab4f8; border-color: #8ab4f8; }
  body.dark .menu-item.active a { background: var(--main-color); color: #fff; border-color: var(--main-color); }
  body.dark header.top { border-bottom-color: #8ab4f8; }
`;
document.head.append(styleBlock);

// Small helper used by several sections to make buttons
function makeButton(text, id) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = id;
  btn.textContent = text;
  return btn;
}

// A toolbar for the buttons I need (Dark Mode, Show/Hide Products, etc.)
const toolbar = document.createElement("div");
toolbar.className = "toolbar";
document.getElementById("site-header").append(toolbar);

// =====================================================================
// SECTION A - Selecting DOM Elements
// =====================================================================
console.group("SECTION A - Selecting");

// A.3 Task 1: select the h1 with three different methods and compare
const titleById = document.getElementById("main-title");
const titleByQuery = document.querySelector("#main-title");
const titleByTag = document.getElementsByTagName("h1")[0];
console.log("A1 same element (id vs querySelector):", titleById === titleByQuery);
console.log("A1 same element (id vs tag name):", titleById === titleByTag);
console.log("A1 all three the same:", titleById === titleByQuery && titleByQuery === titleByTag);

// A.3 Task 2: loop over every card and print name and price
const allCards = document.querySelectorAll(".card"); // static NodeList
allCards.forEach((card) => {
  const name = card.querySelector("h3").textContent;
  const price = card.querySelector("p.price").textContent;
  console.log(`A2 card -> name: ${name}, price: ${price}`);
});

// A.3 Task 3: HTMLCollection -> real array -> map()
const linkCollection = document.getElementsByTagName("a"); // live HTMLCollection
const linkArray = Array.from(linkCollection);
// getAttribute gives the href as written in the HTML (link.href gives the full URL)
const hrefs = linkArray.map((link) => link.getAttribute("href"));
console.log("A3 hrefs:", hrefs);

// A.3 Task 4: cards whose data-id is greater than 1
// A NodeList has no filter(), so I convert it to an array first.
const bigIdCards = Array.from(document.querySelectorAll(".card")).filter(
  (card) => Number(card.dataset.id) > 1
);
console.log("A4 cards with data-id > 1:", bigIdCards.map((c) => c.querySelector("h3").textContent));

// A.3 Task 5: safeSelect
function safeSelect(selector) {
  try {
    const element = document.querySelector(selector);
    if (element === null) {
      console.warn(`safeSelect: nothing matches "${selector}". Check the spelling of the id/class.`);
      return null;
    }
    return element;
  } catch (error) {
    // an invalid selector such as "##x" throws a SyntaxError
    console.warn(`safeSelect: "${selector}" is not a valid selector (${error.message}).`);
    return null;
  }
}
console.log("A5 found:", safeSelect("#products"));
console.log("A5 not found:", safeSelect("#footer"));
console.log("A5 invalid:", safeSelect("##bad"));
console.groupEnd();

// =====================================================================
// SECTION B - Styling DOM Elements
// =====================================================================
console.group("SECTION B - Styling");

// B.3 Task 1: border, padding, rounded corners, light background (style property)
function styleCard(card) {
  card.style.border = "2px solid #1F3A5F";
  card.style.padding = "12px";
  card.style.borderRadius = "10px";
  card.style.backgroundColor = "#eef3fa";
  card.style.margin = "10px 0";
}
document.querySelectorAll(".card").forEach(styleCard);

// B.3 Task 2: clicking a card makes it the only active card.
// One listener on the section (event delegation) so cards added later work too.
const productsSection = document.getElementById("products");
productsSection.addEventListener("click", (event) => {
  const clicked = event.target.closest(".card");
  if (!clicked) return; // click was not on a card (e.g. the heading)
  document.querySelectorAll(".card").forEach((card) => {
    // toggle(name, force): adds for the clicked card, removes for all others
    card.classList.toggle("active-card", card === clicked);
  });
});

// B.3 Task 3: price below $400 = green, otherwise red
function colourPrice(card) {
  const priceElement = card.querySelector(".price");
  const amount = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ""));
  priceElement.style.color = amount < 400 ? "#1a7f37" : "#c62828";
}
document.querySelectorAll(".card").forEach(colourPrice);

// B.3 Task 4: Dark Mode button toggles .dark on <body>
const darkBtn = makeButton("Dark Mode", "dark-btn");
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
toolbar.append(darkBtn);

// B.3 Task 5: change the CSS variable --main-color with setProperty()
document.documentElement.style.setProperty("--main-color", "#1F3A5F");
const colours = ["#1F3A5F", "#6a1b9a", "#00695c", "#bf360c"];
let colourIndex = 0;
const colourBtn = makeButton("Change Theme Colour", "colour-btn");
colourBtn.addEventListener("click", () => {
  colourIndex = (colourIndex + 1) % colours.length;
  document.documentElement.style.setProperty("--main-color", colours[colourIndex]);
  console.log("B5 --main-color is now",
    document.documentElement.style.getPropertyValue("--main-color"));
});
toolbar.append(colourBtn);

// B.3 Task 6: getComputedStyle
// I use getComputedStyle because h1.style only shows inline styles (empty here).
// getComputedStyle gives the final value after the browser applied every
// stylesheet, default styles and inheritance.
const h1Computed = getComputedStyle(titleById);
console.log("B6 h1 font-size:", h1Computed.fontSize, "| display:", h1Computed.display);
console.log("B6 h1.style.fontSize (inline only):", JSON.stringify(titleById.style.fontSize));
console.groupEnd();

// =====================================================================
// SECTION C - Setting and Removing DOM Attributes
// =====================================================================
console.group("SECTION C - Attributes");

// C.3 Task 1: title attribute for every menu link
document.querySelectorAll("#menu a").forEach((link) => {
  link.setAttribute("title", `Go to ${link.textContent}`);
});
console.log("C1 titles:", Array.from(document.querySelectorAll("#menu a")).map((a) => a.title));

// C.3 Task 2: Register disabled on load, enabled only when both inputs have text
const signupForm = document.getElementById("signup");
const usernameInput = signupForm.querySelector("input[name='username']");
const emailInput = signupForm.querySelector("input[name='email']");
const submitBtn = document.getElementById("submit-btn");

function updateRegisterButton() {
  const bothFilled = usernameInput.value.trim() !== "" && emailInput.value.trim() !== "";
  if (bothFilled) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "");
  }
}
updateRegisterButton(); // disabled on page load
signupForm.addEventListener("input", updateRegisterButton);
signupForm.addEventListener("submit", (event) => {
  event.preventDefault(); // no page reload, this is only practice
  console.log("C2 form submitted:", usernameInput.value, emailInput.value);
});

// C.3 Task 3: required + minlength on username, and a new password input
usernameInput.setAttribute("required", "");
usernameInput.setAttribute("minlength", "3");
const passwordInput = document.createElement("input");
passwordInput.setAttribute("type", "password");
passwordInput.setAttribute("name", "password");
passwordInput.setAttribute("placeholder", "Password");
emailInput.after(passwordInput); // sits between email and the button

// C.3 Task 4: id attribute from data-id (card-1, card-2, ...)
document.querySelectorAll(".card").forEach((card) => {
  card.setAttribute("id", `card-${card.dataset.id}`);
});
console.log("C4 ids:", Array.from(document.querySelectorAll(".card")).map((c) => c.id));

// C.3 Task 5: Show/Hide Products with toggleAttribute("hidden")
const toggleProductsBtn = makeButton("Show/Hide Products", "toggle-products-btn");
toggleProductsBtn.addEventListener("click", () => {
  const nowHidden = productsSection.toggleAttribute("hidden");
  console.log("C5 products hidden:", nowHidden);
});
toolbar.append(toggleProductsBtn);

// C.3 Task 6: remove every data-* attribute from an element
function removeAllDataAttributes(element) {
  // Array.from makes a copy, so removing while looping is safe
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name.startsWith("data-")) {
      element.removeAttribute(attr.name);
    }
  });
}
// demo on a clone so the real cards keep their data-id
const demoCard = document.querySelector(".card").cloneNode(true);
console.log("C6 before:", demoCard.getAttributeNames());
removeAllDataAttributes(demoCard);
console.log("C6 after:", demoCard.getAttributeNames());
console.groupEnd();

// =====================================================================
// SECTION D - Manipulating DOM Elements
// =====================================================================
console.group("SECTION D - Manipulating");

// Helper: Delete button inside a card
function addDeleteButton(card) {
  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-btn";
  del.textContent = "Delete";
  card.append(del);
}

// D.3 Task 1: new card "Headphones", $150, data-id 4 (built by hand)
const headphones = document.createElement("div");
headphones.className = "card";
headphones.dataset.id = "4";
const hpName = document.createElement("h3");
hpName.textContent = "Headphones";
const hpPrice = document.createElement("p");
hpPrice.className = "price";
hpPrice.textContent = "$150";
headphones.append(hpName, hpPrice);
headphones.setAttribute("id", "card-4");
styleCard(headphones);
colourPrice(headphones);
productsSection.append(headphones);

// D.3 Task 2: Add Product feature with createCard(name, price)
let nextCardId = 5; // 1-4 already used
function createCard(name, price) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = String(nextCardId);
  card.setAttribute("id", `card-${nextCardId}`);
  nextCardId++;
  const title = document.createElement("h3");
  title.textContent = name; // textContent, so user input can't inject HTML
  const priceTag = document.createElement("p");
  priceTag.className = "price";
  priceTag.textContent = `$${Number(price)}`;
  card.append(title, priceTag);
  styleCard(card);
  colourPrice(card);
  addDeleteButton(card);
  return card;
}

const addBox = document.createElement("div");
addBox.id = "add-product";
const nameField = document.createElement("input");
nameField.type = "text";
nameField.placeholder = "Product name";
const priceField = document.createElement("input");
priceField.type = "number";
priceField.min = "0";
priceField.placeholder = "Price";
const addProductBtn = makeButton("Add Product", "add-product-btn");
const addMessage = document.createElement("span");
addBox.append(nameField, priceField, addProductBtn, addMessage);
productsSection.after(addBox);

addProductBtn.addEventListener("click", () => {
  const name = nameField.value.trim();
  const price = parseFloat(priceField.value);
  if (name === "" || Number.isNaN(price) || price < 0) {
    addMessage.textContent = "Enter a name and a valid price.";
    addMessage.style.color = "#c62828";
    return;
  }
  productsSection.append(createCard(name, price));
  addMessage.textContent = `Added ${name}.`;
  addMessage.style.color = "#1a7f37";
  nameField.value = "";
  priceField.value = "";
  nameField.focus();
});

// D.3 Task 3: Delete button in every card, using event delegation
document.querySelectorAll(".card").forEach(addDeleteButton);
productsSection.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return;
  deleteBtn.closest(".card").remove();
});

// D.3 Task 4: change first link text, replace the second menu item
const menu = document.getElementById("menu");
const firstLink = menu.querySelector("a");
firstLink.textContent = "Start";
firstLink.setAttribute("title", "Go to Start"); // keep the tooltip matching
const newItem = document.createElement("li");
newItem.className = "menu-item active"; // the old second item was the active one
const newLink = document.createElement("a");
newLink.href = "#services";
newLink.textContent = "Services";
newLink.setAttribute("title", "Go to Services");
newItem.append(newLink);
menu.children[1].replaceWith(newItem);

// D.3 Task 5: insertAdjacentHTML right after the products heading
// "afterend" = after the closing tag of the <h2>, so the <p> becomes its next sibling.
// (Safe to use innerHTML-style insertion here: the text is fixed, not user input.)
productsSection.querySelector("h2").insertAdjacentHTML(
  "afterend",
  '<p class="note">Click a card to select it.</p>'
);

// D.3 Task 6: 100 numbered <li> with a DocumentFragment, appended once
const numberHeading = document.createElement("h2");
numberHeading.textContent = "100 Numbered Items";
const numberList = document.createElement("ol");
numberList.id = "number-list";
const fragment = document.createDocumentFragment();
for (let i = 1; i <= 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.append(li);
}
numberList.append(fragment); // one single insertion into the list
document.querySelector("main").append(numberHeading, numberList);
console.log("D6 list items:", numberList.children.length);
console.groupEnd();

// =====================================================================
// SECTION E - Navigating Between DOM Nodes
// =====================================================================
console.group("SECTION E - Navigating");

// E.3 Task 1: start from the Phone card
const phoneCard = Array.from(document.querySelectorAll(".card")).find(
  (card) => card.querySelector("h3").textContent === "Phone"
);
console.log("E1 previous card:", phoneCard.previousElementSibling);
console.log("E1 next card:", phoneCard.nextElementSibling);
console.log("E1 parent section:", phoneCard.parentElement);
console.log("E1 section first child element:", phoneCard.parentElement.firstElementChild);
console.log("E1 section last child element:", phoneCard.parentElement.lastElementChild);

// E.3 Task 2: highlight every sibling except the element itself
function highlightSiblings(element) {
  Array.from(element.parentElement.children).forEach((sibling) => {
    if (sibling !== element) sibling.classList.add("sibling-highlight");
  });
}
highlightSiblings(phoneCard);
console.log("E2 highlighted siblings:", document.querySelectorAll(".sibling-highlight").length);
// remove the highlight after 3 seconds so it does not stay on the page
setTimeout(() => {
  document.querySelectorAll(".sibling-highlight").forEach((el) => el.classList.remove("sibling-highlight"));
}, 3000);

// E.3 Task 3: recursive walkDOM(node, depth)
function walkDOM(node, depth) {
  console.log("  ".repeat(depth) + node.tagName.toLowerCase());
  Array.from(node.children).forEach((child) => walkDOM(child, depth + 1));
}
console.groupCollapsed("E3 walkDOM output (click to open)");
walkDOM(document.documentElement, 0);
console.groupEnd();

// E.3 Task 4: clicking a menu link moves the "active" class to its <li>
menu.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const li = link.closest("li"); // same as link.parentElement here
  const oldActive = menu.querySelector(".active");
  if (oldActive) oldActive.classList.remove("active");
  li.classList.add("active");
  console.log("E4 active menu item:", link.textContent, "| closest === parentElement:", li === link.parentElement);
});

// E.3 Task 5: all ancestors up to <html>
function getAncestors(element) {
  const ancestors = [];
  let current = element.parentElement;
  while (current) {
    ancestors.push(current);
    current = current.parentElement; // becomes null after <html>
  }
  return ancestors;
}
console.log("E5 ancestors of first h3:",
  getAncestors(document.querySelector(".card h3")).map((el) => el.tagName.toLowerCase()));
console.groupEnd();
