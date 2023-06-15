$(document).ready(function () {
    var ckbAll = $(".cbAll");
    var fmAdmin = $("#zt-form");

    // CKEDITOR
    if ($('textarea#content_ck').length) {
        CKEDITOR.replace('content_ck');
    }

    //call active menu
    activeMenu();

    //check selectbox
    change_form_action("#zt-form .slbAction", "#zt-form","#btn-action");

    //check all
    ckbAll.click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
        if ($(this).is(':checked')) {
            $(".ordering").attr("name", "ordering");
        }else{
           
            $(".ordering").removeAttr("name");
        }
        
    });
    // hiden notify
    hiddenNotify(".close-btn");



    $("input[name=cid]").click(function () {
        if ($(this).is(':checked')) {
            $(this).parents("tr").find('.ordering').attr("name", "ordering");
        }else{
            $(this).parents("tr").find('.ordering').removeAttr("name");
        }
    });

    //active menu function
    function activeMenu() {
        var arrPathname = window.location.pathname.split('/');
        var pattern = (typeof arrPathname[2] !== 'undefined') ? arrPathname[2] : '';

        if (pattern != '') {
            $('#side-menu li a').each(function (index) {
                var subject = $(this).attr("href");
                if (subject != "#" && subject.search(pattern) > 0) {
                    $(this).closest("li").addClass("active");
                    if ($(this).parents("ul").length > 1) {
                        $("#side-menu ul").addClass('in').css("height", "auto");
                        $("#side-menu ul").parent().addClass('active');
                    }
                    return;
                }
            });
        } else {
            $('#side-menu li').first().addClass("active");
        }
    }

    //
    function change_form_action(slb_selector, form_selector, id_btn_action) {

        var optValue;
        var isDelete = false;
        var pattenCheckDelete = new RegExp("delete", "i");
        console.log(form_selector);
        
        $(slb_selector).on("change", function () {
            optValue = $(this).val();
            
            
            if(optValue !== "") {
                $(id_btn_action).removeAttr('disabled');
            } else {
                $(id_btn_action).attr('disabled', 'disabled');
            }
            $(form_selector).attr("action", optValue);
        });

        $(form_selector + " .btnAction").on("click", function () {
            isDelete = pattenCheckDelete.test($(slb_selector).val());
            if(isDelete){
                var confirmDelete = confirm('Are you really want to delete?');
                if(confirmDelete === false){
                    return;
                }
            }

            var numberOfChecked = $(form_selector + ' input[name="cid"]:checked').length;
            console.log($(form_selector + ' input[name="cid"]:checked'));
            if (numberOfChecked == 0) {
                alert("Please choose some items");
                return;
            } else {
                var flag = false;
                var str = $(slb_selector + " option:selected").attr('data-comfirm');
               
                if (str != undefined) {

                    //Kiểm tra giá trị trả về khi user nhấn nút trên popup
                    flag = confirm(str);
                    if (flag == false) {
                        return flag;
                    } else {
                        $(form_selector).submit();
                    }

                } else {
                    if (optValue != undefined) {
                        $(form_selector).submit();
                    }
                }
            }

        });
    }

    // hidden parent (hidden message notify)
    function hiddenNotify(close_btn_selector){
        $(close_btn_selector).on('click', function(){
            $(this).parent().css({'display':'none'});
        })    
    }
});
