// console.log("test");

const baseUrl = location.protocol+"//"+location.hostname+":"+location.port+"/api";


var $msgBox = $('#msg-box');
var $msgTitle = $('#msg-title');
var $msgContent = $('#msg-content');

(function($){
    var cardAddHover = function(e) {
        $(this).addClass("active");
    };

    var cardRemoveHover = function(e) {
        $(this).removeClass("active");
    };

    $('.post-card').hover(cardAddHover, cardRemoveHover);


    /******************************************************************************
     * Method: GET
     * URL: hostname/api/tws
     * ****************************************************************************/

    // Display all message list

    var displayMessageList = function(data){
        $messageListBox = $('#message-list-box');
        $messageListBox.html("");
        $.each( data, function( key, value ) {
            $messageListBox.append(`
                <div class="card col-12 mb-4 p-0 shadow post-card">
                    <div class="card-header">
                        <div class="header-left">
                            <div class="avatar">
                                <img src="/images/profile.jpg" class="rounded" alt="Avatar" />
                            </div>
                            <h5>User</h5>
                        </div>
                        <a href="/tws/delete/{{this._id}}" class="close text-danger" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </a>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${value.message}</p>
                    </div>
                    <div class="card-footer text-muted">
                        <small>${moment(moment.utc(value.createdAt), "YYYYMMDD").fromNow()}</small>
                        <a href="/tws/action/edit/id"><i class="fa fa-edit"></i></a>
                    </div>
                </div>
            `);
        });
    };

    // Get all messages from api
    
    var getAllMessages = function(){
        const messagesUrl = baseUrl+"/tws";
        var $loader = $('#message-loading');
        $.ajax({
            url: messagesUrl,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function( xhr ) {
                $loader.addClass('d-block');
            },
            error: function(xhr){
                if(xhr.status === 500){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("Something went wrong.")
                }
                if(xhr.status === 404){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("API url not found")
                }
                $loader.removeClass('alert-danger d-block');
            },
            success: function(result){
                displayMessageList(result);
            },
        }).then(function(data) {
            $loader.removeClass('d-block');
        });
    };

    getAllMessages();

    /****************************************************************************** 
     * Method: POST
     * URL: hostname/api/tws
     * body : {
     *      "message": "Your message"
     * }
     * ****************************************************************************/

    // Add new twit
    var addNewMessage = function(data){
        const addUrl = baseUrl+"/tws";
        var $loader = $('#add-loader');
        $.ajax({
            type: "POST",
            url: addUrl,
            data: data,
            dataType: 'json',
            beforeSend: function( xhr ) {
                $loader.addClass('d-block');
            },
            success: function(result) {
                console.log(result);
                $msgBox.addClass('alert-success d-block');
                $msgTitle.html("Success !!!");
                $msgContent.html(result.message);
            },
            error: function(xhr){
                $loader.removeClass('d-block');
                if(xhr.status === 500){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("Something went wrong.")
                }
                if(xhr.status === 501){
                    console.log(xhr.responseJSON);
                    var error = xhr.responseJSON.error;
                    $msgBox.addClass('alert-warning d-block');
                    $msgTitle.html("Warning !!!");
                    $msgContent.html(error)
                }
                if(xhr.status === 404){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("Not found")
                }
            }
       }).then(function(data){
            // console.log(data)
            $loader.removeClass('d-block');
            getAllMessages();
       });
    };

    $( "#add-form" ).submit(function( event ) {
        event.preventDefault();
        addNewMessage($(this).serialize());
        $(this).trigger('reset');
    });

})(jQuery);

