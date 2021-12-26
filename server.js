const express = require('express');
const uygulama = express();
const sunucu = require('http').createServer(uygulama);
const socket = require('socket.io');
const io = require('socket.io')(sunucu, {
   cors: {
      origin: "*"
   }
});

uygulama.use(express.static(__dirname + '/index.html'));
uygulama.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

sunucu.listen(80);

var aktif = 0;
var $baglananIP = [];
io.on('connection', function (socket) {
   var $liveIpAddress = socket.handshake.address;
   if (!$baglananIP.hasOwnProperty($liveIpAddress)) {
      $baglananIP[$liveIpAddress] = 1;
      aktif++;
      socket.emit('aktif', { aktif: aktif });
   }
   console.log("Bir kişi bağlandı, bağlanan kişinin IP adresi: " + $liveIpAddress);
   console.log("Aktif kişi sayısı: " +aktif);
   socket.on('disconnect', function () {
      if ($baglananIP.hasOwnProperty($liveIpAddress)) {
         delete $baglananIP[$liveIpAddress];
         aktif--;
         socket.emit('aktif', { aktif: aktif });
         console.log("Bir kişi ayrıldı, ayrılan kişinin IP adresi: " + $liveIpAddress);
         console.log("Aktif kişi sayısı: " + aktif);
      }
   });
});
