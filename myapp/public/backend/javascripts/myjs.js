const changeStatus = (id, status) => {
  let newLinkChangeStatus = `change-status/${id}/${status}`;
  $.ajax({
    type: "get",
    url: newLinkChangeStatus,
    dataType: "JSON",
    success: function (response) {
      let newStatus = response.data;
      if (newStatus) {
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
  $.ajax({
    type: "post",
    url: newLinkChangeStatus,
    data: { ordering: ordering },
    dataType: "JSON",
    success: function (response) {
      let newOrdering = response.data;
      if (newOrdering) {
        $(`.${id}`)
          .html(`<input type="number" value="${newOrdering}" class="text-center ordering"
                onchange="changeOrdering(${newOrdering}, '${id}')">`);
        generateNotify("You have changed the ordering");
      } else {
        generateNotify("Failed to change the ordering");
      }
    },
  });
};

const generateNotify = (notify) => {
  return Toastify({
    text: notify,
    duration: 3000,
  }).showToast();
};
