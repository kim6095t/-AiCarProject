// ESP32 has two cores: APPlication core and PROcess core (the one that runs ESP32 SDK stack)
#define APP_CPU 1
#define PRO_CPU 0

#include <ArduinoJson.h>
#include <string>
#include <WiFi.h>
#include <WebServer.h>
#include <WiFiClient.h>
#define CAMERA_MODEL_AI_THINKER

#include "src/OV2640.h"
#include "camera_pins.h"

#define WIFI_MAX_SIZE 30 //최대 30개의 AP 목록만 받아온다. 
const char* ssid = "AIKit(15)"; 
const char* password = "12345678";
//char Signal='P';
bool isWork;

IPAddress ip;
WebServer server(80);

#define motorpin1 12
#define motorpin2 2

OV2640 cam;


// ===== rtos task handles =========================
// Streaming is implemented with 3 tasks:
TaskHandle_t tMjpeg;   // handles client connections to the webserver
TaskHandle_t tCam;     // handles getting picture frames from the camera and storing them locally
TaskHandle_t tStream;  // actually streaming frames to all connected clients

// frameSync semaphore is used to prevent streaming buffer as it is replaced with the next frame
SemaphoreHandle_t frameSync = NULL;

// Queue stores currently connected clients to whom we are streaming
QueueHandle_t streamingClients;

// We will try to achieve 25 FPS frame rate
const int FPS = 14;

// We will handle web client requests every 50 ms (20 Hz)
const int WSINTERVAL = 100;

// ==== SETUP method ==================================================================
void setup()
{
  Serial.begin(115200);
  delay(1000); // wait for a second to let Serial connect
  isWork=false;
  
  //pinMode(Power1, OUTPUT);
  //pinMode(Power2, OUTPUT);
  pinMode(motorpin1, OUTPUT);
  pinMode(motorpin2, OUTPUT);
  pinMode(4, OUTPUT);
  digitalWrite(motorpin1,LOW);  // 접속 해제 및 재 연결 시 바퀴 굴러가는 것 방지
  digitalWrite(motorpin2,LOW);
  digitalWrite(4,LOW);
  
  
  // Configure the camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  config.frame_size = FRAMESIZE_QVGA;
  config.jpeg_quality = 10;
  config.fb_count = 1;
  

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("카메라 초기화 실패");
    while(1);//카메라 초기화 실패한 경우 정지
  }
  else{
    Serial.printf("카메라 초기화 성공");
  }


  WiFi.softAP(ssid, password); 
  IPAddress myIP = WiFi.softAPIP(); 
  Serial.print("AP IP address: "); 
  Serial.println(myIP); 
  

  server.begin(); 
  Serial.println("HTTP server started");
  digitalWrite(4,HIGH); // 연결 확인 깜박임
  delay(200);
  digitalWrite(4,LOW);
  delay(200);
  digitalWrite(4,HIGH);
  delay(200);
  digitalWrite(4,LOW);
  delay(200);
  
  
  // Start mainstreaming RTOS task
  xTaskCreatePinnedToCore(
    mjpegCB,
    "mjpeg",
    4 * 1024,
    NULL,
    2,
    &tMjpeg,
    APP_CPU);
}


void loop() {
}
