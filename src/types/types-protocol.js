/**
 * @typedef {{
 *   party: number,
 *   machineVotesCount: number,
 *   nonMachineVotesCount: number,
 *   totalVotes: number,
 * }} ProtocolResultDto
 */

/**
 * @typedef {{
 *   results: ProtocolResultDto[],
 *   section: { id: number },
 *   hasPaperBallots: boolean,
 *   machinesCount: 0 | 1,
 *   isFinal: boolean,
 *   votersCount: number,
 *   additionalVotersCount: number,
 *   votersVotedCount: number,
 *   uncastBallots: number,
 *   invalidAndUncastBallots: number,
 *   totalVotesCast: number,
 *   pictures: any,
 *   receivedBallots: number,
 *   nonMachineVotesCount: number,
 *   machineVotesCount: number,
 *   validVotesTotalCount: number,
 *   partiesValidVotesTotalCount: number,
 *   partiesNonMachineValidVotesCount: number,
 *   partiesMachinesValidVotesCount: number,
 *   validNoCandidateTotalVotesCount: number,
 *   validNonMachineVotesCount: number,
 *   validMachineVotesCount: number,
 * }} ProtocolReplaceDto
 */

/**
 * @typedef {{
 *   protocol: any,
 *   setLoading: (value: boolean) => void,
 *   processingDone: (value: string) => void,
 *   processingFailed: (value: string) => void,
 *   reorderPictures: any,
 *   returnProtocol: ClickHandler,
 * }} VerifyProtocolInfoProps
 */

/**
 * @typedef {{
 *   votersCount: ControlledInput,
 *   additionalVotersCount: ControlledInput,
 *   votersVotedCount: ControlledInput,
 *   receivedBallots: ControlledInput,
 *   uncastBallots: ControlledInput,
 *   invalidAndUncastBallots: ControlledInput,
 *   nonMachineVotesCount: ControlledInput,
 *   machineVotesCount: ControlledInput,
 *   totalVotesCast: ControlledInput,
 *   invalidVotesCount: ControlledInput,
 *   validVotesTotalCount: ControlledInput,
 *   partiesValidVotesTotalCount: ControlledInput,
 *   partiesNonMachineValidVotesCount: ControlledInput,
 *   partiesMachinesValidVotesCount: ControlledInput,
 *   validNoCandidateTotalVotesCount: ControlledInput,
 *   validNonMachineVotesCount: ControlledInput,
 *   validMachineVotesCount: ControlledInput,
 * }} ProtocolStateInputs
 */

/**
 * @typedef {{
 *   isValid: boolean,
 *   acceptInvalidProtocol: boolean,
 *   inputs: ProtocolStateInputs,
 *   partyInputs: {
 *     paper: {[key: string]: ControlledInput},
 *     machine: {[key: string]: ControlledInput},
 *     total: {[key: string]: ControlledInput},
 *   },
 *   errors: string[],
 * }} ProtocolState
 */

/**
 * @typedef {{
 *   protocolState: ProtocolState,
 *   protocolType: ProtocolType,
 *   validateProtocolForm: (value: ProtocolState) => void,
 *   parties: Party[],
 * }} ProtocolFormProps
 */
