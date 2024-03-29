export default class ValidationFormState {
  constructor({
    formData,
    resultsData,
    protocol,
    parties,
    protocolType,
    machineCount,
  }) {
    this.protocol = protocol
    if (formData && resultsData) {
      this.formData = formData
      this.resultsData = resultsData
    } else {
      const zeroIfEmpty = (value) => (value ? value : '') //0;

      this.formData = {
        sectionId: protocol.section?.id ?? '',

        //данни от избирателния списък
        votersCount: zeroIfEmpty(protocol.results.votersCount),
        additionalVotersCount: zeroIfEmpty(
          protocol.results.additionalVotersCount
        ),
        votersVotedCount: zeroIfEmpty(protocol.results.votersVotedCount),

        //данни извън избирателния списък
        uncastBallots: zeroIfEmpty(protocol.results.uncastBallots),
        invalidAndUncastBallots: zeroIfEmpty(
          protocol.results.invalidAndUncastBallots
        ),

        // СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ
        //5 Общ брой на намерените в избирателната кутия бюлетини
        nonMachineCastBallotsCount: zeroIfEmpty(
          protocol.results.nonMachineCastBallotsCount
        ),

        // 6 Брой на намерените в избирателната кутия недействителни гласове (бюлетини)
        invalidVotesCount: zeroIfEmpty(protocol.results.invalidVotesCount),

        // 7. Общ брой на всички действителни гласове (бюлетини)
        nonMachineVotesCount: zeroIfEmpty(
          protocol.results.nonMachineVotesCount
        ),

        // 7.1. Брой на действителните гласов
        partyNonMachineVotesCount: zeroIfEmpty(
          protocol.results.partyNonMachineVotesCount
        ),
      }

      if (protocolType === 'paper-machine') {
        //5 Общ брой на намерените в избирателната кутия бюлетини

        this.formData['machineCastBallotsCount'] = zeroIfEmpty(
          protocol.results.machineCastBallotsCount
        )
        this.formData['castBallotsCount'] = zeroIfEmpty(
          protocol.results.castBallotsCount
        )

        // 7. Общ брой на всички действителни гласове (бюлетини)
        this.formData['machineVotesCount'] = zeroIfEmpty(
          protocol.results.machineVotesCount
        )
        this.formData['validVotesCount'] = zeroIfEmpty(
          protocol.results.validVotesCount
        )

        //7.1. Брой на действителните гласове
        this.formData['partyMachineVotesCount'] = zeroIfEmpty(
          protocol.results.partyMachineVotesCount
        )
        this.formData['partyValidVotesCount'] = zeroIfEmpty(
          protocol.results.partyValidVotesCount
        )
      }

      // this.formData['totalVotesCount'] = zeroIfEmpty(
      //   protocol.results.totalVotesCount
      // )

      this.initResults(protocol, parties, protocolType, machineCount)
    }
  }

  initResults(protocol, parties, protocolType, machineCount) {
    const emptyStrIfNull = (value) => (value || value === 0 ? value : '')

    this.resultsData = {}

    for (const party of parties) {
      //check if should add paper
      if (protocolType === 'paper' || protocolType === 'paper-machine') {
        this.resultsData[`party${party.id}paper`] = ''
      }
      //add machines and total votes
      for (let i = 0; i < machineCount; i++) {
        this.resultsData[`party${party.id}machine${i + 1}`] = ''
      }

      if (protocolType === 'paper-machine') {
        this.resultsData[`party${party.id}total`] = ''
      }
    }

    for (const result of protocol.results) {
      if (protocolType === 'paper' || protocolType === 'paper-machine') {
        this.resultsData[`party${result.party}paper`] = emptyStrIfNull(
          result.nonMachineCastBallotsCount
        )
      }

      for (let i = 0; i < machineCount; i++) {
        if (result.machineVotes[i])
          this.resultsData[`party${result.party}machine${i + 1}`] =
            emptyStrIfNull(result.machineVotes[i])
      }

      if (protocolType === 'paper-machine') {
        this.resultsData[`party${result.party}total`] = emptyStrIfNull(
          result.totalVotes
        )
      }
    }
  }

  getFieldStatus(protocol, parties, protocolType, machineCount) {
    const zeroIfEmpty = (value) => (value ? value : '') //0;
    const emptyStrIfNull = (value) => (value || value === 0 ? value : '')

    const fieldStatus = {}

    for (let i = 0; i < 9; i++) {
      const sectionId = protocol.section?.id
      if (!sectionId) {
        fieldStatus[`sectionId${i + 1}`] = { invalid: true }
      } else {
        const char1 = protocol.section.id[i]
        const char2 = this.formData.sectionId[i]

        if (typeof char1 == 'undefined' || typeof char2 == 'undefined')
          fieldStatus[`sectionId${i + 1}`] = { invalid: true }
        else if (char1.toString() !== char2.toString())
          fieldStatus[`sectionId${i + 1}`] = { changed: true }
        else fieldStatus[`sectionId${i + 1}`] = { unchanged: true }
      }
    }

    const getPartyResult = (partyId) => {
      for (const result of protocol.results) {
        if (result.party.id === partyId) {
          return result
        }
      }

      return null
    }

    const compareResult = (key, originalResult) => {
      if (!this.resultsData[key] || this.resultsData[key] === '')
        return { invalid: true }
      else if (originalResult.toString() !== this.resultsData[key].toString())
        return { changed: true }
      else return { unchanged: true }
    }

    for (const party of parties) {
      let result = getPartyResult(party.id)
      if (!result)
        result = { nonMachineCastBallotsCount: null, machineVotes: [] }

      if (protocolType === 'paper' || protocolType === 'paper-machine') {
        const originalResult = emptyStrIfNull(result.nonMachineCastBallotsCount)
        fieldStatus[`party${party.id}paper`] = compareResult(
          `party${party.id}paper`,
          originalResult
        )
      }

      for (let i = 0; i < machineCount; i++) {
        const originalResult = emptyStrIfNull(result.machineVotes[i])
        fieldStatus[`party${party.id}machine${i + 1}`] = compareResult(
          `party${party.id}machine${i + 1}`,
          originalResult
        )
      }

      if (protocolType === 'paper-machine') {
        const originalTotalResult = emptyStrIfNull(result.totalVotes)
        fieldStatus[`party${party.id}total`] = compareResult(
          `party${party.id}total`,
          originalTotalResult
        )
      }
    }

    const addStatusForResultField = (fieldName) => {
      if (this.formData[fieldName] === '') {
        fieldStatus[fieldName] = { invalid: true }
      } else if (
        this.formData[fieldName] !== zeroIfEmpty(protocol.results[fieldName])
      ) {
        fieldStatus[fieldName] = { changed: true }
      } else {
        fieldStatus[fieldName] = { unchanged: true }
      }
    }

    addStatusForResultField('votersCount')
    addStatusForResultField('additionalVotersCount')
    addStatusForResultField('votersVotedCount')

    addStatusForResultField('uncastBallots')
    addStatusForResultField('invalidAndUncastBallots')
    addStatusForResultField('castBallotsCount')
    addStatusForResultField('invalidVotesCount')
    addStatusForResultField('validVotesCount')
    addStatusForResultField('partyValidVotesCount')

    if (protocolType === 'paper-machine') {
      addStatusForResultField('nonMachineCastBallotsCount')
      addStatusForResultField('machineCastBallotsCount')
      addStatusForResultField('nonMachineVotesCount')
      addStatusForResultField('machineVotesCount')
      addStatusForResultField('partyNonMachineVotesCount')
      addStatusForResultField('partyMachineVotesCount')
      addStatusForResultField('validNoCandidateNonMachineVotesCount')
      addStatusForResultField('validNoCandidateMachineVotesCount')

      // addStatusForResultField('totalVotesCount')
      addStatusForResultField('totalVotes')
    }

    if (protocolType === 'paper' || protocolType === 'paper-machine') {
      addStatusForResultField('invalidVotesCount')
      addStatusForResultField('validVotesCount')
    }

    let invalidFields = false
    let changedFields = false

    for (const key of Object.keys(fieldStatus)) {
      if (fieldStatus[key].invalid) invalidFields = true
      if (fieldStatus[key].changed) changedFields = true
    }

    if (protocolType === 'unset') invalidFields = true

    return { fieldStatus, invalidFields, changedFields }
  }

  filterNumberFieldInput(newValue, oldValue) {
    let isNum = /^\d+$/.test(newValue)
    if (isNum) {
      return newValue
    } else if (newValue === '') {
      return ''
    } else {
      return oldValue
    }
  }

  hasInvalidFields() {
    for (const key of Object.keys(fieldStatus)) {
      if (fieldStatus[key].invalid) return true
    }
    return false
  }

  hasChangedFields() {
    for (const key of Object.keys(fieldStatus)) {
      if (fieldStatus[key].changed) return true
    }
    return false
  }

  generateResults(parties, protocolType, machineCount) {
    const results = []

    for (const party of parties) {
      const result = { party: party.id }

      if (protocolType === 'machine' || protocolType === 'paper-machine') {
        result.machineVotes = []
        result.totalVotes = []
      }

      if (protocolType === 'paper' || protocolType === 'paper-machine') {
        result.nonMachineCastBallotsCount = parseInt(
          this.resultsData[`party${party.id}paper`],
          10
        )
      }

      for (let i = 0; i < machineCount; i++) {
        result.machineVotes.push(
          parseInt(this.resultsData[`party${party.id}machine${i + 1}`], 10)
        )
      }

      if (protocolType === 'paper-machine') {
        result.totalVotes.push(
          parseInt(this.resultsData[`party${party.id}total`], 10)
        )
      }

      results.push(result)
    }

    return results
  }

  updateProtocolNumber(value) {
    this.formData = { ...this.formData, sectionId: value }
    this.protocol.section = { id: this.formData.sectionId }
    const state = new ValidationFormState({ ...this })
    return state
  }

  updateFormData(key, value) {
    const newValue = this.filterNumberFieldInput(value, this.formData[key])
    this.formData = { ...this.formData, [key]: newValue }

    return new ValidationFormState({ ...this })
  }

  updateResultsData(key, value) {
    const newValue = this.filterNumberFieldInput(value, this.resultsData[key])
    this.resultsData = { ...this.resultsData, [key]: newValue }
    return new ValidationFormState({ ...this })
  }
}
