const changeStatus = (id, status) => {
  let newLinkChangeStatus = `change-status/${id}/${status}`;
  $.ajax({
    type: "get",
    url: newLinkChangeStatus,
    dataType: "JSON",
    success: function (response) {
      let newStatus = response.data;
      if (newStatus != undefined && newStatus != "") {
        let statusClass =
          newStatus === "active"
            ? "btn btn-block btn-info"
            : "btn btn-block btn-danger";
        $(`#${id}`).html(
          `<a href="javascript:changeStatus('${id}','${newStatus}')" class="${statusClass}"><span>${newStatus}</span></a>`
        );
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
