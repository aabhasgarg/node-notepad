var wsoj= null
$(document).ready(function() {
  wsoj= $.ws.conn({
    url   : "ws://127.0.0.1:8080",
    onopen    : function(e){ 
      console.log("conected");
    },
    onmessage : function(msg,wsoj){
      // Put the code to update the text area if you aren't the client that made the change
    },
    onclose   : function(e){
      console.log("closed");
    }
  });

  $('input#author').keypress(function(){
    $('textarea').attr('readonly', '');
    $('textarea').css('background-color', 'white')
  })

  $('input#author').change(function() {
    wsoj.send($('input#author').val()+":"+$('#input textarea').attr('id')+":"+$('#input textarea').val());  
    $('input#author').attr('readonly', 'readonly');
  })
  var press_ctr= 0
  $('#input textarea').keypress(function() {
    press_ctr += 1;
    if(press_ctr > 5) {
      press_ctr= 0;
      wsoj.send($('input#author').val()+":"+$('#input textarea').attr('id')+":"+$('#input textarea').val());
    }
  })
})
