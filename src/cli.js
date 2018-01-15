#!/usr/bin/env node

'use strict'

const updateNotifier = require('update-notifier')
const inquirer = require('inquirer')
const Table = require('cli-table2')
const logUpdate = require('log-update')
const cac = require('cac')
const pkg = require('../package.json')
const questions = require('./question')
const request = require('./request')
const stationName = require('./stationName')
const cli = cac()

updateNotifier({
  pkg
}).notify()

const time2num = v => {
  return Number(v.replace(':', ''))
}

const defaultCommand = cli.command('*', {
  desc: '查询余票'
}, (input, flags) => {
  ;(async () => {
    const answers = await inquirer.prompt(questions)
    const main = async () => {
      const options = {
        'leftTicketDTO.train_date': answers.train_date,
        'leftTicketDTO.from_station': stationName[answers.from_station].id,
        'leftTicketDTO.to_station': stationName[answers.to_station].id,
        'purpose_codes': 'ADULT'
      }

      try {
        const ret = await request(options)
        // instantiate
        const table = new Table({
          head: ['车次', '出发站\n到达站', '出发时间\n到达时间', '历时', '商务座\n特等座', '一等座', '二等座', '高级软卧', '软卧', '动卧', '硬卧', '软座', '硬座', '无座', '其他', '备注']
        })

        ret.data.result.forEach(item => {
          const arr = item.split('|')

          // 筛选车次类型
          if (answers.train_type.length > 0) {
            let trainTypeArray = []
            answers.train_type.forEach(item => {
              if (item === 'GC-高铁/城际') {
                trainTypeArray.push('G', 'C')
              } else {
                trainTypeArray.push(item.split('-')[0])
              }
            })

            if (trainTypeArray.indexOf(arr[3][0]) === -1) {
              return false
            }
          }

          // 筛选出发时间
          const startTimeArray = answers.start_time.split('--')

          if (!(time2num(startTimeArray[0]) <= time2num(arr[8]) && time2num(arr[8]) <= time2num(startTimeArray[1]))) {
            return false
          }

          const from = (arr[6] === arr[4] ? '始 ' : '过 ') + ret.data.map[arr[6]]
          const to = (arr[7] === arr[5] ? '终 ' : '过 ') + ret.data.map[arr[7]]
          const remark = arr[1].replace(/<br\/>/g, '')
          const startTime = arr[8].split(':')
          const takeTime = arr[10].split(':')
          // 次日到达、当日到达判断
          let endStatus = '当日'
          let hour = parseInt(startTime[0], 10) + parseInt(takeTime[0], 10)

          if (parseInt(startTime[1], 10) + parseInt(takeTime[1], 10) > 60) {
            hour = hour + 1
          }

          if (hour >= 24 && hour < 48) {
            endStatus = '次日'
          } else if (hour >= 48 && hour < 72) {
            endStatus = '两日'
          } else if (hour >= 72) {
            endStatus = '三日'
          }

          endStatus = endStatus + '到达'

          table.push([arr[3], from + '\n' + to, arr[8] + '\n' + arr[9], arr[10] + '\n' + endStatus, arr[32], arr[31], arr[30], arr[21], arr[23], arr[33], arr[28], arr[24], arr[29], arr[26], arr[22], remark])
        })
        logUpdate(table.toString())
      } catch (e) {
        logUpdate(e.stack)
      }
    }

    // auto refresh every 5 seconds
    main()

    if (flags.refresh) {
      setInterval(() => {
        main()
      }, typeof(flags.refresh) === 'boolean' ? 5000 : flags.refresh)
    }
  })()
})

defaultCommand.option('refresh', {
  desc: 'Refresh interval, default 5000(5s)'
})

cli.parse()
