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

const addToCart = (id) => {
  let addToCartLink = `/add-to-cart/${id}`;
  $.ajax({
    type: "get",
    url: addToCartLink,
    dataType: "json",
    success: function (response) {
      let listCart = response;
      if (listCart) {
        let innerHTML = ``;
        let total = 0;
        if (Array.isArray(listCart)) {
          listCart.forEach((cartItem) => {
            innerHTML += `<div class="top-cart-item" >
      <div class="top-cart-item-image">
        <a href=""
          ><img
            src="backend/upload/product/${cartItem.img[0]}"
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
            total += cartItem.price;
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
        $("#top-cart").html(outerHTML);
      } else {
        console.log("Error :((");
      }
    },
  });
};

function toggleCart() {
  $("#top-cart").toggleClass("top-cart-open");
}
