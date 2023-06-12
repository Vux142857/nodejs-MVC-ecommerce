const itemService = require("../services/itemService");

exports.createFilterStatus = async (currentstatus) => {
    let statusFilter = [
        {
            name: "All",
            value: "all",
            count: await itemService.count({}),
            link: "#",
            class: "default"
        },
        {
            name: "Active",
            value: "active",
            count: await itemService.count({ status: "active" }),
            link: "#",
            class: "default"
        },
        {
            name: "Inactive",
            value: "inactive",
            count: await itemService.count({ status: "inactive" }),
            link: "#",
            class: "default"
        }
    ];

    statusFilter = statusFilter.map((item) => {
        if (item.value === currentstatus) {
            return { ...item, class: "btn-outline-success active" };
        } else if (currentstatus == undefined && item.value == "all") {
            return { ...item, class: "btn-outline-success active" };
        }
        return item;
    });
    return statusFilter;
}