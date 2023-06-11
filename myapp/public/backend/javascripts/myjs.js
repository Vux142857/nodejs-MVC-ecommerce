const changeStatus = (id, status) => {
    let newLinkChangeStatus = `change-status/${id}/${status}`;
    $.ajax({
        type: "get",
        url: newLinkChangeStatus,
        dataType: "JSON",
        success: function (response) {
            let newStatus = response.data;
            let statusClass = (newStatus === 'active') ? "label-success" : "label-warning";
            $(`#${id}`).html(`<a href="javascript:changeStatus('${id}','${newStatus}')"><span class="label ${statusClass}">${newStatus}</span></a>`);
        }
    });
}

const changeOrdering = (ordering, id) => {
    let newLinkChangeStatus = `change-ordering/${id}`;
    $.ajax({
        type: "post",
        url: newLinkChangeStatus,
        data: { ordering: ordering },
        dataType: "JSON",
        success: function (response) {
            let newOrdering = response.data;
            if (!newOrdering && newOrdering != '') {
                $(`.${id}`).html(`<input type="number" value="${newOrdering}" class="text-center ordering"
                onchange="changeOrdering(${newOrdering}, '${id}')">`);
            }
        }
    });
}
