var socket =io();
function scrollToBottom() {
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight)
    {
            messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){
    console.log('connected to server');

 
});
socket.on('disconnect', function(){
    console.log('disconnected from server ');
});

socket.on('newMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    template = jQuery('#messageTemplate').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    // console.log('New Message');
    // console.log(JSON.stringify(message, undefined, 2))
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
 
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    template = jQuery('#locationMessageTemplate').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current Location<a/>');
    // li.text(`${message.from}: ${formattedTime}`);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
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
