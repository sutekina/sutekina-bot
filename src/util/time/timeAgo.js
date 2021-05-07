module.exports = (time) => {
    let days = ~~(time / 86400);
    let hrs = ~~(time % 3600);
    let mins = ~~((time % 3600) / 60);
    
    let res = `${(days > 0) ? days + "d " : ""}${(hrs > 0) ? hrs + "h " : ""}${(mins < 10) ? "0" : ""}${mins}m`;
    return res;
}