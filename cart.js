function clearCart() {
  localStorage.removeItem("cart");
  loadCartItems();
}
function menuItem(ID) {
  for (let item of menu) if (item.ItemID == ID) return item;
  return null;
}

function addToCart(itemID) {
  //get itemID
  item = menuItem(itemID);
  Choices = [];
  //load choices
  for (let choice of item.Choices) {
    if (!choice.Optional) {
      if (choice.Options.length > 1) {
        var n = document.getElementById(
          "option-" + item.ItemID + "-" + choice.ChoiceID
        ).selectedIndex;
        Choices.push(n);
        // console.log(b);
      } else {
        Choices.push(0);
      }
    } else Choices.push(null);
  }
  //add to cart
  let cart_items = [];
  if (localStorage.getItem("cart")) {
    cart_items = JSON.parse(localStorage.getItem("cart"));
  }
  cart_items.push({ ID: itemID, Q: 1, C: Choices });
  //saving cart
  localStorage.setItem("cart", JSON.stringify(cart_items));

  launch_toast("✓", "<b class=''>" + item.Name + "</b> added.");
  //update cart
  loadCartItems();
}

function loadCartItems() {
  //get cart items
  let cartItems = localStorage.getItem("cart");
  if (cartItems) {
    cartItems = JSON.parse(cartItems);
    // if(!cartItems)
    //   cartItems=[];
  } else cartItems = [];
  // console.log(cartItems);

  //get number of cart items
  let cart_elements = document.getElementsByClassName("cart-count");
  let length = cartItems.length;
  for (let cart of cart_elements) {
    cart.innerHTML = length;
    if (length) {
      cart.classList.remove("d-none");
    } else {
      cart.classList.add("d-none");
    }
  }

  var shopping_cart = document.getElementById("cart-items");
  var str = "";
  var total = 0;
  // if(cart_ids.length==0){
  //   shopping_cart.innerHTML = "<div class='w-100 text-center'>Cart is empty</div>";
  //   return;
  // }

  for (let i = 0; i < cartItems.length; i++) {
    let cartItem = cartItems[i];
    let itemID = cartItem.ID;
    let item = menuItem(itemID);
    let price = calculatePrice(cartItem, item);
    total += price;
    str += `<li class="list-group-item"><div class="d-flex justify-content-between align-items-start"><div class="me-auto">${item.Name}</div><div class="d-flex place-items-center"><span class="px-2 lh-1 btn-danger rounded-pill" role="button" onclick="decreaseQunatity('${i}')">-</span><span class="badge bg-primary rounded-pill quantity-cart-${i}">${cartItem.Q}</span><span class="px-2 lh-1 btn-success rounded-pill" role="button" onclick="increaseQunatity('${i}')">+</span></div></div><div class="d-flex justify-content-between align-items-start"><div class="fw-bold small">(`;

    // +item.Choices[item_detail.Choices[0].ChoiceID].Options[item_detail.Choices[0].OptionID].Name+
    // console.log(item_detail.Choices);
    let optionNames = "";
    let cartChoices = cartItem.C;
    let choices = item.Choices;

    for (let c = 0; c < cartChoices.length; c++) {
      let o = cartChoices[c];
      if (o != null) {
        let optionName = choices[c].Options[o].Name;
        if (choices[c].Optional)
          optionNames += optionName.substring(0, optionName.length - 3) + ", ";
        else optionNames += choices[c].Options[o].Name + ", ";
      }
    }
    optionNames = optionNames.substring(0, optionNames.length - 2);
    str +=
      optionNames +
      `)</div><div class="d-inline ms-auto text-nowrap"><span class="price-cart-${i}">${price}</span> PKR</div></div></li>`;
  }
  shopping_cart.innerHTML = str;
  let price_elements = document.getElementsByClassName("total-cart-price");
  for (let element of price_elements) element.innerHTML = total;
}

function getProperty(array, propertyName, id) {
  for (let item of array) {
    if (item[propertyName] == id) return item;
  }
  return null;
}

function launch_toast(symbol, message) {
  var x = document.getElementById("toast");
  x.querySelector("#img").innerHTML = symbol;
  x.querySelector("#desc").innerHTML = message;

  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3400);
}

function calculatePrice(cartItem, item) {
  let total = item.Price;
  let cartChoices = cartItem.C;
  let choices = item.Choices;
  for (let c = 0; c < cartChoices.length; c++) {
    let o = cartChoices[c];
    if (o != null) {
      total += choices[c].Options[o].Price;
    }
  }
  total *= cartItem.Q;
  return total;
}

function changePrice(cartItems, indexID) {
  const price_elements = document.getElementsByClassName(
    "price-cart-" + indexID
  );
  const cartItem = cartItems[indexID];
  for (let element of price_elements) {
    element.innerHTML = calculatePrice(cartItem, menuItem(cartItem.ID));
  }

  const quantity_elements = document.getElementsByClassName(
    "quantity-cart-" + indexID
  );
  for (let element of quantity_elements) {
    element.innerHTML = cartItem.Q;
  }

  var total = 0;
  for (let cartItem of cartItems) {
    total += calculatePrice(cartItem, menuItem(cartItem.ID));
  }
  const total_elements = document.getElementsByClassName("total-cart-price");
  for (let element of total_elements) {
    element.innerHTML = total;
  }
}

function decreaseQunatity(indexID) {
  let cartItems = JSON.parse(localStorage.getItem("cart"));
  cartItems[indexID].Q--;
  if (cartItems[indexID].Q == 0) {
    cartItems.splice(indexID, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    loadCartItems();
  }
  localStorage.setItem("cart", JSON.stringify(cartItems));
  changePrice(cartItems, indexID);
  // loadCartItems();
}

function increaseQunatity(indexID) {
  let cartItems = JSON.parse(localStorage.getItem("cart"));
  cartItems[indexID].Q++;
  localStorage.setItem("cart", JSON.stringify(cartItems));
  changePrice(cartItems, indexID);
  // loadCartItems();
}
