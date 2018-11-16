/*global $ */
var photosList = [];


const isAlphaNumeric = ch => {
	return ch.match(/^[a-z0-9]+$/i) !== null;
}

$(document).ready(function() {
    console.log("Document ready");
    $.getJSON('photos', updatePhotos);
    
    // upload image
    // get images
    // find images by user
    // Have bar to show comments
    // Post Comments
    // Post comment on image (in new frame)
    
/*setInterval(function() {
        console.log('Interval');
        $.getJSON('photos', updatePhotos);
    }, 5000);*/
    
    $('#submit-image').click(postNewPhoto);
    
});


// Update Photos grabs all images
var updatePhotos = function(data) {
    console.log("Updating photos");
    console.log(data);
    $('#photo-display').html('Updating');
    var photoDisplay ='';
    for (var photo in data) {
        var photoName = data[photo].PhotoName;
        for (var i = 0; i < photoName.length; i++) {
            if (photoName[i] === ' ') {
                photoName[i] = '-';
            }
        }
        
        photoDisplay += '<img src="'+data[photo].PhotoURL+'" />'
                     + '<br /><cite>'+data[photo].PhotoName+'</cite>'
                     + '<br /><button id="'+data[photo].PhotoName+'"> Show Comments </button>'
                     + '<br /><span id="'+data[photo].PhotoName+'-span"></span><hr />';
    }
    $('#photo-display').html(photoDisplay);
    
    photosList = data;
    
    for (var photo in data) {
        console.log('#'+data[photo].PhotoName);
        showCommentBut(data[photo].PhotoName);
    }
};

// Show comments from a user
var showCommentBut = function(photoName) {
    console.log(photoName +'!');
    var photo = {};
    $('#'+photoName).click(function() {
        var CommentHTML = '<ol>';
        for (var i in photosList) {
            if (photoName === photosList[i].PhotoName) {
                for (var j in photosList[i].Comments) {
                    CommentHTML += '<li>' + photosList[i].Comments[j].Comment
                                + '<br /> -&nbsp;' + photosList[i].Comments[j].User + '</li>';
                }
            }
        }
        
        CommentHTML += '</ol><button id='+photoName+'-hide>Hide Comments</button>';
        console.log('#'+photoName+'-span');
        $('#'+photoName+'-span').html(CommentHTML);
        hideComments(photoName);
    });
}

var hideComments = function(photoName) {
    $('#'+photoName+'-hide').click(function(event) {
        event.preventDefault();
        $('#'+photoName+'-span').html('');
    });
}
    
var postNewPhoto = function(event) {
    event.preventDefault();
    var imageURL = $('#image-url').val();
    var imageName = $('#image-name').val();
    var userName = $('#user-name').val();
    var comment = $('#comment').val();
    var addImage = true;

    if (imageURL === '') {
        alert('Please fill out field for Image URL');
        addImage = false;
    }
    if (imageName === '') {
        alert('Please fill out field for Image Name');
        addImage = false;
    }
   if (userName === '') {
        alert('Please fill out field for User Name');
        addImage = false;
    }
    
    if (addImage) {
        for (var i = 0; i < imageName.length; i++) {
            if (!(isAlphaNumeric(imageName))) {
                alert("Illegal characters used. Please use only Alpha-Numeric characters.");
                addImage = false;
            }
        }
    }
    
    // Check for duplicate photo names. If none, add.
    if (addImage) {
        $.getJSON('photos', function(data) {
            var addImage = true;
            for (var photo in data) {
                if (imageName === data[photo].PhotoName) {
                    alert('Image Name is already in use. Please choose a different name.');
                    addImage = false;
                }
            }
            if (addImage) {
                var newImage = {
                    PhotoName: imageName,
                    PhotoURL: imageURL,
                    Comments: [{User:userName, Comment:comment}]
                };
                sendImage(newImage);
            }
        });
    }
}

function sendImage(newImage) {
    console.log(newImage);
    var jobj = JSON.stringify(newImage);
    $.ajax({
        url: 'photos',
        type: 'POST',
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            alert('Image added successfuly');
        }
    })
};