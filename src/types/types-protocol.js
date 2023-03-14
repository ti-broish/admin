/**
 * @typedef {{
 *   party: number,
 *   machineVotes: number,
 *   nonMachineVotesCount: number,
 *   validVotesCount: number,
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
 *   castBallotsCount: number,
 *   pictures: any,
 *   totalBallotsCount: number,
 *   nonMachineCastBallotsCount: number,
 *   machineCastBallotsCount: number,
 *   validVotesCount: number,
 *   partyValidVotesCount: number,
 *   partyNonMachineVotesCount: number,
 *   partyMachineVotesCount: number,
 *   validNoCandidateTotalVotesCount: number,
 *   nonMachineVotesCount: number,
 *   machineVotesCount: number,
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
 *   totalBallotsCount: ControlledInput,
 *   uncastBallots: ControlledInput,
 *   invalidAndUncastBallots: ControlledInput,
 *   nonMachineCastBallotsCount: ControlledInput,
 *   machineCastBallotsCount: ControlledInput,
 *   castBallotsCount: ControlledInput,
 *   invalidVotesCount: ControlledInput,
 *   validVotesCount: ControlledInput,
 *   partyValidVotesCount: ControlledInput,
 *   partyNonMachineVotesCount: ControlledInput,
 *   partyMachineVotesCount: ControlledInput,
 *   validNoCandidateTotalVotesCount: ControlledInput,
 *   nonMachineVotesCount: ControlledInput,
 *   machineVotesCount: ControlledInput,
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
