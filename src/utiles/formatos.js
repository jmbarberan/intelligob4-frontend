export function formatDate(f) {
  var d = new Date(f),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

Number.prototype.format = function(n) {
  var re = "(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')";
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$1,");
};
