// first thing to setup
if (typeof MKA === 'undefined') {
  var MKA = {};
}

// Get custom HTML
MKA.request = (function () {
  var getHTML, getView, getSection;

  // fetch
  getHTML = function (el, url) {
    const element = document.querySelector(el);

    fetch(url)
      .then((response) => response.text())
      .then((new_html) => {
        const parser = new DOMParser();
        const parsed_html = parser.parseFromString(new_html, 'text/html');
        const html = parsed_html.querySelector('body').innerHTML;
        element.innerHTML = html;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Render view template
  getView = function (el, view) {
    const url = `/?view=${encodeURIComponent(view)}`;
    getHTML(el, url)
  }

  // Render section 
  getSection = function (el, sectionName) {
    const url = "?section_id=" + sectionName;
    getHTML(el, url)
  }

  // get JOSN fetch
  getJSON = async function fetchData(endpoint, body) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch(endpoint, options);
    const data = await response.json();
    return data;
  }

  return {
    getHTML: getHTML,
    getView: getView,
    getSection: getSection,
    getJSON: getJSON
  };

})();

//
//
// 
//* Product page 

// Quick Add
const productAdd = document.querySelector(".product-buy-con__add");

if (productAdd) {
  productAdd.addEventListener("click", async function (e) {
    e.preventDefault();

    const id = productAdd.attributes.data_productId.value;
    const endpoint = "/cart/add.js";
    const body = {
      id: id,
      quantity: 1,
    };

    // Call fetchData function
    await MKA.request.getJSON(endpoint, body);

    // Call open_cart_drawer function on success
    open_cart_drawer();
    MKA.request.getView("drawer-el", "cart-drawer");
  });
}


//
//
//
//* Drawer

class Drawer {
  // Initialize the drawer with the provided selectors and optional close selector
  constructor(drawerSelector, triggerSelector, closeSelector = '[data-drawer-close]') {
    this.drawerElement = document.querySelector(drawerSelector);
    this.triggerElement = document.querySelector(triggerSelector);
    this.closeElements = this.drawerElement.querySelectorAll(closeSelector);
    this.isOpen = false;

    this.init();
  }

  // Set up the event listeners and add the necessary CSS class
  init() {
    // If the drawer or trigger element is not found, log an error and exit
    if (!this.drawerElement || !this.triggerElement) {
      console.error("Drawer or trigger not found");
      return;
    }

    // Add the "drawer" class to the drawer element
    this.drawerElement.classList.add("drawer");

    // Add a click event listener to the trigger element to toggle the drawer
    this.triggerElement.addEventListener("click", () => {
      this.toggleDrawer();
    });

    // Add click event listeners to all close elements to close the drawer
    this.closeElements.forEach(closeElement => {
      closeElement.addEventListener("click", () => {
        this.closeDrawer();
      });
    });

    // Add a click event listener to the document to close the drawer when clicking outside
    document.addEventListener("click", (event) => {
      // If the drawer is not open, do nothing
      if (!this.isOpen) return;

      // If the click is outside the drawer and not on the trigger element, close the drawer
      if (!this.drawerElement.contains(event.target) && event.target !== this.triggerElement) {
        this.closeDrawer();
      }
    });
  }

  // Toggle the drawer open or closed
  toggleDrawer() {
    this.isOpen = !this.isOpen;
    this.drawerElement.classList.toggle("drawer-open");
  }

  // Close the drawer
  closeDrawer() {
    this.isOpen = false;
    this.drawerElement.classList.remove("drawer-open");
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const mobileMenu = new Drawer('#mobileMenu', '[data-drawer-trigger="#mobileMenu"]');
  // const rightDrawer = new Drawer('#drawer-right', '[data-drawer-trigger="#drawer-right"]');
});


//
//
//
//* Drawer item

class DrawerItem extends HTMLElement {
  constructor() {
    super();
    this.loadCartItemEl();
    this.cartItemRemove();
    // this.cartItemChanges(); LOOP
  }

  loadCartItemEl() {
    this.addEventListener('change', function () {
      // values
      var itemQuantity = this.querySelector('.cart_item__content__input').value;
      var index = this.attributes.data_index.value;

      this.cartItemChanges(index, itemQuantity);
    });
  }

  cartItemRemove() {
    var removeBtn = this.querySelector('.cart_item_remove');
    var index = this.attributes.data_index.value;
    var self = this;

    removeBtn.addEventListener('click', function () {
      self.cartItemChanges(index, 0);
    });
  }

  // fetch and reload html 
  async cartItemChanges(line, quantity) {
    const endpoint = '/cart/change.js'
    const body = {
      quantity: quantity,
      line: line,
    }

    // fetchData function
    await MKA.request.getJSON(endpoint, body);

    // køre efter
    MKA.request.getView("drawer-el", "cart-drawer");
    MKA.request.getSection("#shopify-section-template--16209392337059__main", "template-cart");
    //! skal ikke være her
  }
}

window.customElements.define('cart-item', DrawerItem);


//
//
//
// cart open
const cartBtnOpen = document.querySelector(".cart-btn");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDrawer = document.querySelector(".cart-drawer");
const cartClose = document.querySelector(".cart_close");

function toggle_cart_drawer() {
  open_cart_drawer();
}

cartBtnOpen.addEventListener("click", toggle_cart_drawer);
cartOverlay.addEventListener("click", toggle_cart_drawer);
cartClose.addEventListener("click", toggle_cart_drawer);

function open_cart_drawer() {
  cartOverlay.classList.toggle("cart-overlay-none");
  cartDrawer.classList.toggle("cart-drawer--open");
}


// NEW VERSION

/*

// Setup MKA object if not already set
if (typeof MKA === 'undefined') {
  window.MKA = {};
}

// Set up request methods
MKA.request = {
  getHTML(el, url) {
    const element = document.querySelector(el);
    if (!element) return console.error('Element not found');
    fetch(url)
      .then((response) => response.text())
      .then((new_html) => {
        const parser = new DOMParser();
        const parsed_html = parser.parseFromString(new_html, 'text/html');
        const html = parsed_html.querySelector('body').innerHTML;
        element.innerHTML = html;
      })
      .catch((error) => {
        console.error(error);
      });
  },

  getView(el, view) {
    const url = `/?view=${encodeURIComponent(view)}`;
    this.getHTML(el, url);
  },

  getSection(el, sectionName) {
    const url = "?section_id=" + sectionName;
    this.getHTML(el, url);
  },

  async getJSON(endpoint, body) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      const response = await fetch(endpoint, options);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
};

// Quick Add
document.addEventListener('DOMContentLoaded', () => {
  const productAdd = document.querySelector(".product-buy-con__add");
  console.log(productAdd, "productAdd")
  if (!productAdd) return;

  productAdd.addEventListener("click", async function (e) {
    e.preventDefault();

    const id = productAdd.attributes.data_productId.value;
    const endpoint = "/cart/add.js";
    const body = {
      id: id,
      quantity: 1,
    };

    // Call fetchData function
    await MKA.request.getJSON(endpoint, body);

    // Call open_cart_drawer function on success
    toggle_cart_drawer();
    MKA.request.getView("drawer-el", "cart-drawer");
  });
});

// Remainder of your code follows here...


//
//
//
//* Drawer

class Drawer {
  constructor(drawerSelector, triggerSelector, closeSelector = '[data-drawer-close]') {
    this.drawerElement = document.querySelector(drawerSelector);
    this.triggerElement = document.querySelector(triggerSelector);
    this.closeElements = this.drawerElement.querySelectorAll(closeSelector);
    this.isOpen = false;

    if (!this.drawerElement || !this.triggerElement) {
      console.error("Drawer or trigger not found");
      return;
    }

    this.init();
  }

  init() {
    this.drawerElement.classList.add("drawer");

    this.triggerElement.addEventListener("click", () => this.toggleDrawer());

    this.closeElements.forEach(closeElement => {
      closeElement.addEventListener("click", () => this.closeDrawer());
    });

    document.addEventListener("click", (event) => {
      if (!this.isOpen || this.drawerElement.contains(event.target) || event.target === this.triggerElement) return;
      this.closeDrawer();
    });
  }

  toggleDrawer() {
    this.isOpen = !this.isOpen;
    this.drawerElement.classList.toggle("drawer-open");
  }

  closeDrawer() {
    this.isOpen = false;
    this.drawerElement.classList.remove("drawer-open");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = new Drawer('#mobileMenu', '[data-drawer-trigger="#mobileMenu"]');
});

class DrawerItem extends HTMLElement {
  constructor() {
    super();
    this.loadCartItemEl();
    this.cartItemRemove();
  }

  loadCartItemEl() {
    this.addEventListener('change', () => {
      const itemQuantity = this.querySelector('.cart_item__content__input').value;
      const index = this.attributes.data_index.value;

      this.cartItemChanges(index, itemQuantity);
    });
  }

  cartItemRemove() {
    const removeBtn = this.querySelector('.cart_item_remove');
    const index = this.attributes.data_index.value;

    if (!removeBtn) return;
    removeBtn.addEventListener('click', () => this.cartItemChanges(index, 0));
  }

  async cartItemChanges(line, quantity) {
    const endpoint = '/cart/change.js';
    const body = { quantity, line };

    await MKA.request.getJSON(endpoint, body);
    MKA.request.getView("drawer-el", "cart-drawer");
    MKA.request.getSection("#shopify-section-template--16209392337059__main", "template-cart");
  }
}

window.customElements.define('cart-item', DrawerItem);


//
//
//
// cart open
const toggle_cart_drawer = () => {
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartDrawer = document.querySelector(".cart-drawer");

  if (!cartOverlay || !cartDrawer) return;
  cartOverlay.classList.toggle("cart-overlay-none");
  cartDrawer.classList.toggle("cart-drawer--open");
}

document.addEventListener("DOMContentLoaded", () => {
  const cartBtnOpen = document.querySelector(".cart-btn");
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartClose = document.querySelector(".cart_close");

  if (cartBtnOpen) cartBtnOpen.addEventListener("click", toggle_cart_drawer);
  if (cartOverlay) cartOverlay.addEventListener("click", toggle_cart_drawer);
  if (cartClose) cartClose.addEventListener("click", toggle_cart_drawer);
});
 */