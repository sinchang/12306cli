const stationName = require('./station_name')
const fs = require('fs')
const path = require('path')

const ret = {}
const stationNameArr = stationName.split('@')

stationNameArr.forEach((stations, index) => {
    if (index === 0) return false

    const station = stations.split('|')

    ret[station[1]] = {
      id: station[2],
      chinese: station[1],
      pinyin: station[3],
      index: station[5]
    }
})

fs.writeFileSync(path.resolve('src/stationName.js'), JSON.stringify(ret))

