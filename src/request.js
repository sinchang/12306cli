'use strict'

const axios = require('axios')
const querystring = require('querystring')
const isObject = require('lodash.isobject')
const ora = require('ora')

module.exports = options => {
  if (!isObject(options)) throw new Error(`options type must be object`)

  const BASE_URI = 'https://kyfw.12306.cn/otn/leftTicket/queryZ?'
  const spinner = ora('查询中……').start()

  setTimeout(() => {
    spinner.text = '查询中……'
  }, 1000)

  return axios.get(`${BASE_URI}${querystring.stringify(options)}`, {
      headers: {
        'Referer': 'https://kyfw.12306.cn/otn//leftTicket/init',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'Cookie': ''
      }
    }).then(res => {
      spinner.stop()
      return Promise.resolve(res.data)
    })
    .catch(err => {
      spinner.stop()
      return Promise.reject(err)
    })
}
