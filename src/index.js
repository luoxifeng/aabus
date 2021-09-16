const getDefaultAnswer = () => ({ roundId: -1, acks: [] })

const getAnswer = (target, id) => (target[id] = target[id] || getDefaultAnswer())

module.exports = class AABus {

  constructor() {
    this.answers = {}
  }

  afa(blocked) {
    const aaBus = new AABus()
    aaBus.answers = this.answers
    aaBus._blocked = blocked
    return aaBus
  }

  askFirstOne(id, info, accept) {

  }

  askLastOne(id, info, accept) {

  }

  askSomeOne(id, info, accept) {

  }

  askEveryOne(id, info, accept) {
    if (typeof info === 'function') {
      accept = info
    }
    let roundId = -1,
      length;
    const answer = getAnswer(this.answers, id)
    const _acks = [].concat(answer.acks)
    const goOn = (acks = _acks) => {
      if (length = acks.length) {
        roundId = ++answer.roundId;
        let i = 0
        for (let index = 0; index < length; index++) {
          acks[index](info, data => accept({ 
            id,
            roundId,
            index,
            data,
            done: ++i === length
          }));
        }
      } else {
        accept({ id, roundId: -1, index: -1 });
      }
    }
    this._blocked ? this._blocked(_acks, goOn) : goOn()
  }

  askOneByOne(id, info, accept) {
    const type = 'askRace'
    if (typeof info === 'function') {
      accept = info
    }
    let roundId = -1,
      acks,
      length,
      answer;
    if (
      (answer = this.answers[id]) &&
      (acks = answer.acks) &&
      (length = acks.length)
    ) {
      roundId = ++answer.roundId;
      (function next(preDatas, index) {
        index < length && acks[index](info, data => {
          const result = { 
            id,
            roundId,
            type,
            index,
            data,
            preData: preDatas[preDatas.length -1],
            preDatas,
            allDatas() {
              return [...this.preDatas, this.data]
            },
          }
          index++
          accept(result, {
            done: index === length,
            next: () => next([...preDatas, data], index)
          })
        });
      })([], 0)
    } else {
      accept({ id, roundId: -1, type });
    }
  }

  askOneByOneReverse() {

  }

  askOneByOneRadom() {
    
  }

  askAll(id, info, accept) {
    if (typeof info === 'function') {
      accept = info
    }
    let roundId = -1,
      acks,
      length,
      answer;
    if (
      (answer = this.answers[id]) &&
      (acks = answer.acks) &&
      (length = acks.length)
    ) {
      const data = [];
      roundId = ++answer.roundId;
      let i = 0
      for (let index = 0; index < length; index++) {
        acks[index](info, t => {
          data[index] = t;
          ++i === length && accept({ id, roundId, data })
        });
      }
    } else {
      accept({ id, roundId: -1 });
    }
  }

  askRace(id, info, accept) {
    const type = 'askRace'
    if (typeof info === 'function') {
      accept = info
    }
    let roundId = -1,
      acks,
      length,
      answer;
    if (
      (answer = this.answers[id]) &&
      (acks = answer.acks) &&
      (length = acks.length)
    ) {
      roundId = ++answer.roundId;
      let i = 0
      for (let index = 0; index < length; index++) {
        acks[index](info, data => {
          ++i === 1 && accept({ id, roundId, type, data })
        });
      }
    } else {
      accept({ id, roundId: -1, type });
    }
  }

  // 注册应答
  answer(id, meta, ack) {
    if (typeof meta === 'function') {
      ack = meta
    }
    this.answers[id] = getAnswer(this.answers, id)
    this.answers[id].acks.push(ack)
  }
}
