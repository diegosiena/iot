import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt

GPIO_PORTA_SALA = 22
GPIO_LAMPADA_SALA = 6
GPIO_LAMPADA_QUARTO = 5

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO.setup(GPIO_PORTA_SALA, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
GPIO.setup(GPIO_LAMPADA_SALA, GPIO.OUT)
GPIO.setup(GPIO_LAMPADA_QUARTO, GPIO.OUT)

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("diegosiena/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

    if (msg.topic == "diegosiena/sala/lampada"):
      if (int(msg.payload) == 0):
        GPIO.output(GPIO_LAMPADA_SALA, GPIO.LOW)	

      if (int(msg.payload) == 1):
        GPIO.output(GPIO_LAMPADA_SALA, GPIO.HIGH)	

    if (msg.topic == "diegosiena/quarto/lampada"):
      if (int(msg.payload) == 0):
        GPIO.output(GPIO_LAMPADA_QUARTO, GPIO.LOW)

      if (int(msg.payload) == 1):
        GPIO.output(GPIO_LAMPADA_QUARTO, GPIO.HIGH)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("test.mosquitto.org", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
# client.loop_forever()

PORTA_STATE = GPIO.input(GPIO_PORTA_SALA)

while True:
  client.loop()

  val = GPIO.input(GPIO_PORTA_SALA)
  if(val != PORTA_STATE):
    PORTA_STATE = val
    client.publish("diegosiena/sala/porta", PORTA_STATE)
