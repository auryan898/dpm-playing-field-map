// Define a new component called area-input
Vue.component('area-input', {
    props: ['title'],
    template: '#area-input-template',
    data: function () {
        return {
            parts: ["_LL_x","_LL_y","_UR_x","_UR_y"]
        }
    }
})
Vue.component('corner-input', {
    props: ['title'],
    template: '#corner-input-template',
    data: function () {
        return {
            parts: [0,1,2,3]
        }
    }
})
Vue.component('team-input', {
    props: ['title','min','max'],
    template: '#team-input-template',
    data: function () {
        return {
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        title:"area1",
        parts: ["_LL_x","_LL_y","_UR_x","_UR_y"]
    }
})

var playingField = new GridCreator("competition-field",15,9,2);

// Adding new corner markers
playingField.addPointIdentifier("RedCorner","red");
playingField.addPointIdentifier("GreenCorner","green");

// Adding new areas, using 'id'
playingField.addAreaIdentifier("Red","red");
playingField.addAreaIdentifier("Green","green");
playingField.addAreaIdentifier("Island","yellow");
playingField.addAreaIdentifier("TNR","purple");
playingField.addAreaIdentifier("TNG","blue");
playingField.addAreaIdentifier("SZR","red");
playingField.addAreaIdentifier("SZG","green");

// Just a continuously running function to update the tiles
setInterval(function() {
    playingField.updateCanvas();
}, 200);