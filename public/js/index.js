var socket =io();
socket.on('connect', function(){
    console.log('connected to server');

 
});
socket.on('disconnect', function(){
    console.log('disconnected from server ');
});

socket.on('newMessage', function(message){
    console.log('New Message');
    console.log(JSON.stringify(message, undefined, 2))
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`)
    console.log(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location<a/>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#messageForm').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name = message]').val()
    }, function(){

    });
});

var locationButton = jQuery('#sendLocation');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by Browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
       
        socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
        });
    },function(){
        alert('Location not found');
    });
});
// const locationButton = jQuery('#sendLocation');
// locationButton.on('click', () => {
 
//  if (!navigator.geolocation) {
//  return alert('Geo location not supported by your browser');
//  }
//  navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
//  navigator.geolocation.getCurrentPosition((position) => {
//  console.log('ay');
//  console.log(position);
//  }, (err) => {
//  alert('Unable to fetch location');
//  }, {
//  maximumAge: 60000,
//  timeout: 10000,
//  enableHighAccuracy: true
//  });
// });