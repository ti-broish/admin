//@ts-check

import { ProtocolType } from '../../../common/enums/protocol-type'

/**
 * @type {(protocolState: ProtocolState, parties: Party[]) => ProtocolResultDto[]}
 */
export const generateProtocolResults = (state, parties) => {
  return parties.map((p) => ({
    party: p.id,
    machineVotes: [+state.partyInputs.machine[p.id].value],
    nonMachineVotesCount: +state.partyInputs.paper[p.id].value,
    validVotesCount: +state.partyInputs.total[p.id].value,
  }))
}

export const mapNonMachineToTotalFields = {
  nonMachineCastBallotsCount: 'castBallotsCount',
  partyNonMachineVotesCount: 'partyValidVotesCount',
  nonMachineVotesCount: 'validVotesCount',
}

/**
 * @type {(parties: Party[], protocolType: ProtocolType) => ProtocolState}
 */
export const generateInitialProtocolState = (parties, protocolType) => {
  const otherInitial = { value: '', isValid: false, isTouched: false }
  const machineInitial =
    protocolType === ProtocolType.PAPER
      ? { value: '0', isValid: true, isTouched: true }
      : otherInitial
  const state = {
    isValid: false,
    acceptInvalidProtocol: false,
    inputs: {
      votersCount: otherInitial,
      additionalVotersCount: otherInitial,
      votersVotedCount: otherInitial,
      totalBallotsCount: otherInitial,
      uncastBallots: otherInitial,
      invalidAndUncastBallots: otherInitial,
      nonMachineCastBallotsCount: otherInitial,
      machineCastBallotsCount: machineInitial,
      castBallotsCount: otherInitial,
      invalidVotesCount: otherInitial,
      validVotesCount: otherInitial,
      partyValidVotesCount: otherInitial,
      partyNonMachineVotesCount: otherInitial,
      partyMachineVotesCount: machineInitial,
      nonMachineVotesCount: otherInitial,
      machineVotesCount: machineInitial,
    },
    partyInputs: {
      paper: {},
      machine: {},
      total: {},
    },
    errors: [],
  }

  state.partyInputs.paper = parties.reduce(
    (paper, { id }) => ({
      ...paper,
      [id]: otherInitial,
    }),
    {}
  )
  state.partyInputs.machine = parties.reduce(
    (paper, { id }) => ({
      ...paper,
      [id]: machineInitial,
    }),
    {}
  )
  state.partyInputs.total = parties.reduce(
    (paper, { id }) => ({
      ...paper,
      [id]: otherInitial,
    }),
    {}
  )

  return state
}

/**
 * @type {(value: string, oldValue: string) => string}
 */
export const tryUpdateValue = (value, oldValue) => {
  if (value === oldValue) {
    return value
  }
  // isNaN works with string argument, typedefs in IDE are wrong
  return window.isNaN(/** @type {number} */ (/** @type {unknown} */ (value))) ||
    // || Number(value) < 0 // Don't force positive numbers
    Number(value) !== Math.floor(Number(value)) ||
    /^(|0|[1-9][0-9]*)$/.test(value) === false ||
    parseInt(value, 10) > 5000
    ? oldValue
    : value
}

/**
 *
 * @param {Function} fn
 * @param {ControlledInput[]} dependencies
 */
const validateWithDependencies = (fn, dependencies) => {
  if (dependencies.some((d) => d.isTouched)) {
    fn()
  }
}

/**
 * @type {(value: ProtocolState, protocolType: ProtocolType, parties: Party[]) => ProtocolState}
 */
export const getValidatedProtocolState = (state, type, parties) => {
  // assume all inputs are valid
  for (const input of Object.values(state.inputs)) input.isValid = true
  for (const input of Object.values(state.partyInputs.machine))
    input.isValid = true
  for (const input of Object.values(state.partyInputs.paper))
    input.isValid = true
  for (const input of Object.values(state.partyInputs.total))
    input.isValid = true

  const errorStack = new Set()

  // common validations

  // all numbers should be 0+
  for (const key of Object.keys(state.inputs)) {
    const val = state.inputs[key].value
    const maybeInt = Number.parseInt(val, 10)
    if (!Number.isInteger(maybeInt) || maybeInt < 0) {
      state.inputs[key].isValid = false
      errorStack.add(
        'Всяка клетка трябва да съдържа цяло положително число или нула.'
      )
    }

    Object.entries(state.partyInputs).forEach(([key, val]) => {
      for (const i of Object.keys(val)) {
        const val = state.partyInputs[key][i].value
        const maybeInt = Number.parseInt(val, 10)
        if (!Number.isInteger(maybeInt) || maybeInt < 0) {
          state.partyInputs[key][i].isValid = false
          errorStack.add(
            'Всяка клетка трябва да съдържа цяло положително число или нула.'
          )
        }
      }
    })
  }

  // числото в А. трябва да е по-голямо или равно на 100 / числото в А. трябва да е кратно на 100
  validateWithDependencies(() => {
    if (
      +state.inputs.totalBallotsCount.value < 100 ||
      +state.inputs.totalBallotsCount.value % 100 !== 0
    ) {
      state.inputs.totalBallotsCount.isValid = false
      errorStack.add(
        'А. трябва да е кратно на 100. Броят на получените бюлетини е невалиден.'
      )
    }
  }, [state.inputs.totalBallotsCount])

  // числото в А. трябва да е равно на сумата от числата в 4.а), 4.б) и 5.
  validateWithDependencies(() => {
    if (
      +state.inputs.totalBallotsCount.value !==
      +state.inputs.uncastBallots.value +
        +state.inputs.invalidAndUncastBallots.value +
        +state.inputs.nonMachineCastBallotsCount.value
    ) {
      state.inputs.totalBallotsCount.isValid = false
      errorStack.add(
        'А. трябва да е равно на сумата от 4.а), 4.б) и 5. Броят на получените бюлетини не отговаря на пълния брой бюлетини.'
      )
    }
  }, [
    state.inputs.totalBallotsCount,
    state.inputs.uncastBallots,
    state.inputs.invalidAndUncastBallots,
    state.inputs.nonMachineCastBallotsCount,
  ])

  // числото в 3. трябва да е по-малко или равно на сумата от числата в 1. и 2.
  validateWithDependencies(() => {
    if (
      +state.inputs.votersVotedCount.value >
      +state.inputs.votersCount.value +
        +state.inputs.additionalVotersCount.value
    ) {
      state.inputs.votersVotedCount.isValid = false
      errorStack.add(
        '3. трябва да е по-малко или равно на сумата от 1. и 2. Броят на гласувалите избиратели не е валиден'
      )
    }
  }, [
    state.inputs.votersCount,
    state.inputs.additionalVotersCount,
    state.inputs.votersVotedCount,
  ])

  // числото в 5. трябва да е равно на сумата от числата в 6. и 7.
  validateWithDependencies(() => {
    if (
      +state.inputs.nonMachineCastBallotsCount.value !==
      +state.inputs.invalidVotesCount.value +
        +state.inputs.nonMachineVotesCount.value
    ) {
      state.inputs.nonMachineVotesCount.isValid = false
      errorStack.add(
        '5.трябва да е равно на сумата от 6. и 7. Общият брой на валидните гласове не е валиден.'
      )
    }
  }, [
    state.inputs.nonMachineCastBallotsCount,
    state.inputs.invalidVotesCount,
    state.inputs.nonMachineVotesCount,
  ])

  // числото в 7. трябва да е равно на сумата от числата в 7.1 и 7.2.
  validateWithDependencies(() => {
    if (
      +state.inputs.nonMachineVotesCount.value !==
      +state.inputs.partyNonMachineVotesCount.value +
        +state.partyInputs.paper[0].value
    ) {
      state.inputs.nonMachineVotesCount.isValid = false
      errorStack.add(
        '7. трябва да е равно на сумата от 7.1 и 7.2. Общият брой на всички действителни гласове не е валиден.'
      )
    }
  }, [
    state.inputs.nonMachineVotesCount,
    state.inputs.partyNonMachineVotesCount,
    state.partyInputs.paper[0],
  ])

  // числото в 7.1. трябва да е равно на сумата от числата в 8.
  validateWithDependencies(() => {
    if (
      +state.inputs.partyNonMachineVotesCount.value !==
      Object.values(state.partyInputs.paper)
        .slice(1)
        .reduce((total, p) => total + +p.value, 0)
    ) {
      state.inputs.partyNonMachineVotesCount.isValid = false
      errorStack.add(
        '7.1. трябва да е равно на сумата от числата в 8. Броят на действителнити гласове не отговаря на сумата на гласовете по кандидатски листи на партии'
      )
    }
  }, [
    state.inputs.partyNonMachineVotesCount,
    ...Object.values(state.partyInputs.paper)
      .slice(1)
      .filter((p) => p.isTouched),
  ])

  // paper only specific validations
  if (type === ProtocolType.PAPER) {
    // числото в 3. трябва да е равно на числото в 5.
    validateWithDependencies(() => {
      if (
        +state.inputs.votersVotedCount.value !==
        +state.inputs.nonMachineCastBallotsCount.value
      ) {
        state.inputs.votersVotedCount.isValid = false
        errorStack.add(
          '3. трябва да е равно на 5. Брой на гласувалите избиратели според положените подписи в избирателния списък не е валиден.'
        )
      }
    }, [state.inputs.votersVotedCount, state.inputs.nonMachineCastBallotsCount])
  }

  // mixex only specific validations
  if (type === ProtocolType.PAPER_MACHINE) {
    // числото в 3. трябва да е равно на числото по 5.(о)
    validateWithDependencies(() => {
      if (
        +state.inputs.votersVotedCount.value !==
        +state.inputs.castBallotsCount.value
      ) {
        state.inputs.votersVotedCount.isValid = false
        errorStack.add(
          '3. трябва да е равно на 5.2 (о). Брой на гласувалите избиратели според положените подписи в избирателния списък не е валиден.'
        )
      }
    }, [state.inputs.votersVotedCount, state.inputs.castBallotsCount])

    //числото в 5.(м) трябва да е равно на числото в 7.(м)
    validateWithDependencies(() => {
      if (
        +state.inputs.machineCastBallotsCount.value !==
        +state.inputs.machineVotesCount.value
      ) {
        state.inputs.machineCastBallotsCount.isValid = false
        errorStack.add(
          '5.(м) трябва да е равно на 7.(м). Броят на машинните бюлетини не отговаря на броя на действителните гласове от машини.'
        )
      }
    }, [state.inputs.machineCastBallotsCount, state.inputs.machineVotesCount])

    // числото в 7.(м) трябва да е равно на сумата от числата в 7.1.(м) и 7.2.(м)
    validateWithDependencies(() => {
      if (
        +state.inputs.machineVotesCount.value !==
        +state.inputs.partyMachineVotesCount.value +
          +state.partyInputs.machine[0].value
      ) {
        state.inputs.machineVotesCount.isValid = false
        errorStack.add(
          '7.(м) трябва да е равно на сумата от 7.1.(м) и 7.2.(м). Общият брой на действителни гласове не е валиден.'
        )
      }
    }, [
      state.inputs.machineVotesCount,
      state.inputs.partyMachineVotesCount,
      state.partyInputs.machine[0],
    ])

    // числото в 7.(о) трябва да е равно на сумата от числата в 7.1.(о) и 7.2.(о)
    validateWithDependencies(() => {
      if (
        +state.inputs.validVotesCount.value !==
        +state.inputs.partyValidVotesCount.value +
          +state.partyInputs.total[0].value
      ) {
        state.inputs.validVotesCount.isValid = false
        errorStack.add(
          '7.(общи) трябва да е равно на сумата от 7.1.(о) и 7.2.(о). Общият брой на действителните гласове (о) не е валиден.'
        )
      }
    }, [
      state.inputs.validVotesCount,
      state.inputs.partyValidVotesCount,
      state.partyInputs.total[0],
    ])

    // числото в 7.1.(м) трябва да е равно на сумата от числата в 8(м)
    validateWithDependencies(() => {
      if (
        +state.inputs.partyMachineVotesCount.value !==
        Object.values(state.partyInputs.machine)
          .slice(1)
          .reduce((total, p) => total + +p.value, 0)
      ) {
        state.inputs.partyMachineVotesCount.isValid = false
        errorStack.add(
          '7.1.(м) трябва да е равно на сумата от числата в 8(м). Броят на действителнити гласове (машинни бюлетини) не отговаря на сумата на гласовете по кандидатски листи на партии'
        )
      }
    }, [
      state.inputs.partyMachineVotesCount,
      ...Object.values(state.partyInputs.machine)
        .slice(1)
        .filter((p) => p.isTouched),
    ])

    // числото в 7.1.(о) трябва да е равно на сумата от числата в 8(о)
    validateWithDependencies(() => {
      if (
        +state.inputs.partyValidVotesCount.value !==
        Object.values(state.partyInputs.total)
          .slice(1)
          .reduce((total, p) => total + +p.value, 0)
      ) {
        state.inputs.partyValidVotesCount.isValid = false
        errorStack.add(
          '7.1.(о) трябва да е равно на сумата от числата в 8(о). Броят на действителнити гласове (общо) не отговаря на сумата на гласовете по кандидатски листи на партии'
        )
      }
    }, [
      state.inputs.partyValidVotesCount,
      ...Object.values(state.partyInputs.total)
        .slice(1)
        .filter((p) => p.isTouched),
    ])

    for (const party of parties) {
      if (
        +state.partyInputs.total[party.id].value !==
        +state.partyInputs.paper[party.id].value +
          +state.partyInputs.machine[party.id].value
      ) {
        state.partyInputs.total[party.id].isValid = false
        errorStack.add(
          `Броят на общите гласове за ${party.displayName} не отговаря на сумата от хартиените и машинните`
        )
      }
    }
  }

  // check for lack of touched inputs - protocol should be invalid
  const isValid =
    errorStack.size === 0 &&
    Object.values(state.inputs).filter((i) => i.isTouched).length ===
      Object.values(state.inputs).length

  return { ...state, errors: Array.from(errorStack), isValid }
}
