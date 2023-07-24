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
            console.log(123);
            products.forEach((product) => {
              url = product.slug + "-id-" + product._id.toString();
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
                  <a href="#" class="cart-btn button button-white button-light"
                    ><i class="icon-line-plus"></i>Add to Cart</a
                  >
                </div>
                <div class="product-desc">
                  <div class="product-title">
                    <h3>
                      <a href="${url}">${product.name}</a>
                    </h3>
                  </div>
                  <div class="product-price"><ins>${product.price}</ins></div>
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
const addToCart = document.querySelector("#add-to-cart");
addToCart.addEventListener("click", addToCartLocalStorage);

function addToCartLocalStorage() {
  const selectedSize = document.querySelector(
    'input[name="size"]:checked'
  )?.value;
  const nameProduct = document.querySelector('input[name="name"]')?.value;
  const idProduct = document.querySelector('input[name="_id"]')?.value;
  const price = document.querySelector('input[name="price"]')?.value;
  const main_Img = document.querySelector('input[name="main_Img"]')?.value;
  const size_name = document.querySelector('input[name="size_name"]')?.value;

  const quantity = parseInt(document.querySelector(".qty").value);

  if (selectedSize && quantity > 0) {
    let existedProduct = cartItems.find((item) => item._id === idProduct);
    if (existedProduct) {
      let sizesOfProduct = Array.isArray(existedProduct.sizes)
        ? existedProduct.sizes
        : [existedProduct.sizes];
      console.log(typeof sizesOfProduct);

      let existedSize = sizesOfProduct.find(
        (size) => size.name === selectedSize
      );
      if (existedSize) {
        existedSize.amount += quantity;
      } else {
        // if (Array.isArray(existedProduct.sizes)) {
        sizesOfProduct.push({
          name: selectedSize,
          amount: quantity,
        });
        // }
      }
      const index = cartItems.findIndex((existedProduct) => {
        return existedProduct._id === idProduct;
      });

      cartItems[index].sizes = sizesOfProduct;
    } else {
      let size = {
        size_name,
        name: selectedSize,
        amount: quantity,
      };
      const cartItem = {
        _id: idProduct,
        name: nameProduct,
        sizes: [size], // Initialize as an array with the selected size
        price,
        main_Img,
      };
      cartItems.push(cartItem);
    }

    // Add the new item to the cart and save it to local storage
    displayCart(cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    alert("Item added to cart!");
  } else {
    alert("Please select a size and quantity.");
  }
}

function displayCart(listCart) {
  let innerHTML = "";
  let total = 0;
  if (Array.isArray(listCart)) {
    listCart.forEach((cartItem) => {
      innerHTML += `<div class="top-cart-item" >
<div class="top-cart-item-image">
  <a href=""
    ><img
      src="backend/upload/product/${cartItem.main_Img}"
      alt="${cartItem.name}"
  /></a>
</div>
<div class="top-cart-item-desc ">
  <div class="top-cart-item-desc-title">
    <a href="#" class="fw-normal">${cartItem.name}</a>
    <span class="top-cart-item-price d-block">$${cartItem.price}</span>
  </div>
  <div class="top-cart-item-quantity fw-semibold">x 1</div>
</div>
</div>`;
      total += parseInt(cartItem.price);
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
    let sizeAmount = item.sizes
      .map((size) => {
        return `size: ${size.size_name} x ${size.amount}`;
      })
      .join(", ");
    item.sizes.forEach((size) => {
      total += size.amount * item.price;
    });
    innerHTML += `<div class="top-cart-item">
    <div class="top-cart-item-image">
      <a href="#"
        ><img
          src="backend/upload/product/${item.main_Img}"
          alt="${item.name}"
      /></a>
    </div>
  
    <div class="top-cart-item-desc">
      <div class="top-cart-item-desc-title">
        <a href="#" class="fw-normal"> ${item.name} </a>
        <span class="top-cart-item-price d-block">
        ${item.price}
        </span>
      </div>
      <div class="top-cart-item-quantity fw-semibold">
        ${sizeAmount}
      </div>
    </div>
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
  <span class="price" style="color: black"><b>${total}</b></span>
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
        console.log(coupon);

        if (coupon) {
          try {
            console.log(shipFee);
            total += shipFee;
            if (total >= coupon.condition) {
              // Use >= to check if total is greater than or equal to coupon condition
              total -= coupon.value;
            }
            if (total < 0) {
              total = 0;
            }
            let html = `<p>
              Coupon value
              <span class="price" style="color: black"><b>${coupon.value}</b></span>
            </p><p>
              Ship fee
              <span class="price" style="color: black"><b>${shipFee}</b></span>
            </p><p>
              Total
              <span class="price" style="color: black"><b>${total}</b></span>
            </p>`;
            console.log(html);
            return $("#cart-total").html(html);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Error :((");
        }
      },
      error: function () {
        console.log("Error occurred during AJAX request.");
      },
    });
  } else {
    console.log("Please enter a valid coupon code.");
  }
}
