var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
$(document).ready(function () {
  $("#prompt").keydown(function (event) {
    console.log("sdd", event.key);
    var id = event.keyCode ? event.keyCode : event.which;
    if (id == "13") {
          $.ajax({
        "type": "POST",
        "data": {
          "title": $("#prompt").val(),
          "csrfmiddlewaretoken": $("meta[name=csrf-token]").attr("content")
        },
        "url": "/todos/task.json"
      }).done(function(data){

      }).fail(function(error){

    });
 }
    //alert("Anadir una tarea");
      escribirTarea([
        {
          id: 1,
          title: "test",
          completed: false
        }
      ])
    })

  function traerTareas() {
    //alert("Traer tareas...");

    $.get("/todos/task.json", function(data) {

      console.log(data);
      escribirTarea(data);

    }).fail(function() {

      alert("error");

    });
  }
  function escribirTarea(tareas) {
    var  _script = '{{#this}}' +
      '<li {{#if completed}}class="completed"{{/if}} data-id="{{ id }}" >' +
      '<div class="view">' +
        '<input class="toggle" type="checkbox" {{#if completed}}checked{{/if}}>' +
        '<label>{{title}}</label>' +
        '<button class="destroy"></button>' +
      '</div>' +
      '<input class="edit" value="{{title}}">' +
    '</li>' +
  '{{/this}}';
    var template = window.Handlebars.compile(_script);
    $(".todo-list").html(template(tareas));
    // Hasta esta linea el contenido ya se muestra en pantalla

    $(".toggle").click(function (event) {
      var $event = $(event.target);
      var task_id = $event.parent().parent();
      $.post("/todos/task/" + task_id.data("id") + "/toggle.json", {
        "csrfmiddlewaretoken": $("meta[name=csrf-token]").attr("content")
      }, function(data) {
        //alert("bien!!");
        traerTareas();
      }).fail(function(err) {
        alert("Error");
      });
    });
    
    $(".todo-list label").dblclick(function (e) {
      var $input = $(e.target).closest("li").addClass("editing").find(".edit");
      // puts caret at end of input
      var tmpStr = $input.val();
      $input.val("");
      $input.val(tmpStr);
      $input.focus();
    });
    $(".todo-list .edit").keyup(function (e) {
      if (e.which === ENTER_KEY) {
        e.target.blur();
      }

      if (e.which === ESCAPE_KEY) {
        $(e.target).data("abort", true).blur();
      }
    });
    $(".todo-list .edit").focusout(function (e) {
      var el = e.target;
      var $el = $(el);
      var val = $el.val().trim();

      if ($el.data("abort")) {
        $el.data("abort", false);
      } else if (!val) {
        alert("eliminar: " + $el.parent().data("id"));
        return;
      } else {
        $.ajax({
          "type": "POST",
          "url": "/todos/task/" + $el.parent().data("id") + "/edit.json",
          "data": { // Esta informacion va al servidor
            "title": val,
            "csrfmiddlewaretoken": $("meta[name=csrf-token]").attr("content")
          } // hasta aqui
        }).done(function() {
          traerTareas();
        }).fail(function() {
          alert("Error");
        });
      }
    });
    $(".todo-list .destroy").click(function (e) {
      var el = e.target;
      var $el = $(el).parent().parent();
      alert("delete: " + $el.data("id"));
    });
  }
  traerTareas(); // llamamos a una funcion
})
