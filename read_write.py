import RPi.GPIO as GPIO
import time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

#GPIO BOTÃO
GPIO.setup(22, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
#GPIO LED
GPIO.setup(6, GPIO.OUT)

while True:
  value = GPIO.input(22)
  print(value)
  GPIO.output(6, value)
  time.sleep(0.5)
