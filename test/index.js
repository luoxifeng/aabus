const AABus = require('../src/index')

var aaBus = new AABus()

aaBus.answer('test', (info, done) => {
  setTimeout(() => done(1), 2000)
})

aaBus.answer('test', (info, done) => {
  setTimeout(() => done(2), 1000)
})

aaBus.answer('test', (info, done) => {
  setTimeout(() => done(3), 3000)
})

aaBus.askEveryOne('test', (res) => {
  console.log(res)
})

aaBus.askAll('test', (res) => {
  console.log(res)
})

aaBus.askRace('test', (res) => {
  console.log(res)
})