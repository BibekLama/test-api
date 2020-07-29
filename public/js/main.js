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
                        <button class="close text-danger delete-icon" id="delete-button" data-id="${this._id}">
                            <span aria-hidden="true" id="delete-icon">&times;</span>
                        </button>
                        <div class="spinner-border spinner-border-sm delete-loader d-none" id="delete-loader" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div class="card-body" id="post-card-body-${this._id}">
                        <p class="card-text">${value.message}</p>
                    </div>
                    <div class="card-footer text-muted">
                        <small>${moment(moment.utc(value.createdAt), "YYYYMMDD").fromNow()}</small>
                        <i class="fa fa-edit edit-icon" id="edit-button" data-id="${this._id}" data-msg="${this.message}"></i>
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
            type: "GET",
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
                $loader.removeClass('d-block');
            },
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
                $loader.removeClass('d-block');
                getAllMessages();
            },
            error: function(xhr, testStatus, testError){

                $loader.removeClass('d-block');
                if(xhr.status === 500){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("Something went wrong.")
                }
                if(xhr.status === 501){
                    $msgBox.addClass('alert-warning d-block');
                    $msgTitle.html("Warning !!!");
                    $msgContent.html(xhr.responseJSON.error)
                }
                if(xhr.status === 404){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("Not found")
                }
            }
       });
    };

    $( "#add-form" ).submit(function( event ) {
        event.preventDefault();
        addNewMessage($(this).serialize());
        $(this).trigger('reset');
    });

    /****************************************************************************** 
     * Method: DELETE
     * URL: hostname/api/tws/:id
     * params: id (Mongodb Object ID)
     * ****************************************************************************/

    // Delete twit
    var deleteMessage = function(id){
        var $deleteIcon = $('#delete-icon');
        var $loader = $('#delete-loader');

        const deleteUrl = baseUrl+"/tws/"+id;

        $loader.addClass('d-block');

        $.ajax({
            type: "DELETE",
            url: deleteUrl,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function( xhr ) {
                $deleteIcon.addClass('d-none');
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
                $loader.removeClass('d-block');
            },
            success: function(result){
                console.log(result);
                $msgBox.addClass('alert-success d-block');
                $msgTitle.html("Success !!!");
                $msgContent.html(result.message)
                getAllMessages();
                $loader.removeClass('d-block');
            },
        });
    };

    $(document).on('click', '#delete-button', function(){ 
        var id = $(this).attr('data-id');
        // console.log(id);
        deleteMessage(id);
    });

    /****************************************************************************** 
     * Method: PATCH
     * URL: hostname/api/tws/:id
     * params: id (Mongodb Object ID)
     * body: {
     *  "message": "Your message"
     * }
     * ****************************************************************************/

     // Edit message

    var updateMessage = function(id, data) {
        var $loader = $('#edit-loader-'+id);

        const editUrl = baseUrl+"/tws/"+id;

        console.log(data);

        $.ajax({
            type: "PATCH",
            url: editUrl,
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: function( xhr ) {
                $loader.addClass('d-block');
            },
            error: function(xhr, status, error){
                if(xhr.status === 500){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("Something went wrong.")
                }
                if(xhr.status === 501){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html(error);
                }
                if(xhr.status === 404){
                    console.log(xhr.responseJSON);
                    $msgBox.addClass('alert-danger d-block');
                    $msgTitle.html("Error !!!");
                    $msgContent.html("API url not found")
                }
                $loader.removeClass('d-block');
            },
            success: function(result){
                console.log(result);
                $msgBox.addClass('alert-success d-block');
                $msgTitle.html("Success !!!");
                $msgContent.html(result.message)
                $loader.removeClass('d-block');
                $cardBody = $('#post-card-body-'+id);
                $cardBody.html('<p class="card-text">'+data.message+'</p>');
            },
        });
    };

    $(document).on('click', '#edit-button', function(){ 
        var id = $(this).attr('data-id');
        var msg = $(this).attr('data-msg');
        // console.log(id);
        $cardBody = $('#post-card-body-'+id);
        $cardBody.html(`
            <form action="#">
                <div class="form-group">
                    <textarea class="form-control message-box" name="message" id="message-${id}"
                        placeholder="Write your twitt!" rows="2">${msg}</textarea>
                </div>
                <button type="button" class="btn btn-danger edit-btn rounded-pill btn-sm" id="edit-cancel-button" data-id="${id}" data-msg="${msg}">Cancel</button>
                <button type="button" class="btn btn-primary edit-btn rounded-pill btn-sm mr-3" id="edit-form-button" data-id="${id}">
                    <div class="spinner-border spinner-border-sm mr-2 d-none" id="edit-loader-${id}" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>  
                    Edit
                </button>               
            </form>
        `);
    });

    $(document).on('click', '#edit-cancel-button', function(){ 
        var id = $(this).attr('data-id');
        var msg = $(this).attr('data-msg');
        $cardBody = $('#post-card-body-'+id);
        $cardBody.html('<p class="card-text">'+msg+'</p>');
    });

    $(document).on('click', '#edit-form-button', function(){ 
        var id = $(this).attr('data-id');
        var data = {
            message : $('#message-'+id).val()
        };
        updateMessage(id, data);
        $(this).trigger('reset');
    });


})(jQuery);

