var wsoj= null
$(document).ready(function() {
  wsoj= $.ws.conn({
    url   : "ws://127.0.0.1:8080",
    onopen    : function(e){ 
      console.log("conected");
    },
    onmessage : function(msg,wsoj){
      console.log(msg)
    },
    onclose   : function(e){
      console.log("closed");
    }
  });

  var press_ctr= 0
  $('#input textarea').keypress(function() {
    press_ctr += 1;
    if(press_ctr > 5) {
      wsoj.send($('#input textarea').attr('id')+":"+$('#input textarea').val())
    }
  })
})
