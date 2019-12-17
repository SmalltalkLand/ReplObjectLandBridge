function send(id,m,callback,target){
  var t = target || window;
t.postMessage({id: id,type: m.type,data: m.data},'*');
t.addEventListener('message',function a (evt){if(evt.data.id == id){callback(evt); t.removeEventListener('message',a)}})

}
var linkVue;
function getConsoleControl(e){
  var myListener, otherListener;
  e.data.data.addEventListener('message',otherListener = linkVue.console.postMessage.bind(linkVue.console));
linkVue.console.addEventListener('message',myListener = e.data.data.postMessage.bind(e.data.data));
e.data.data.addEventListener('message',function a(evt){if(evt.data.type == 'deactivate'){e.data.data.removeEventListener('message',otherListener); e.data.data.removeEventListener('message',a); linkVue.console.removeEventListener('message',myListener)}})

}
window.addEventListener('message',function(e){
if(linkVue && linkVue.console && e.data.type == 'getConsoleControl'){
return getConsoleControl(e)
}

});
var otherVue;
linkVue = new Vue({
el: '#app',
data: {console: undefined},
methods: {init: function(callback){send.call(undefined,'init-' + window.location,{data: {elemID: this.$el.id}},callback)}},
mounted(){var oldID = this.$el.id;var newID = this.$el.id = 'ol-repl-' + (Math.random() * 200000000); this.init((function(mevt){this.$el.id = oldID; otherVue.attach(mevt.data.token); send('getConsole-'+ (Math.random() * 200000000),{type: 'getConsole',data: {token: mevt.data.token}},function(e){this.console = e.data.console}.bind(this)); send('bry-' + (Math.random() * 200000000),{token: mevt.data.token,bryScript: 'main.py'},function(e){})}).bind(this))},

});
otherVue = new Vue({
el: '#controls',
data: {debug: false},
methods: {attach(theToken){
this.$on('debugChange',function(d){send.call(undefined,'debugChange-' + (Math.random() * 200000000),{debug: d,token: theToken})});
window.addEventListener('message',(function(mevt){if(mevt.data.type == 'debugChanged')this.debug = mevt.data.data}).bind(this))
},changedDebug(){
this.$emit("debugChange",this.debug = !this.debug)

}},

})