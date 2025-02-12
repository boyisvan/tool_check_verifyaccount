$(document).ready(function () {
    const IP_SOCKET = $("#IP_SOCKET").val();
    const URL_API = $('#URL_API').val();
    const API_KEY = $('#API_KEY').val();
    var socket;
    var result = [];
    var index = 0;
    var group_Emails = [];
    var group_Twitters = [];
    var group_Youtubes = [];

    if (IP_SOCKET != "" && IP_SOCKET != undefined) {
        socket = new WebSocket(IP_SOCKET);

        const funcSocket = {
            onOpen: (event) => {
                console.log("Connected to WebSocket server.");
                if (API_KEY != "" && API_KEY != undefined)
                {
                    sendSocket({
                        'action': 'login',
                        'token': API_KEY,
                    });
                    sendSocket({
                        'action': 'info',
                    });
                }
            },
            onMessage: (event) => {
                const data = JSON.parse(event.data);
                if (data.action == "count") {
                    if (data.status == false) {
                        swal("Thông báo", data.message, "warning");
                        return;
                    }
                    $("#btn-check-email").addClass("btn-disabled");
                    $("#btn-reset-email").addClass("btn-disabled");
                    $("#btn-stop-check-email").removeClass("btn-disabled");
                    stopCheckEmail = false;

                    
                    index = 0;
                    if (data.data.type == 'email')
                        checkEmail(data.data.count);
                    else if (data.data.type == 'twitter')
                        checkTwitter(data.data.count);
                    else if (data.data.type == 'youtube')
                        checkYoutube(data.data.count);
                }
                if (data.action == "info") {
                    let count = data.data.count;
                    count = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    $("#number_of_turns_user").html(count);
                }
                if (data.action == "check") {
                    if (data.status == true) {
                        const count = data.data.length;
                        for (var i = 0; i < count; i++) {
                            email = data.data[i];
                            // result[email.index].status = email.status;
                            result[email.index] = {
                                'status': email.status, 
                                'email': email.email,
                                'index': email.index,
                            }
                            switch (email.status) {
                                case "live":
                                    $("#text-email-live").html(
                                        parseInt($("#text-email-live").html()) + 1
                                    );
                                    break;
                                case "verify_phone":
                                    $("#text-email-verify").html(
                                        parseInt($("#text-email-verify").html()) + 1
                                    );
                                    break;
                                case "die":
                                    $("#text-email-die").html(
                                        parseInt($("#text-email-die").html()) + 1
                                    );
                                    break;
                                case "not_exists":
                                    $("#text-email-not-exists").html(
                                        parseInt($("#text-email-not-exists").html()) + 1
                                    );
                                    break;
                                case "error":
                                    $("#text-email-error").html(
                                        parseInt($("#text-email-error").html()) + 1
                                    );
                                    break;
                                case "wrong_format":
                                    $("#text-email-format").html(
                                        parseInt($("#text-email-format").html()) + 1
                                    );
                                    break;
                                default:
                                    break;
                            }
                            $("#text-email-total").html(
                                parseInt($("#text-email-total").html()) + 1
                            );
                        }

                        var result_text = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].status != undefined && result[i].status != "") {
                                result_text +=
                                    result[i].status +
                                    "|" +
                                    result[i].email +
                                    "\n";
                            }
                        }

                        result_text += "end|--------------------------";

                        $("#form-result").val(result_text);

                        if (index + 1 < group_Emails.length && !stopCheckEmail) {
                            runCheckEmail(index + 1, group_Emails);
                        } else {
                            swal("Thông báo", "Đã hoàn thành!", "success");
                            $("#btn-check-email").removeClass("btn-disabled");
                            $("#btn-reset-email").removeClass("btn-disabled");
                            $("#btn-stop-check-email").addClass("btn-disabled");
                        }
                    } else {
                        swal("Thông báo", data.message, "warning");
                        $("#btn-check-email").removeClass("btn-disabled");
                        $("#btn-reset-email").removeClass("btn-disabled");
                        $("#btn-stop-check-email").addClass("btn-disabled");
                    }
                }
                if (data.action == "check.twitter") {
                    if (data.status == true) {
                        const count = data.data.length;
                        for (var i = 0; i < count; i++) {
                            twitter = data.data[i];
                            // result[twitter.index].name = twitter.name;
                            // result[twitter.index].followers_count = twitter.followers_count;
                            // result[twitter.index].friends_count = twitter.friends_count;
                            // result[twitter.index].created_at = twitter.created_at;
                            // result[twitter.index].status = twitter.status;

                            result[twitter.index] = {
                                'name': twitter.name,
                                'followers_count': twitter.followers_count,
                                'friends_count': twitter.friends_count,
                                'created_at': twitter.created_at,
                                'status': twitter.status,
                                'url': twitter.url,
                                'index': twitter.index,
                                'username': twitter.username,
                            }

                            switch (twitter.status) {
                                case "live":
                                    $("#text-email-live").html(
                                        parseInt($("#text-email-live").html()) + 1
                                    );
                                    break;
                                case "suspended":
                                    $("#text-email-die").html(
                                        parseInt($("#text-email-die").html()) + 1
                                    );
                                    break;
                                case "not_exist":
                                    $("#text-email-not-exists").html(
                                        parseInt($("#text-email-not-exists").html()) + 1
                                    );
                                    break;
                                default:
                                    break;
                            }
                            $("#text-email-total").html(
                                parseInt($("#text-email-total").html()) + 1
                            );
                        }

                        var result_text = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].status != undefined && result[i].status != "") {
                                result_text +=
                                result[i].status + "|" +
                                result[i].username + "|" +
                                result[i].name + "|" +
                                result[i].followers_count + "|" +
                                result[i].friends_count + "|" +
                                result[i].created_at + "\n";
                            }
                        }

                        $("#form-result").val(result_text);

                        if (index + 1 < group_Twitters.length && !stopCheckEmail) {
                            runCheckTwitter(index + 1, group_Twitters);
                        } else {
                            swal("Thông báo", "Đã hoàn thành!", "success");
                            $("#btn-check-email").removeClass("btn-disabled");
                            $("#btn-reset-email").removeClass("btn-disabled");
                            $("#btn-stop-check-email").addClass("btn-disabled");

                        }
                    } else {
                        swal("Thông báo", data.message, "warning");
                        $("#btn-check-email").removeClass("btn-disabled");
                        $("#btn-reset-email").removeClass("btn-disabled");
                        $("#btn-stop-check-email").addClass("btn-disabled");
                    }
                }
                if (data.action == "check.youtube") {
                    if (data.status == true) {
                        const count = data.data.length;
                        for (var i = 0; i < count; i++) {
                            youtube = data.data[i];
                            result[youtube.index] = {
                                'subscribers': youtube.data.subscribers,
                                'views': youtube.data.views,
                                'joined': youtube.data.joined,
                                'videos': youtube.data.videos,
                                'name': youtube.data.name,
                                'status': youtube.data.status,
                                'url': youtube.data.url,
                                'index': youtube.index,
                            }

                            switch (youtube.status) {
                                case "live":
                                    $("#text-email-live").html(
                                        parseInt($("#text-email-live").html()) + 1
                                    );
                                    break;
                                case "not_exist":
                                    $("#text-email-not-exists").html(
                                        parseInt($("#text-email-not-exists").html()) + 1
                                    );
                                    break;
                                case "die":
                                    $("#text-email-die").html(
                                        parseInt($("#text-email-die").html()) + 1
                                    );
                                    break;
                                default:
                                    break;
                            }
                            $("#text-email-total").html(
                                parseInt($("#text-email-total").html()) + 1
                            );
            
                            $("#form-result").val(
                                $("#form-result").val() +
                                youtube.status + "|" + 
                                youtube.data.url + "|" +
                                youtube.data.name + "|" +
                                youtube.message + "|" +
                                youtube.data.subscribers + "|" +
                                youtube.data.views + "|" +
                                youtube.data.joined + "|" +
                                youtube.data.videos + "\n"
                            );
            
                            if (index + 1 < group_Youtubes.length && !stopCheckEmail) {
                                runCheckYoutube(index + 1, group_Youtubes);
                            } else {
                                swal("Thông báo", "Đã hoàn thành!", "success");
                                $("#btn-check-email").removeClass("btn-disabled");
                            }
                        }
                    } else {
                        swal("Thông báo", data.message, "warning");
                        $("#btn-check-email").removeClass("btn-disabled");
                        $("#btn-reset-email").removeClass("btn-disabled");
                        $("#btn-stop-check-email").addClass("btn-disabled");
                    }
                }
            },
            onClose: (event) => {
                setTimeout(function () {
                    console.log("Connection closed.")
                    console.log('Reconnecting...');
                    funcSocket.connect();
                }, 1000);
            },
            connect: (event) => {
                try {
                    socket = new WebSocket(IP_SOCKET);
                    socket.onmessage = funcSocket.onMessage;
                    socket.onopen = funcSocket.onOpen;
                    socket.onclose = funcSocket.onClose;
                } catch (error) {
                    funcSocket.onClose();
                }
            },
        };

        socket.addEventListener("open", event => {
            funcSocket.onOpen(event);
        });

        socket.addEventListener("message", event => {
            funcSocket.onMessage(event);
        });

        socket.addEventListener("close", event => {
            funcSocket.onClose(event);
        });
    }

    const sendSocket = (data) => {
        socket.send(JSON.stringify(data));
    }

    $(document).on("click", "#btn-not-allow-cookie", function () {
        $(".allow-cookie").css("display", "none");
    });
    $(document).on("click", "#btn-allow-cookie", function () {
        $(".allow-cookie").css("display", "none");
        $.ajax({
            url: "./cookie/allow",
            type: "GET",
            success: function (data) {},
            error: function (data) {},
        });
    });
    $(document).on("click", "#logout", function (event) {
        event.preventDefault();
        $.ajax({
            url: "./logout",
            type: "GET",
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    window.location.href = "./";
                });
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });
    $(document).on("click", ".use-dropdown", function () {
        const used_dropdown = $(".use-dropdown");
        var dropdown = $("." + $(this).data("dropdown"));

        used_dropdown.each(function () {
            if (!dropdown.hasClass($(this).data("dropdown"))) {
                const item = $("." + $(this).data("dropdown"));
                item.removeClass("active");
            }
        });

        if (dropdown.hasClass("active")) {
            dropdown.removeClass("active");
        } else {
            dropdown.addClass("active");
        }
    });

    var stopCheckEmail = false;
    $(document).on("click", "#btn-stop-check-email", function () {
        if ($("#btn-stop-check-email").hasClass("btn-disabled"))
            return;

        stopCheckEmail = true;
        $("#btn-stop-check-email").addClass("btn-disabled");
        $("#btn-check-email").removeClass("btn-disabled");
        $("#btn-reset-email").removeClass("btn-disabled");
    });

    $(document).on("click", "#btn-reset-email", function () {
        if ($("#btn-reset-email").hasClass("btn-disabled"))
            return;

        $("#form-email").val("");
        $("#form-result").val("");
        $("#textarea-live").val("");
        $("#textarea-verify").val("");
        $("#textarea-die").val("");
        $("#textarea-not-exists").val("");
        $("#text-email-live").html("0");
        $("#text-email-verify").html("0");
        $("#text-email-die").html("0");
        $("#text-email-not-exists").html("0");

    });

    $(document).on("click", "#btn-check-email", function () {
        if ($("#isLogged").val() != "true" && $("#isLogged").val() != true) {
            swal("Thông báo", "Bạn chưa đăng nhập!", "warning");
            return;
        }

        if ($("#btn-check-email").hasClass("btn-disabled"))
            return;

        const type = $(this).data('type');
        if (type == 'email') {
            sendSocket({
                'action': 'count',
                'type': 'email'
            });
        }
        else if (type == 'youtube') {
            sendSocket({
                'action': 'count',
                'type': 'youtube'
            });
        }
        else if (type == 'twitter') {
            sendSocket({
                'action': 'count',
                'type': 'twitter'
            });
        }
    });

    function checkYoutube(countThreads) {
        const links = $("#form-email").val().split("\n");
        $("#text-email-live").html("0");
        $("#text-email-not-exists").html("0");
        $("#text-email-error").html("0");
        $("#text-email-total").html("0");
        $("#btn-check-email").addClass("btn-disabled");
        $("#btn-reset-email").addClass("btn-disabled");
        $("#btn-stop-check-email").removeClass("btn-disabled");
        $("#form-result").val("");

        result = [];

        for (var i = 0; i < links.length; i++) {
            if (links[i] != "")
                result.push({
                    url: links[i],
                    index: i,
                });
        }
        if (countThreads > result.length) {
            countThreads = result.length;
        }

        group_Youtubes = [];
        const chunk = (arr, size) =>
            Array.from(
                {
                    length: Math.ceil(arr.length / size),
                },
                (v, i) => arr.slice(i * size, i * size + size)
            );
        group_Youtubes = chunk(result, countThreads);

        runCheckYoutube(0, group_Youtubes);
    }

    function runCheckYoutube(pos, group_Youtubes) {
        var youtube = group_Youtubes[pos];
        index = pos;

        sendSocket({
            'action': 'check.youtube',
            'data': youtube,
            'token': API_KEY,
        }); 
    }

    // function checkYoutube(index, links) {
    //     $.ajax({
    //         url: "./api/youtube/check",
    //         type: "POST",
    //         contentType: "application/json",
    //         data: JSON.stringify({
    //             url: links[index],
    //         }),
    //         success: function (data) {
    //             switch (data.status) {
    //                 case "live":
    //                     $("#text-email-live").html(
    //                         parseInt($("#text-email-live").html()) + 1
    //                     );
    //                     break;
    //                 case "not_exist":
    //                     $("#text-email-not-exists").html(
    //                         parseInt($("#text-email-not-exists").html()) + 1
    //                     );
    //                     break;
    //                 case "die":
    //                     $("#text-email-die").html(
    //                         parseInt($("#text-email-die").html()) + 1
    //                     );
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             $("#text-email-total").html(
    //                 parseInt($("#text-email-total").html()) + 1
    //             );

    //             $("#form-result").val(
    //                 $("#form-result").val() +
    //                 data.status + "|" + 
    //                 data.data.url + "|" +
    //                 data.data.name + "|" +
    //                 data.message + "|" +
    //                 data.data.subscribers + "|" +
    //                 data.data.views + "|" +
    //                 data.data.joined + "|" +
    //                 data.data.videos + "\n"
    //             );

    //             if (index + 1 < links.length && !stopCheckEmail) {
    //                 checkYoutube(index + 1, links);
    //             } else {
    //                 swal("Thông báo", "Đã hoàn thành!", "success");
    //                 $("#btn-check-email").removeClass("btn-disabled");
    //             }
    //         },
    //         error: function (data) {
    //             swal("Thông báo", "Có lỗi xảy ra!", "error");
    //             $("#btn-check-email").removeClass("btn-disabled");
    //         },
    //     });
    // }

    function checkTwitter(countThreads) {
        const usernames = $("#form-email").val().split("\n");
        $("#text-email-live").html("0");
        $("#text-email-die").html("0");
        $("#text-email-not-exists").html("0");
        $("#text-email-total").html("0");

        result = [];

        for (var i = 0; i < usernames.length; i++) {
            if (usernames[i] != "")
                result.push({
                    username: usernames[i],
                    index: i,
                });
        }
        if (countThreads > result.length) {
            countThreads = result.length;
        }

        group_Twitters = [];
        const chunk = (arr, size) =>
            Array.from(
                {
                    length: Math.ceil(arr.length / size),
                },
                (v, i) => arr.slice(i * size, i * size + size)
            );
        group_Twitters = chunk(result, countThreads);

        runCheckTwitter(0, group_Twitters);
    }

    function runCheckTwitter(pos, group_Twitters) {
        var twitter = group_Twitters[pos];
        const URL_API = $('#URL_API').val();
        const API_KEY = $('#API_KEY').val();
        index = pos;

        sendSocket({
            'action': 'check.twitter',
            'data': twitter,
            'token': API_KEY,
        }); 
    }

    function checkEmail(countThreads) {
        const emails = $("#form-email").val().split("\n");
        $("#text-email-live").html("0");
        $("#text-email-verify").html("0");
        $("#text-email-die").html("0");
        $("#text-email-not-exists").html("0");
        $("#text-email-error").html("0");
        $("#text-email-total").html("0");
        $("#text-email-format").html("0");

        result = [];

        for (var i = 0; i < emails.length; i++) {
            if (emails[i] != "")
                result.push({
                    email: emails[i],
                    index: i,
                });
        }
        if (countThreads > result.length) {
            countThreads = result.length;
        }

        group_Emails = [];
        const chunk = (arr, size) =>
            Array.from(
                {
                    length: Math.ceil(arr.length / size),
                },
                (v, i) => arr.slice(i * size, i * size + size)
            );
        group_Emails = chunk(result, countThreads);

        runCheckEmail(0, group_Emails);
    }

    function runCheckEmail(pos, group_Emails) {
        var email = group_Emails[pos];
        const URL_API = $('#URL_API').val();
        const API_KEY = $('#API_KEY').val();
        index = pos;

        sendSocket({
            'action': 'check',
            'data': email,
            'token': API_KEY,
        });
    }

    // Modal
    $(document).on("click", ".btn-close-modal", function () {
        closeModal();
    });

    function closeModal() {
        $(".modal").addClass("hidden");
    }

    // Page login
    $(document).on("click", "#btn-login", function (event) {
        event.preventDefault();
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        var remember = $("#login-remember").is(":checked") ? 1 : 0;
        $.ajax({
            url: "./login",
            type: "POST",
            data: {
                username: username,
                password: password,
                remember: remember,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    window.location.href = "./";
                });
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    $(document).on("click", "#btn-register", function (event) {
        event.preventDefault();
        var username = $("#register-username").val();
        var password = $("#register-password").val();
        var confirmPassword = $("#register-confirm-password").val();
        $.ajax({
            url: "./register",
            type: "POST",
            data: {
                username: username,
                password: password,
                confirmPassword: confirmPassword,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    window.location.href = "./login";
                });
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    // Page profile
    $(document).on("click", "#btn-update-profile", function (event) {
        event.preventDefault();
        var email = $("#profile-email").val();
        var phone = $("#profile-phone").val();

        $.ajax({
            url: "./profile/update",
            type: "POST",
            data: {
                email: email,
                phone: phone,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal("Thông báo", data.message, "success");
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    // Page change password
    $(document).on("click", "#btn-change-password", function (event) {
        event.preventDefault();
        var password_old = $("#change-password-old").val();
        var password_new = $("#change-password-new").val();
        var password_new_confirm = $("#change-password-confirm").val();

        $.ajax({
            url: "./change-password/update",
            type: "POST",
            data: {
                password_old: password_old,
                password_new: password_new,
                password_new_confirm: password_new_confirm,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                $("#change-password-old").val("");
                $("#change-password-new").val("");
                $("#change-password-confirm").val("");
                swal("Thông báo", data.message, "success");
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    // Page account manager
    var table_account_manager = $("#table-account-manager").DataTable();

    $(document).on("click", ".btn-update-status-account", function () {
        try {
            const btn = $(this);
            const id = btn.parent().parent().data("id");
            const status = btn.hasClass("btn-green") ? 1 : 0;
            $.ajax({
                url: "./admin/accounts/status/update",
                type: "POST",
                data: {
                    id: id,
                    status: status,
                },
                success: function (data) {
                    if (data.status == false) {
                        swal("Thông báo", data.message, "warning");
                        return;
                    }
                    swal("Thông báo", data.message, "success");
                    btn.toggleClass("btn-green");
                    btn.toggleClass("btn-red");
                    btn.text(status == 1 ? "Khóa" : "Kích hoạt");
                },
                error: function (data) {
                    swal("Thông báo", "Có lỗi xảy ra!", "error");
                },
            });
        } catch (e) {
            console.log(e);
        }
    });

    $(document).on("click", ".btn-show-update-role-account", function () {
        const btn = $(this);
        var id = btn.parent().parent().data("id");
        $(".modal-update-role").removeClass("hidden");
        $(".modal-update-role").data("id", id);
        $.ajax({
            url: "./admin/accounts/role/get",
            type: "POST",
            data: {
                account_id: id,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    closeModal();
                    return;
                }
                $(".modal-update-role").data("id", id);
                $(".modal-update-role").find("select").val(data.data.role);
                $(".modal-update-role").find("#number_of_turns").val(data.data.number_of_turns);
                var date_time = new Date(data.data.expired_at);
                var date = date_time.getDate();
                var month = date_time.getMonth() + 1;
                var year = date_time.getFullYear();
                var hour = date_time.getHours();
                var minute = date_time.getMinutes();

                if (date < 10) {
                    date = "0" + date;
                }
                if (month < 10) {
                    month = "0" + month;
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }

                $(".modal-update-role").find("#date").val(year + "-" + month + "-" + date);
                $(".modal-update-role").find("#time").val(hour + ":" + minute);

            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
                closeModal();
            },
        });
    });

    $(document).on("click", "#btn-update-role-account", function () {
        const btn = $(this);
        const id = $(".modal-update-role").data("id");
        const role = $(".modal-update-role").find("select").val();
        const number_of_turns = $(".modal-update-role").find("input").val();
        const date = $(".modal-update-role").find("#date").val();
        const time = $(".modal-update-role").find("#time").val();
        const updated_at = date + " " + time + ":00";
        $.ajax({
            url: "./admin/accounts/role/update",
            type: "POST",
            data: {
                account_id: id,
                role: role,
                number_of_turns: number_of_turns,
                expired_at: updated_at,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal("Thông báo", data.message, "success");
                closeModal();
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    $(document).on("click", "#btn-show-create-account", function () {
        $(".modal-create-account").removeClass("hidden");
    });

    $(document).on("click", "#btn-create-account", function () {
        const username = $("#username-create").val();
        const password = $("#password-create").val();
        const re_password = $("#re-password-create").val();

        $.ajax({
            url: "./admin/accounts/create",
            type: "POST",
            data: {
                username: username,
                password: password,
                password_confirm: re_password,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    location.reload();
                });
                closeModal();
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    // Page email manager
    var table_email_manager = $("#table-email-manager").DataTable();

    $(document).on("click", "#btn-show-create-email", function () {
        $(".modal-create-email").removeClass("hidden");
        $('#email-create').val('');
        $('#cookies-create').val('');
        $('#auth-create').val('');
    });

    $(document).on("click", "#btn-show-create-twitter", function () {
        $(".modal-create-twitter").removeClass("hidden");
        $('#csrf-create').val('');
        $('#cookies-create').val('');
        $('#auth-create').val('');
    });
    $(document).on("click", ".btn-show-update-email", function () {
        $(".modal-update-email").removeClass("hidden");
        const btn = $(this);
        const id = btn.parent().parent().parent().data("id");
        $(".modal-update-email").data("id", id);

        $.ajax({
            url: "./admin/emails/get",
            type: "POST",
            data: {
                email_id: id,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    closeModal();
                    return;
                }
                $("#email-update").val(data.data.email);
                $("#cookies-update").val(data.data.cookie);
                $("#auth-update").val(data.data.auth);
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
                closeModal();
            },
        });
    });

    $(document).on("click", ".btn-show-update-twitter", function () {
        $(".modal-update-twitter").removeClass("hidden");
        const btn = $(this);
        const id = btn.parent().parent().parent().data("id");
        $(".modal-update-twitter").data("id", id);

        $.ajax({
            url: "./admin/twitters/get",
            type: "POST",
            data: {
                twitter_id: id,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    closeModal();
                    return;
                }
                $("#csrf-update").val(data.data.csrf);
                $("#cookies-update").val(data.data.cookie);
                $("#auth-update").val(data.data.auth);
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
                closeModal();
            },
        });
    });
    
    $(document).on("click", ".btn-update-status-email", function () {
        try {
            const btn = $(this);
            const id = btn.parent().parent().data("id");
            const status = btn.hasClass("btn-green") ? 1 : 0;
            $.ajax({
                url: "./admin/emails/status/update",
                type: "POST",
                data: {
                    email_id: id,
                    status: status,
                },
                success: function (data) {
                    if (data.status == false) {
                        swal("Thông báo", data.message, "warning");
                        return;
                    }
                    swal("Thông báo", data.message, "success");
                    btn.toggleClass("btn-green");
                    btn.toggleClass("btn-red");
                    btn.text(status == 1 ? "Khóa" : "Kích hoạt");
                },
                error: function (data) {
                    swal("Thông báo", "Có lỗi xảy ra!", "error");
                },
            });
        } catch (e) {
            console.log(e);
        }
    });
    $(document).on("click", ".btn-update-status-twitter", function () {
        try {
            const btn = $(this);
            const id = btn.parent().parent().data("id");
            const status = btn.hasClass("btn-green") ? 1 : 0;
            $.ajax({
                url: "./admin/twitters/status/update",
                type: "POST",
                data: {
                    twitter_id: id,
                    status: status,
                },
                success: function (data) {
                    if (data.status == false) {
                        swal("Thông báo", data.message, "warning");
                        return;
                    }
                    swal("Thông báo", data.message, "success");
                    btn.toggleClass("btn-green");
                    btn.toggleClass("btn-red");
                    btn.text(status == 1 ? "Khóa" : "Kích hoạt");
                },
                error: function (data) {
                    swal("Thông báo", "Có lỗi xảy ra!", "error");
                },
            });
        } catch (e) {
            console.log(e);
        }
    });
    $(document).on("click", "#btn-create-email", function () {
        const email = $("#email-create").val();
        const cookies = $("#cookies-create").val();
        const auth = $("#auth-create").val();

        $.ajax({
            url: "./admin/emails/create",
            type: "POST",
            data: {
                email: email,
                cookies: cookies,
                auth: auth,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    location.reload();
                });
                closeModal();
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });
    $(document).on("click", "#btn-create-twitter", function () {
        const csrf = $("#csrf-create").val();
        const cookies = $("#cookies-create").val();
        const auth = $("#auth-create").val();

        $.ajax({
            url: "./admin/twitters/create",
            type: "POST",
            data: {
                csrf: csrf,
                cookies: cookies,
                auth: auth,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    location.reload();
                });
                closeModal();
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });
    $(document).on("click", ".btn-delete-email", function () {
        const btn = $(this);
        const id = btn.parent().parent().parent().data("id");
        swal({
            title: "Thông báo",
            text: "Bạn có chắc chắn muốn xóa email này?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "./admin/emails/delete",
                    type: "POST",
                    data: {
                        email_id: id,
                    },
                    success: function (data) {
                        if (data.status == false) {
                            swal("Thông báo", data.message, "warning");
                            return;
                        }
                        swal({
                            title: "Thông báo",
                            text: data.message,
                            icon: "success",
                            showCancelButton: false,
                            timer: 3000,
                        }).then(function () {
                            location.reload();
                        });
                    },
                    error: function (data) {
                        swal("Thông báo", "Có lỗi xảy ra!", "error");
                    },
                });
            }
        });
    });
    $(document).on("click", ".btn-delete-twitter", function () {
        const btn = $(this);
        const id = btn.parent().parent().parent().data("id");
        swal({
            title: "Thông báo",
            text: "Bạn có chắc chắn muốn xóa tài khoản này?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "./admin/twitters/delete",
                    type: "POST",
                    data: {
                        twitter_id: id,
                    },
                    success: function (data) {
                        if (data.status == false) {
                            swal("Thông báo", data.message, "warning");
                            return;
                        }
                        swal({
                            title: "Thông báo",
                            text: data.message,
                            icon: "success",
                            showCancelButton: false,
                            timer: 3000,
                        }).then(function () {
                            location.reload();
                        });
                    },
                    error: function (data) {
                        swal("Thông báo", "Có lỗi xảy ra!", "error");
                    },
                });
            }
        });
    });

    $(document).on("click", "#btn-update-email", function () {
        const id = $(".modal-update-email").data("id");
        const email = $("#email-update").val();
        const cookies = $("#cookies-update").val();
        const auth = $("#auth-update").val();

        $.ajax({
            url: "./admin/emails/update",
            type: "POST",
            data: {
                email_id: id,
                email: email,
                cookies: cookies,
                auth: auth,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    location.reload();
                });
                closeModal();
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    $(document).on("click", "#btn-update-twitter", function () {
        const id = $(".modal-update-twitter").data("id");
        const csrf = $("#csrf-update").val();
        const cookies = $("#cookies-update").val();
        const auth = $("#auth-update").val();

        $.ajax({
            url: "./admin/twitters/update",
            type: "POST",
            data: {
                twitter_id: id,
                csrf: csrf,
                cookies: cookies,
                auth: auth,
            },
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    location.reload();
                });
                closeModal();
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    $(document).on("click", "#btn-update-status-email", function () {
        $.ajax({
            url: "./admin/emails/seeder/update",
            type: "GET",
            success: function (data) {
                if (data.status == false) {
                    swal("Thông báo", data.message, "warning");
                    return;
                }
                swal({
                    title: "Thông báo",
                    text: data.message,
                    icon: "success",
                    showCancelButton: false,
                    timer: 3000,
                }).then(function () {
                    location.reload();
                });
            },
            error: function (data) {
                swal("Thông báo", "Có lỗi xảy ra!", "error");
            },
        });
    });

    

    $(document).on("click", "#copy", function () {
        const content = $(this).contents().text().trim();
        const el = document.createElement("textarea");
        el.value = content;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        swal({
            title: "Thông báo",
            text: "Đã copy!",
            icon: "success",
            showCancelButton: false,
            timer: 3000,
        }).then(function () {});
    });

    $(document).on('keyup', '#form-email', function(event) {
        event.preventDefault();
        changeNumberLine();
    });
    

    function changeNumberLine() {
        const numberLine = $('#form-email').val().split("\n").length;
        $("#number-line").html(numberLine);
    }

    // ------------ Import excel ------------

    var data_excel = [];
    var percentDone = 0;

    $('#btn-import-from-excel').click(function (e) { 
        e.preventDefault();
        $('.import-excel').css('display', 'flex');

        hideProcess();
        clearUploadingProcess();
    });

    $('.cancel-upload').click(function (e) { 
        e.preventDefault();
        $('.import-excel').css('display', 'none');
    });

    function hideProcess() {
        $('.uploading-process').css('display', 'none');
        $('.import-excel>label,.import-excel>span,.import-excel>.btn').css('display', 'flex');
    }

    function showProcess() {
        $('.uploading-process').css('display', 'flex');
        $('.import-excel>label,.import-excel>span,.import-excel>.btn').css('display', 'none');
    }

    function clearUploadingProcess() {
        setRatioUploadingProcess(0);
        setNumberLine(0);
        $('#log-upload').val('');
        $('.file-name').css('display', 'none');
        $('.file-name').html('');
        percentDone = 0;
    }

    function setNumberLine(number) {
        $('.uploading-process>.number-line').html(number);
    }

    function plusPercent() {
        percentDone++;
        setRatioUploadingProcess(parseInt((percentDone * 100) / data_excel.length));
        if (percentDone == data_excel.length) {
            addLogUploadingProcess('========== Đã hoàn thành ==========');
            swal("Thành công!", "Hoàn tất quá trình tải dữ liệu", "success");
        }
    }

    function setRatioUploadingProcess(percent) {
        $('.uploading-process>.show-ratio>.line').css('width', (100 - percent) + '%');
        $('.uploading-process>.show-ratio>.ratio').html(percent);
    }

    function addLogUploadingProcess(message) {
        let time = new Date();
        let time_now = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
        $('#log-upload').val('[ ' + time_now + ' ] : ' + message + '\n' + $('#log-upload').val());
    }

    $('#import-file-excel').change(function (e) { 
        e.preventDefault();

        // clear data_excel;
        data_excel = [];

        let file = $(this).prop('files')[0];

        // clear file input
        $(this).val('');

        // check file type .xlsx, .xls
        if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        && file.type != 'application/vnd.ms-excel'
        && file.type != 'application/wps-office.xlsx'
        && file.type != 'application/wps-office.xls') {
            swal("Thông báo!", "Vui lòng chọn file excel", "warning");
            $('.file-name').css('display', 'none');
            $('.file-name').html('');
            return;
        }

        // show file name
        $('.file-name').css('display', 'flex');
        $('.file-name').html(file.name);

        // Lấy số dòng của file excel
        let reader = new FileReader();
        reader.onload = function (e) {
            try {
                let data = e.target.result;
                let workbook = XLSX.read(data, { type: 'binary' });
                let sheet_name_list = workbook.SheetNames;
                for (let i = 0; i < sheet_name_list.length; i++) {
                    let worksheet = workbook.Sheets[sheet_name_list[i]];
                    let data = XLSX.utils.sheet_to_json(worksheet);
                    setDataExcel(data, sheet_name_list[i]);
                }
            }
            catch (e) {
                $('.file-name').css('display', 'none');
                $('.file-name').html('');
                swal("Thông báo!", "Không thể đọc nội dung file do sai định dạng", "error");
            }
        }
        reader.readAsBinaryString(file);
    });

    function setDataExcel(data, sheet_name = '') {
        // insert sheet_name to data
        for (let i = 0; i < data.length; i++) {
            data[i].sheet_name = sheet_name;
        }
        // merge into data_excel
        data_excel = data_excel.concat(data);
    }

    $('#uploadEmail').click(function (e) { 
        e.preventDefault();
        
        if (data_excel.length == 0 || data_excel == undefined) {
            swal("Thông báo!", "Chưa có dữ liệu hoặc định dạng nội dung file không hợp lệ", "warning");
            return;
        }

        clearUploadingProcess();
        showProcess();

        addLogUploadingProcess('Đang xử lý dữ liệu...');

        setNumberLine(data_excel.length);
        // send data to server

        callback(0);
    });

    async function callback(index){
        if (index < data_excel.length) {
            let element = data_excel[index];

            var email = element['Email'];
            var cookies = element['Cookies'];
            var authorization = element['Authorization'];
            var sheet_name = element['sheet_name'];

            var stt = index + 1;

            if (email == undefined || cookies == undefined || authorization == undefined) {
                addLogUploadingProcess('Sheet: ' + element['sheet_name'] + ' - STT: ' + stt + ' --> Thiếu dữ liệu');
                plusPercent();
                return callback(index + 1);
            }

            $.ajax({
                url: './admin/emails/create',
                type: 'POST',
                data: {
                    email: email,
                    cookies: cookies,
                    auth: authorization,
                },
                success: function (data) {
                    // data = JSON.parse(data);

                    if (!data.status) {
                        addLogUploadingProcess('Sheet: ' + sheet_name + ' - STT: ' + stt + ' --> ' + data.message);
                    }
                    plusPercent();
                    return callback(index + 1);
                },
                error: function (data) {
                    addLogUploadingProcess('Đã có lỗi xảy ra');
                    plusPercent();
                    return callback(index + 1);
                }
            });
        }
    }

    $('#uploadTwitter').click(function (e) { 
        e.preventDefault();
        
        if (data_excel.length == 0 || data_excel == undefined) {
            swal("Thông báo!", "Chưa có dữ liệu hoặc định dạng nội dung file không hợp lệ", "warning");
            return;
        }

        clearUploadingProcess();
        showProcess();

        addLogUploadingProcess('Đang xử lý dữ liệu...');

        setNumberLine(data_excel.length);
        // send data to server

        callbackTwitter(0);
    });

    async function callbackTwitter(index){
        if (index < data_excel.length) {
            let element = data_excel[index];

            var csrf = element['Csrf'];
            var cookies = element['Cookies'];
            var authorization = element['Authorization'];
            var sheet_name = element['sheet_name'];

            var stt = index + 1;

            if (csrf == undefined || cookies == undefined || authorization == undefined) {
                addLogUploadingProcess('Sheet: ' + element['sheet_name'] + ' - STT: ' + stt + ' --> Thiếu dữ liệu');
                plusPercent();
                return callbackTwitter(index + 1);
            }

            $.ajax({
                url: './admin/twitters/create',
                type: 'POST',
                data: {
                    csrf: csrf,
                    cookies: cookies,
                    auth: authorization,
                },
                success: function (data) {
                    // data = JSON.parse(data);

                    if (!data.status) {
                        addLogUploadingProcess('Sheet: ' + sheet_name + ' - STT: ' + stt + ' --> ' + data.message);
                    }
                    plusPercent();
                    return callbackTwitter(index + 1);
                },
                error: function (data) {
                    addLogUploadingProcess('Đã có lỗi xảy ra');
                    plusPercent();
                    return callbackTwitter(index + 1);
                }
            });
        }
    }
});





// đức văn coder (0587282880)