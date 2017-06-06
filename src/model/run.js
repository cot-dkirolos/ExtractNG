var str = {
  dkirolo: {
    userID: 'dkirolo',
    name: 'David Kirolos',
    groupID: 'super_admin_all_group'
  },
  dkirolos: {
    userID: 'dkirolos',
    name: 'David Kirolos',
    groupID: 'epm_admin_all_group'
  }
};
var enc = window.btoa(JSON.stringify(str));

var res = enc;
document.getElementById("demo").innerHTML = res;
if (document.selection) {
  var range = document.body.createTextRange();
  range.moveToElementText(document.getElementById("demo"));
  range.select();
} else if (window.getSelection) {
  var range = document.createRange();
  range.selectNode(document.getElementById("demo"));
  window.getSelection().addRange(range);
}
document.execCommand("copy");

 var date = new Date();
    // Cookie session timeout to password expiry time from AuthSession API otherwise set to 1 hour

console.log(date);

      date.setTime(date.getTime() + (60 * 60 * 1000));


console.log(date);
