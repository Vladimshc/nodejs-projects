function countTask() {
   var tasks = $('.task');
   var count = 0;
   for (var i = 0; i < tasks.length; i++) {
       var reg = /(false)/g;
       var testClass = tasks[i].className;
       var test = reg.test(testClass);
       if (test){
           count++;
       } else {
           // do nothing
       }
   }
   $('#count-tasks').append(count);
}

$(document).ready(function () {
    $(document).on("click", ".close", delTask);
    $(document).keyup(function (event) {
        if(event.keyCode == 27) location.reload();
    });
    $('#input').keyup(function (event) {
        if(event.keyCode == 13) add();
    });
    $(document).on("dblclick", ".task", edit);
    $(document).on("click", ".check-box", toggle);
    $("#list").sortable();
    $(document).on("mouseup", ".ui-sortable-helper", moveTask);
    countTask();
});

function add() {
    if (input != "") {
        var position = function (){
            var result;
            var positions = [];
            var arr = [];
            arr = $(".task");
            for (var j = 0; j < arr.length; j++){
                positions.push(Number(arr[j].attributes[2].value))
            }
            if (positions.length === 0) {
                return 0;
            }
            if (positions.length === 1) {
                return 1;
            }
            if (positions.length > 1) {
                positions.sort(function (a, b) {
                    if (a > b) return -1;
                    if (a < b) return 1;
                });
                return positions[0] + 1;
            }
        }();
        var input = escapeHtml($('#input').val());
        var xhr = new XMLHttpRequest();
        var body = 'task=' + encodeURIComponent(input) +
            '&completed=' + encodeURIComponent(false) +
            '&position=' + encodeURIComponent(position);
        xhr.open("POST", '/insert', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
        $('#input').val("");
    }
    setTimeout(location.reload(), 1500);
}

function delTask(event) {
    var id =  event.target.attributes.data_id.value;
    console.log(id);
    var xhr = new XMLHttpRequest();
    var body = 'id=' + encodeURIComponent(id);
    xhr.open("POST", '/delete', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    setTimeout(location.reload(), 1500);
}

function edit(event) {
    var str = event.target.innerText.toString().slice(0, -2);
    var id =  event.target.id;
    $("#" + id).html("")
        .html("<input type=\"text\" class=\"edit-box\" value=\"" + str + "\" />")
        .unbind('dblclick', edit);

    $(("#" + id)).keyup(function (event) {
        if(event.keyCode == 13) {
            var task = escapeHtml($(".edit-box")[0].value);
            var xhr = new XMLHttpRequest();
            var body = 'task=' + encodeURIComponent(task)+
                '&id=' + encodeURIComponent(id);
            xhr.open("POST", '/update', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(body);
            setTimeout(location.reload(), 1500);
        }
    });
}

function toggle(event) {
    var id =  event.target.attributes.data_id.value;
    var className = event.toElement.offsetParent.className;
    var task = event.toElement.parentElement.innerText.slice(0, -2);
    if(className.substr(5, 4) === "done") {
        var xhr = new XMLHttpRequest();
        var body = 'completed=' + encodeURIComponent(false)+
                    '&task=' + encodeURIComponent(task)+
                    '&id=' + encodeURIComponent(id);
        xhr.open("POST", '/update', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
        setTimeout(location.reload(), 1500);
    } else {
        var xhr = new XMLHttpRequest();
        var body = 'completed=' + encodeURIComponent("done")+
            '&task=' + encodeURIComponent(task)+
            '&id=' + encodeURIComponent(id);
        xhr.open("POST", '/update', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
        setTimeout(location.reload(), 1500);
    }
}

function clearCompleted() {
    var dones = $('.done');
    var delDone = [];

    for (var i = 0; i < dones.length; i++){
        var data = {};
        data.id = dones[i].id;
        delDone.push(data);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/deldone', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(delDone));
    setTimeout(location.reload(), 1500);
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


function moveTask() {
    setTimeout(afterMove, 1500);
    function afterMove() {
        var windowData = [];
        var arr = $('.task');
        for (var i = 0; i < arr.length; i++){
            var data = {};
            data.id = arr[i].id;
            data.task = arr[i].innerText;
            data.completed = false;
            data.position = Number(arr[i].attributes[2].value);

            var reg = /(done)/g;
            var testClass = arr[i].className;
            var test = reg.test(testClass);
            if (test){
                data.completed = true;
            } else {
                // do nothing
            }
            windowData.push(data);
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/moveup', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(windowData));
    }
}

function allTask() {
    location.reload();
}

function active() {
    var tasks = $('.done').removeClass('done').addClass('display-none')
}

function complet() {
    var tasks = $('.false').addClass('display-none')
}

