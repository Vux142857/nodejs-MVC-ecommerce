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
      if (!newOrdering && newOrdering != "") {
        $(`.${id}`)
          .html(`<input type="number" value="${newOrdering}" class="text-center ordering"
                onchange="changeOrdering(${newOrdering}, '${id}')">`);
      }
    },
  });
};
