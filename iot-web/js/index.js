// Create a client instance
// client = new Paho.MQTT.Client("iot.eclipse.org", 80, "/ws", "diegosiena-web");
client = new Paho.MQTT.Client("test.mosquitto.org", 8080, "", "diegosiena-web");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("diegosiena/#");
  // message = new Paho.MQTT.Message("Hello");
  // message.destinationName = "diegosiena";
  // client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived: "+message.destinationName + ' - ' + message.payloadString);

  if (message.destinationName == 'diegosiena/sala/porta') {
    if (message.payloadString == 0) {
      $('#portaSala').text('Aberta')
      $('#portaSala').removeClass('label-primary')
      $('#portaSala').addClass('label-warning')
    } else if (message.payloadString == 1) {
      $('#portaSala').text('Fechada')
      $('#portaSala').removeClass('label-warning')
      $('#portaSala').addClass('label-primary')
    } else {
      console.log('Invalid Value!')
    }
  }

  if (message.destinationName == 'diegosiena/sala/lampada') {
    if (message.payloadString == 0) {
      $('#lampadaSala').removeClass('btn-primary')
      $('#lampadaSala').addClass('btn-default')
    } else if (message.payloadString == 1) {
      $('#lampadaSala').removeClass('btn-default')
      $('#lampadaSala').addClass('btn-primary')
    } else {
      console.log('Invalid Value!')
    }
  }

  if (message.destinationName == 'diegosiena/quarto/lampada') {
    if (message.payloadString == 0) {
      $('#lampadaQuarto').removeClass('btn-primary')
      $('#lampadaQuarto').addClass('btn-default')
    } else if (message.payloadString == 1) {
      $('#lampadaQuarto').removeClass('btn-default')
      $('#lampadaQuarto').addClass('btn-primary')
    } else {
      console.log('Invalid Value!')
    }
  }
}

$( "#lampadaSala" ).click(function() {
  if ($( "#lampadaSala" ).hasClass('btn-default')) {
    message = new Paho.MQTT.Message("1");
    message.destinationName = "diegosiena/sala/lampada";
    message.retained = true;
    client.send(message);
  }

  if ($( "#lampadaSala" ).hasClass('btn-primary')) {
    message = new Paho.MQTT.Message("0");
    message.destinationName = "diegosiena/sala/lampada";
    message.retained = true;
    client.send(message);
  }
});

$( "#lampadaQuarto" ).click(function() {
  if ($( "#lampadaQuarto" ).hasClass('btn-default')) {
    message = new Paho.MQTT.Message("1");
    message.destinationName = "diegosiena/quarto/lampada";
    client.send(message);
  }

  if ($( "#lampadaQuarto" ).hasClass('btn-primary')) {
    message = new Paho.MQTT.Message("0");
    message.destinationName = "diegosiena/quarto/lampada";
    client.send(message);
  }
});
