
/**
 * Created by Wallee on 24.01.2017.
 */
function add() {
    var input = escapeHtml($('#autoComplete').val());
    if (input != "") {
        console.log(input);


        $.ajax({
            url: 'http://localhost:3005/q/' + input,
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                console.log(data);
                printTasks(data);
            }
        });
    }
    $('#autoComplete').val("");
}

function printTasks(data) {
    $('#list').empty();

    for (var i = 0; i < data.matches.length; i++){
       $('#list').append("<li class='li-li'>" + data.matches[i] + "</li>");
    }
}

$(document).ready(function(){
    $('#autoComplete').keyup(function (event) {
        if(event.keyCode == 13) add();
    });

    $(document).on("click", ".li-li", selectLi);
});

function selectLi(event) {
    console.log(event.target.innerText);
    $(".selected-tags").append("#" + event.target.innerText + ", " );

}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}



