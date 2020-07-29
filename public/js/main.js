// console.log("test");

const baseUrl = location.protocol+"//"+location.hostname+":"+location.port+"/api";

(function($){
    var cardAddHover = function(e) {
        $(this).addClass("active");
    };

    var cardRemoveHover = function(e) {
        $(this).removeClass("active");
    };

    $('.post-card').hover(cardAddHover, cardRemoveHover);


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
        var $errorBox = $('#error-box');
        var $errorTitle = $('#error-title');
        var $errorMessage = $('#error-message');
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
                    $errorBox.addClass('alert-danger show');
                    $errorTitle.html("Error !!!");
                    $errorMessage.html("Something went wrong.")
                }
                $loader.removeClass('d-block');
            },
            success: function(result){
                // console.log(result)
            },
        }).then(function(data) {
            $loader.removeClass('d-block');
            displayMessageList(data);
        });
    };

    getAllMessages();

})(jQuery);

