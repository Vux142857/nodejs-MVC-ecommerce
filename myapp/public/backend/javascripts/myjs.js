const changeStatus = (id, status, collection) => {
  let newLinkChangeStatus = `change-status/${id}/${status}`;
  $.ajax({
    type: "get",
    url: newLinkChangeStatus,
    dataType: "JSON",
    success: function (response) {
      // Change status
      let newStatus = response.newStatus;
      if (newStatus != undefined && newStatus != "") {
        let statusClass =
          newStatus === "active"
            ? "btn btn-block btn-info"
            : "btn btn-block btn-danger";

        $(`#${id}`).html(
          `<a href="javascript:changeStatus('${id}','${newStatus}')" class="${statusClass}"><span>${newStatus}</span></a>`
        );

        // Recount status
        let statusFilter = response.recount;
        if (statusFilter != undefined) {
          statusFilter.forEach((filter) => {
            $(`#${filter.value}`).html(`${filter.name} (${filter.count})`);
          });
        }
        generateNotify("You have changed the status");
      } else {
        generateNotify("Failed to change the status");
      }
    },
  });
};

const changeOrdering = (id, ordering) => {
  let newLinkChangeStatus = `change-ordering/${id}`;
  try {
    $.ajax({
      type: "post",
      url: newLinkChangeStatus,
      data: { ordering: ordering },
      dataType: "JSON",
      success: function (response) {},
    });
    generateNotify("You have changed the ordering");
  } catch (error) {
    generateNotify("Failed to change the ordering");
  }
};

const generateNotify = (notify) => {
  return Toastify({
    text: notify,
    duration: 3000,
  }).showToast();
};

$("a.btn-delete").on("click", (event) => {
  event.preventDefault();
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const deleteButton = $(event.target);
      const itemId = deleteButton.data("id");
      const itemStatus = deleteButton.data("status");
      $.ajax({
        type: "DELETE",
        url: `delete/${itemId}/${itemStatus}`,
        success: function (response) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          deleteButton.closest("tr").remove();
          // Recount status
          let statusFilter = response.recount;
          if (statusFilter != undefined) {
            statusFilter.forEach((filter) => {
              $(`#${filter.value}`).html(`${filter.name} (${filter.count})`);
            });
          }
        },
        error: function (error) {
          Swal.fire("Error", "Failed to delete the item.", "error");
        },
      });
    }
  });
});

$(document).ready(function () {
  $(".tag-toggle").click(function (e) {
    e.preventDefault();
    $(this).siblings(".sub-tags").toggleClass("open");
  });
});

function submitCategoryForm(collection) {
  const form = document.getElementById("categoryForm");
  const selectedCategoryId = form.filter_category.value;
  const url = `/admin/${collection}/filter-category/${selectedCategoryId}`;
  form.action = url;
  form.submit();
}

const changeSpecial = (id, special) => {
  let newLinkChangeSpecial = `change-special/${id}/${special}`;
  $.ajax({
    type: "get",
    url: newLinkChangeSpecial,
    dataType: "JSON",
    success: function (response) {
      // Change status
      let newSpecial = response.newSpecial;
      if (newSpecial != undefined && newSpecial != "") {
        let specialClass =
          newSpecial === "on"
            ? "btn btn-block btn-info"
            : "btn btn-block btn-danger";
        $(`#${id}-special`).html(
          `<a href="javascript:changeSpecial('${id}','${newSpecial}')" class="${specialClass}"><span>${newSpecial}</span></a>`
        );
        generateNotify("You have changed the special");
      } else {
        generateNotify("Failed to change the special");
      }
    },
  });
};

const changeRole = (id, role) => {
  let newLinkChangeRole = `change-role/${id}/${role}`;
  $.ajax({
    type: "get",
    url: newLinkChangeRole,
    dataType: "JSON",
    success: function (response) {
      // Change status
      let newRole = response.newRole;
      if (newRole != undefined && newRole != "") {
        let roleClass =
          newRole === "on"
            ? "btn btn-block btn-info"
            : "btn btn-block btn-danger";
        $(`#${id}-role`).html(
          `<a href="javascript:changeRole('${id}','${newRole}')" class="${roleClass}"><span>${newRole}</span></a>`
        );
        generateNotify("You have changed the role");
      } else {
        generateNotify("Failed to change the role");
      }
    },
  });
};

const changeCategory = (id) => {
  let newLinkChangeCategory = `category/${id}`;
  $.ajax({
    type: "get",
    url: newLinkChangeCategory,
    dataType: "JSON",
    success: function (response) {
      // Change category
      let item = response.item;
      if (item != undefined && item != "") {
        let html = "";
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
        $("#articleControl").html(`${html}`);
      } else {
        console.log("Error :((");
      }
    },
  });
};

$("#widget-subscribe-form-2").on("submit", function (event) {
  event.preventDefault();

  var form = $(this);
  var url = "submit";
  var emailInput = $("#widget-subscribe-form-2-email");

  var formData = {
    email: emailInput.val(),
  };

  $.ajax({
    type: "POST",
    url: url,
    data: formData,
    dataType: "json",
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
});

readURL = (input) => {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#blah").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
};

// Function to handle the AJAX request and update the status
const changeStatusOrders = document.querySelectorAll(".change-status-order");
changeStatusOrders.forEach((input) => {
  const id = input.dataset.id;
  input.addEventListener("change", () => updateStatus(id, input.value));
});

function updateStatus(itemId, newStatus) {
  let newLinkChangeStatus = `change-status/${itemId}/${newStatus}`;
  $.ajax({
    type: "get",
    url: newLinkChangeStatus,
    dataType: "JSON",
    success: function (response) {
      // Change status
      let newStatus = response.newStatus;
      if (newStatus != undefined && newStatus != "") {
        let selectedProcess = "";
        let selectedCancel = "";
        let selectedDone = "";
        switch (newStatus) {
          case "processing":
            selectedProcess = "selected ='selected'";
            break;
          case "cancelled":
            selectedCancel = "selected ='selected'";
            break;
          case "done":
            selectedDone = "selected ='selected'";
            break;
          default:
            break;
        }
        $(`#${itemId}`).html(
          `  <select class="form-control change-status-order" name="status" data-id="<%= id %>" required>
          <option value="processing" ${selectedProcess}>Processing
          </option>
          <option value="cancelled" ${selectedCancel}>Cancelled
          </option>
          <option value="done" ${selectedDone}>Done
          </option>
        </select>`
        );

        // Recount status
        let statusFilter = response.recount;
        if (statusFilter != undefined) {
          statusFilter.forEach((filter) => {
            $(`#${filter.value}`).html(`${filter.name} (${filter.count})`);
          });
        }
        generateNotify("You have changed the status");
      } else {
        generateNotify("Failed to change the status");
      }
    },
  });
}

sendMessage = () => {
  const message = document.querySelector("input[name='message']").value;
  var socket = io();
  socket.emit("sendMessage", { value: message });
};
