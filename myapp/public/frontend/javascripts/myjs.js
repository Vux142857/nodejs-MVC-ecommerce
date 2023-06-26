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
                <a href="#">${element.name}</a>
              </h4>
              <p class="mb-3">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo doloremque
                eveniet dolorem, porro earum. Eius, corrupti provident iusto modi sunt.
              </p>
              <a href="#" class="stretched-link btn p-0 fw-semibold"
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
        $("#articleControl").html(html); // Removed unnecessary "${}" from the html variable
      } else {
        console.log("Error :((");
      }
    },
  });
};
