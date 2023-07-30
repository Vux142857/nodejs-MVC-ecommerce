exports.createFilterStatus = async (currentStatus, currentService) => {
    let statusFilter = [
        {
            name: "All",
            value: "all",
            count: await currentService.count({}),
            link: "#",
            class: "default"
        },
        {
            name: "Processing",
            value: "processing",
            count: await currentService.count({ status: "processing" }),
            link: "#",
            class: "default"
        },
        {
            name: "Done",
            value: "done",
            count: await currentService.count({ status: "done" }),
            link: "#",
            class: "default"
        },
        {
            name: "Cancelled",
            value: "cancelled",
            count: await currentService.count({ status: "cancelled" }),
            link: "#",
            class: "default"
        }
    ];

    statusFilter = statusFilter.map((item) => {
        if (item.value === currentStatus) {
            return { ...item, class: "btn-outline-success active" };
        } else if (currentStatus == undefined && item.value == "all") {
            return { ...item, class: "btn-outline-success active" };
        }
        return item;
    });
    return statusFilter;
}