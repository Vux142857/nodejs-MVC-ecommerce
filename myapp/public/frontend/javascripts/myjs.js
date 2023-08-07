let cartItems = localStorage.getItem("cartItems");
cartItems = cartItems ? JSON.parse(cartItems) : [];
let cartData = JSON.stringify(cartItems);
displayCart(cartItems);
displayCartCheckout(cartItems);

const changeCategory = (id) => {
  let newLinkChangeCategory = `category/${id}`;
  $.ajax({
    type: "get",
    url: newLinkChangeCategory,
    dataType: "json", // Updated to lowercase "json"
    success: function (response) {
      let item = response;
      if (item) {
        let html = "";
        try {
          if (Array.isArray(item)) {
            item.forEach((element) => {
              html += `<div class="col-md-6 mb-5">
              <img
                src="backend/upload/article/${element.thumb}"
                alt="image"
                class="mb-4"
              />
              <h4 class="mb-2">
                <a href="${element.slug}-ida=${element._id}">${element.name}</a>
              </h4>
              <p class="mb-3">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo doloremque
                eveniet dolorem, porro earum. Eius, corrupti provident iusto modi sunt.
              </p>
              <a href="${element.slug}-ida=${element._id}" class="stretched-link btn p-0 fw-semibold"
                ><u>View Details</u>
                <i class="icon-line-arrow-right position-relative ms-1" style="top: 2px"></i
              ></a>
            </div>`;
            });
          }
        } catch (error) {
          console.log(error);
        }
        console.log(html);
        $("#articleControl").html(html);
      } else {
        console.log("Error :((");
      }
    },
  });
};

const changeCategoryProduct = (id) => {
  let newLinkChangeCategory = `category-product/${id}`;
  $.ajax({
    type: "get",
    url: newLinkChangeCategory,
    dataType: "json",
    success: function (response) {
      let products = response;
      if (products) {
        let html = "";
        try {
          if (Array.isArray(products)) {
            let url;
            products.forEach((product) => {
              url = product.slug + "-idp=" + product._id.toString();
              html += `<div class="col-lg-4 col-md-6 mb-4">
              <div class="product">
                <div class="product-image position-relative">
                  <div
                    class="fslider"
                    data-pagi="false"
                    data-speed="400"
                    data-pause="200000"
                  >
                    <div class="flexslider">
                      <div class="slider-wrap" >
                        <div class="slide" style ="display: block;">
                          <a href="${url}"
                            ><img
                              src="backend/upload/product/${product.img[0]}"
                              alt="${product.name}"/></a>
                        </div>
                        <div class="slide">
                          <a href="${url}"
                            ><img
                              src="backend/upload/product/${product.img[1]}"
                              alt="${product.name}"/></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                  type="number"
                  step="1"
                  min="1"
                  value="1"
                  name="amount"
                  title="Qty"
                  class="qty"
                  hidden
                />
                <input type="text" name="name" value="${
                  product.name
                }<%= item.name %>" hidden />
                <input type="text" name="_id" value="${product._id}" hidden />
                <input type="text" name="main_Img" value="${
                  product.img[0]
                }" hidden />
                <input type="number" name="price" value="${
                  product.price
                }" hidden />
                <button
                class="cart-btn button button-white button-light add-cart add-to-cart"
              >
                <i class="icon-line-plus"></i>Add to Cart
              </button>
                </div>
                <div class="product-desc">
                  <div class="product-title">
                    <h3>
                      <a href="${url}">${product.name}</a>
                    </h3>
                  </div>
                  <div class="product-price">${product.size
                    .map(
                      (element) =>
                        `<input type="radio" id="${element.id}" name="size" value="${element.id}" data-name="${element.name}" />
                        <label for="${element.id}">${element.name}</label>`
                    )
                    .join("")}<ins>${product.price}</ins></div>
                </div>
              </div>
            </div>`;
            });
          }
        } catch (error) {
          console.log(error);
        }
        console.log(html);
        $("#contain-products").html(html);
        // Call the addToCartLocalStorage function after updating the HTML
        const addToCartButtons = document.querySelectorAll(".add-to-cart");
        addToCartButtons.forEach((button) => {
          button.addEventListener("click", addToCartLocalStorage);
        });
      } else {
        console.log("Error :((");
      }
    },
  });
};

function toggleCart() {
  $("#top-cart").toggleClass("top-cart-open");
}

// JavaScript to handle the "Add to cart" button click
const addToCart = document.querySelectorAll(".add-to-cart");
addToCart.forEach((input) => {
  input.addEventListener("click", addToCartLocalStorage);
});

function addToCartLocalStorage(event) {
  event.preventDefault();
  const clickedButton = event.currentTarget;
  const selectedSize = clickedButton
    .closest(".product")
    .querySelector('input[name="size"]:checked')?.value;
  const nameProduct = clickedButton
    .closest(".product")
    .querySelector('input[name="name"]')?.value;
  const idProduct = clickedButton
    .closest(".product")
    .querySelector('input[name="_id"]')?.value;
  const price = clickedButton
    .closest(".product")
    .querySelector('input[name="price"]')?.value;
  const main_Img = clickedButton
    .closest(".product")
    .querySelector('input[name="main_Img"]')?.value;
  const href = clickedButton
    .closest(".product")
    .querySelector('input[name="href"]')?.value;
  const size_name = clickedButton
    .closest(".product")
    .querySelector('input[name="size"]:checked')?.dataset.name;
  console.log(idProduct);

  const quantity = parseInt(
    clickedButton.closest(".product").querySelector(`.qty`).value
  );

  if (selectedSize && quantity > 0) {
    let existedProduct = cartItems.find((item) => item._id === idProduct);
    if (existedProduct) {
      let sizesOfProduct = Array.isArray(existedProduct.sizes)
        ? existedProduct.sizes
        : [existedProduct.sizes];

      let existedSize = sizesOfProduct.find((size) => size.id === selectedSize);
      if (existedSize) {
        existedSize.amount += quantity;
      } else {
        sizesOfProduct.push({
          name: size_name,
          id: selectedSize,
          amount: quantity,
        });
      }
      const index = cartItems.findIndex((existedProduct) => {
        return existedProduct._id === idProduct;
      });

      cartItems[index].sizes = sizesOfProduct;
    } else {
      let size = {
        name: size_name,
        id: selectedSize,
        amount: quantity,
      };
      const cartItem = {
        _id: idProduct,
        name: nameProduct,
        sizes: [size], // Initialize as an array with the selected size
        price,
        main_Img,
        href,
      };
      cartItems.push(cartItem);
    }

    // Add the new item to the cart and save it to local storage
    displayCart(cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    generateNotify("Item added to cart!");
  } else {
    generateNotify("Please select a size.");
  }
}

function deleteCartItem(itemId) {
  const index = cartItems.findIndex((item) => item._id === itemId);
  if (index !== -1) {
    cartItems.splice(index, 1);
    displayCart(cartItems);
    displayCartCheckout(cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    generateNotify("Item removed from cart!");
  }
}

function displayCart(listCart) {
  let innerHTML = "";
  let total = 0;
  console.log(listCart);
  if (Array.isArray(listCart)) {
    listCart.forEach((cartItem) => {
      let amount = 0;
      cartItem.sizes.forEach((item) => {
        amount += item.amount;
        total += parseInt(cartItem.price) * item.amount;
      });
      innerHTML += `<div class="top-cart-item" >
<div class="top-cart-item-image">
  <a href="/${cartItem.href}"
    ><img
      src="backend/upload/product/${cartItem.main_Img}"
      alt="${cartItem.name}"
  /></a>
</div>
<div class="top-cart-item-desc ">
  <div class="top-cart-item-desc-title">
    <a href="/${cartItem.href}" class="fw-normal">${cartItem.name}</a>
    <span class="top-cart-item-price d-block">$${cartItem.price}</span>
  </div>
  <div class="top-cart-item-quantity fw-semibold">x ${amount}</div>
</div>
<div class="top-cart-item-desc ">
<a href="javascript:deleteCartItem('${cartItem._id}')" class="icon-line-delete"></a>
</div>
</div>`;
    });
  }
  let outerHTML = `<a id="top-cart-trigger" class="position-relative"
><i class="icon-line-bag"></i><span class="top-cart-number">${listCart.length}</span></a
><div class="top-cart-content">
<div class="top-cart-title">
<h4>Shopping Cart</h4>
</div><div class="top-cart-items">${innerHTML}</div><div class="top-cart-action">
<span class="top-checkout-price fw-semibold text-dark">$${total}</span>
<a class="button button-dark button-small m-0" href="/checkout"> Check out </a>
</div>
</div>`;
  return $("#top-cart").html(outerHTML);
}

function displayCartCheckout(cartItems) {
  let total = 0;
  let innerHTML = ``;
  cartItems.forEach((item) => {
    console.log(item);
    let sizeAmount = item.sizes
      .map((size) => {
        return `size: ${size.name} x ${size.amount}`;
      })
      .join(", ");
    item.sizes.forEach((size) => {
      total += size.amount * item.price;
    });
    innerHTML += `<div class="top-cart-item">
    <div class="top-cart-item-image">
      <a href="/${item.href}"
        ><img
          src="backend/upload/product/${item.main_Img}"
          alt="${item.name}"
      /></a>
    </div>
  
    <div class="top-cart-item-desc">
      <div class="top-cart-item-desc-title">
        <a href="/${item.href}" class="fw-normal"> ${item.name} </a>
        <span class="top-cart-item-price d-block">
        ${item.price}
        </span>
      </div>
      <div class="top-cart-item-quantity fw-semibold" style ="margin-right: 5px">
        ${sizeAmount}
      </div>
    </div>
    <a href="javascript:deleteCartItem('${item._id}')" class="icon-line-delete"></a>
  </div>`;
  });
  html = `<h4>
  Cart
  <span class="price" style="color: black"
    ><i class="fa fa-shopping-cart"></i> <b></b
  ></span>
  <input type="text" value="${total}" name="total" hidden />
<input type="text" value='${cartData}' name="products" hidden />
</h4>
${innerHTML}
<hr />
<div id="cart-total">
<p>
  Total
  <span class="price" style="color: black"><b>$ ${total}</b></span>
</p>
</div>
`;
  return $("#cart-checkout").html(html);
}

function applyCoupon() {
  const couponInput = document.getElementById("coupon");
  const couponCode = couponInput.value;
  const shipFee = parseFloat(
    document.querySelector('select[name="shipFee"]')?.value
  );
  let total = parseFloat(document.querySelector('input[name="total"]')?.value); // Convert total to a numeric value
  if (couponCode.trim() !== "") {
    // Perform AJAX request to validate the coupon
    let newLink = `apply-coupon/${couponCode}`;
    $.ajax({
      type: "get",
      url: newLink,
      dataType: "json",
      success: function (response) {
        let coupon = response;
        if (coupon) {
          try {
            total += shipFee;
            console.log(typeof coupon.value);

            if (total >= coupon.condition) {
              // Use >= to check if total is greater than or equal to coupon condition
              if (coupon.type == "num") {
                total -= coupon.value;
              } else if (coupon.type == "percent") {
                total = total * (1 - coupon.value / 100);
              }
            }
            if (total < 0) {
              total = 0;
            }
            let html = `
            <input type="text" name = "coupon" value="${coupon.name}" hidden>
            <p>
              Coupon value
              <span class="price" style="color: black"><b>- $${coupon.value}</b></span>
            </p><p>
              Ship fee
              <span class="price" style="color: black"><b>+ $${shipFee}</b></span>
            </p><p>
              Total
              <span class="price" style="color: black"><b>$ ${total}</b></span>
            </p>`;
            generateNotify("Add coupon successfully !");
            return $("#cart-total").html(html);
          } catch (error) {
            console.log(error);
          }
        } else {
          generateNotify("Please enter a valid coupon code.");
        }
      },
      error: function () {
        // console.log("Error occurred during AJAX request.");
        generateNotify("Please enter a valid coupon code.");
      },
    });
  } else {
    total += shipFee;
    let html = `
            <input type="text" name = "coupon" value="${coupon.name}" hidden>
            <p>
              Coupon value
              <span class="price" style="color: black"><b> $ ${coupon.value}</b></span>
            </p><p>
              Ship fee
              <span class="price" style="color: black"><b>+ $ ${shipFee}</b></span>
            </p><p>
              Total
              <span class="price" style="color: black"><b>$ ${total}</b></span>
            </p>`;
    return $("#cart-total").html(html);
  }
}

const generateNotify = (notify) => {
  return Toastify({
    text: notify,
    duration: 1500,
    close: true,
    style: {
      background: "#ffcc00",
    },
  }).showToast();
};
