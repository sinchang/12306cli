'use strict'

module.exports = [
  {
    type: 'input',
    name: 'from_station',
    message: '出发地(必填)',
    validate(value) {
      if (value) {
        return true
      }
      return '请输入出发地'
    }
  },
  {
    type: 'input',
    name: 'to_station',
    message: '目的地(必填)',
    validate(value) {
      if (value) {
        return true
      }
      return '请输入目的地'
    }
  },
  {
    type: 'input',
    name: 'train_date',
    message: '乘车日期(必填格式2018-01-01)',
    validate(value) {
      if (value) {
        return true
      }
      return '请输入乘车日期'
    }
  },
  {
    type: 'checkbox',
    name: 'train_type',
    message: '车次类型(默认全部)',
    choices: ['GC-高铁/城际', 'D-动车', 'Z-直达', 'T-特快', 'K-快速', 'O-其他']
  },
  {
    type: 'list',
    name: 'start_time',
    message: '发车时间',
    choices: ['00:00--24:00', '00:00--06:00', '06:00--12:00', '12:00--18:00', '18:00--24:00']
  }
]
