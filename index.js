const request = require("request-promise-native");
//https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH000001&begin=1534570582468&period=day&type=before&count=-3000&indicator=kline,ma,macd,kdj,boll,rsi,wr,bias,cci,psy
const allData = require("./kline.json");
// console.log(allData);
// console.log(allData.data.item);
function makeDay(column, day) {
    const ret = {};
    column.forEach((key, i) => {
        ret[key] = day[i];
    });
    return ret;
}
allData.data.item = allData.data.item.map(item => {
    return makeDay(allData.data.column, item);
});
const all = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
};
[1, 2, 3, 4, 5].forEach(day => {
    all[day] = {
        rise: 0,
        drop: 0,
        sum: 0
    };
});

let longestRise = 0;
let longestDrop = 0;
let rise = 0;
let drop = 0;
let maxRise = 0;
let maxDrop = 0;
let sections = [[], []];
let continous = [[], []];
for (let i = 0; i < 10; i++) {
    sections[0][i] = 0;
    sections[1][i] = 0;
}
let temp = [0, 0];
let continousCount = [];

allData.data.item.forEach((v, i) => {
    if (v.percent > 0) {
        v.v = 1;
    } else {
        v.v = -1;
    }
});

let currentV = null;
allData.data.item.forEach((v, i) => {
    if (v.v === currentV) {
        continousCount[continousCount.length - 1] += v.v;
    } else {
        continousCount.push(v.v);
    }
    currentV = v.v;
});
const continousCountStr = continousCount.join(",");

function testSeries(series) {
    const reg = new RegExp("," + series.slice(0, -1) + ",[\\d-]+", "g");

    const result = {
        toggle: 0,
        keep: 0
    };
    continousCountStr.match(reg).forEach(all => {
        let num = all.match(/,([\d-]+)$/);
        const target = Math.abs(series.slice(-1)[0]);
        num = Math.abs(num[1] * 1);
        if (num >= target) {
            if (target === num) {
                result.toggle++;
            } else {
                result.keep++;
            }
        }
    });
    return result;
}
console.log(testSeries([-1, 1, -1, 2, -1, 2]));

// allData.data.item.forEach((day,i) => {
//     // console.log(day)
//     const date = new Date(day.timestamp);
//     // console.log(date.getDay(),day.percent);
//     if (day.percent > 0) {
//         if(!continous[1][drop]){
//             continous[1][drop]=0;
//         }
//         continous[1][drop]++;
//         if(drop===5){
//             const percent=allData.data.item[i+1].percent;
//             if(percent>0){
//                 temp[0]+=percent;
//             }else{
//                 temp[1]+=percent;
//             }
//         }
//         drop = 0;
//         rise++;
//         if (rise > longestRise) {
//             longestRise = rise;
//         }
//         all[date.getDay()].rise++;
//         if (day.percent > maxRise) {
//             maxRise = day.percent;
//         }
//         sections[0][Math.floor(day.percent)]++;

//     } else {
//         if(!continous[0][rise]){
//             continous[0][rise]=0;
//         }
//         continous[0][rise]++;

//         drop++;
//         rise = 0;
//         if (drop > longestDrop) {
//             longestDrop = drop;
//         }
//         if (day.percent < maxDrop) {
//             maxDrop = day.percent;
//         }
//         all[date.getDay()].drop++;
//         sections[1][-Math.ceil(day.percent)]++;
//     }
//     all[date.getDay()].sum += day.percent;
//     // all[date.getDay()]+=day.percent>0?1:0
// });
// console.log(all, longestRise,longestDrop , maxRise, maxDrop);
// console.log(sections);
// console.log(continous);
// console.log(temp)
