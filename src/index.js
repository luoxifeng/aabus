const getDefaultAnswer = () => ({ uuid: -1, acks: [] })

module.exports = class AABus {

  constructor() {
    this.answers = {}
  }

  ask() {

  }

  askEveryOne(id, info, accept) {
    if (typeof info === 'function') {
      accept = info
    }
    let uuid = -1,
      index = -1,
      acks,
      length;
    const answer = this.answers[id]
    if (answer && (acks = answer.acks) && (length = acks.length)) {
      uuid = ++answer.uuid;
      for (index = 0; index < length; index++) {
        acks[index](info, data => accept({ id, uuid, index, data }));
      }
    } else {
      accept({ id, uuid: -1, index });
    }
  }

  askOneByOne(id, payload, ) {

  }

  askAll(id, info, accept) {
    if (typeof info === 'function') {
      accept = info
    }
    let uuid = -1,
      acks,
      length,
      answer;
    if (
      (answer = this.answers[id]) &&
      (acks = answer.acks) &&
      (length = acks.length)
    ) {
      const data = [];
      uuid = ++answer.uuid;
      let i = 0
      for (let index = 0; index < length; index++) {
        acks[index](info, t => {
          data[index] = t;
          ++i === length && accept({ id, uuid, data })
        });
      }
    } else {
      accept({ id, uuid: -1 });
    }
  }

  askRace(id, info, accept) {
    
  }

  // 注册应答
  answer(id, ack) {
    this.answers[id] = this.answers[id] || getDefaultAnswer()
    this.answers[id].acks.push(ack)
  }

}
