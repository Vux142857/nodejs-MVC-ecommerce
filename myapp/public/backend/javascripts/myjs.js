const changeStatus = (id, status) => {
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

$(document).ready(function() {
  $('.tag-toggle').click(function(e) {
    e.preventDefault();
    $(this).siblings('.sub-tags').toggleClass('open');
  });
});
