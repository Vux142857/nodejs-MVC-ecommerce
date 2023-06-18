const itemService = require("../services/itemService");
const categoryService = require("../services/itemService");
const articleService = require("../services/itemService");

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
            name: "Active",
            value: "active",
            count: await currentService.count({ status: "active" }),
            link: "#",
            class: "default"
        },
        {
            name: "Inactive",
            value: "inactive",
            count: await currentService.count({ status: "inactive" }),
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