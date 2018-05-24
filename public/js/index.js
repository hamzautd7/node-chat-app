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
    var messageTextBox = jQuery('[name = message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function(){
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#sendLocation');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by Browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
        });
    },function(){
        alert('Location not found');
        locationButton.removeAttr('disabled').text('Send Location');
    });
});
