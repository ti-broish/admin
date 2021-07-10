export default class ValidationFormState {

    constructor({ formData, resultsData, protocol, parties, protocolType, machineCount }) {
        if(formData && resultsData) {
            this.formData = formData;
            this.resultsData = resultsData;
        } else {
            const zeroIfEmpty = value => value? value : '';//0;

            this.formData = {
                sectionId: protocol.section.id,
                //данни от избирателния списък
                votersCount: zeroIfEmpty(protocol.results.votersCount),
                additionalVotersCount: zeroIfEmpty(protocol.results.additionalVotersCount),
                votersVotedCount: zeroIfEmpty(protocol.results.votersVotedCount),
                //данни извън избирателния списък
                uncastBallots: zeroIfEmpty(protocol.results.uncastBallots),
                invalidAndUncastBallots: zeroIfEmpty(protocol.results.invalidAndUncastBallots),
                //СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ
                totalVotesCast: zeroIfEmpty(protocol.results.totalVotesCast),
            };

            if(protocolType === 'paper-machine') {
                this.formData['nonMachineVotesCount'] = zeroIfEmpty(protocol.results.nonMachineVotesCount);
                this.formData['machineVotesCount'] = zeroIfEmpty(protocol.results.machineVotesCount);
            }

            if(protocolType === 'paper' || protocolType === 'paper-machine') {
                this.formData['invalidVotesCount'] = zeroIfEmpty(protocol.results.invalidVotesCount);
                this.formData['validVotesCount'] = zeroIfEmpty(protocol.results.validVotesCount);
            }
    
            this.initResults(protocol, parties, protocolType, machineCount);
        }
    }

    initResults(protocol, parties, protocolType, machineCount) {
        const emptyStrIfNull = value => (value || value === 0)? value : '';

        this.resultsData = {};

        for(const party of parties) {
            //check if should add paper
            if(protocolType === 'paper' || protocolType === 'machine-paper') {
                this.resultsData[`party${party.id}paper`] = '';
            }

            //add machines
            for(let i = 0; i < machineCount; i++) {
                this.resultsData[`party${party.id}machine${i+1}`] = '';
            }
        }

        for(const result of protocol.results) {
            if(protocolType === 'paper' || protocolType === 'machine-paper') {
                this.resultsData[`party${result.party}paper`] = emptyStrIfNull(result.nonMachineVotesCount);
            }

            for(let i = 0; i < machineCount; i++) {
                if(result.machineVotes[i])
                    this.resultsData[`party${result.party}machine${i+1}`] = emptyStrIfNull(result.machineVotes[i]);
            }
        }
    }

    getFieldStatus(protocol, parties, protocolType, machineCount) {
        const zeroIfEmpty = value => value? value : '';//0;
        const emptyStrIfNull = value => (value || value === 0)? value : '';

        const fieldStatus = {};

        for(let i = 0; i < 9; i ++) {
            const char1 = protocol.section.id[i];
            const char2 = this.formData.sectionId[i];

            if(typeof char1 == 'undefined' || typeof char2 == 'undefined')
                fieldStatus[`sectionId${i+1}`] = { invalid: true };
            else if(char1.toString() !== char2.toString())
                fieldStatus[`sectionId${i+1}`] = { changed: true };
            else
                fieldStatus[`sectionId${i+1}`] = { unchanged: true };
        }

        const getPartyResult = partyId => {
            for(const result of protocol.results) {
                if(result.party.id === partyId) {
                    return result;
                }
            }

            return null;
        };

        const compareResult = (key, originalResult) => {
            if(!this.resultsData[key] || this.resultsData[key] === '')
                return { invalid: true };
            else if(originalResult.toString() !== this.resultsData[key].toString())
                return { changed: true };
            else
                return { unchanged: true };
        };

        for(const party of parties) {

            let result = getPartyResult(party.id);
            if(!result) result = { nonMachineVotesCount: null, machineVotes: [] };

            if(protocolType === 'paper' || protocolType === 'paper-machine') {
                const originalResult = emptyStrIfNull(result.nonMachineVotesCount);
                fieldStatus[`party${party.id}paper`] = compareResult(`party${party.id}paper`, originalResult);
            }

            for(let i = 0; i < machineCount; i++) {
                const originalResult = emptyStrIfNull(result.machineVotes[i]);
                fieldStatus[`party${party.id}machine${i+1}`] = compareResult(`party${party.id}machine${i+1}`, originalResult);;
            }
        }

        const addStatusForResultField = fieldName => {
            if(this.formData[fieldName] === '')
                fieldStatus[fieldName] = { invalid: true };
            else if(this.formData[fieldName] !== zeroIfEmpty(protocol.results[fieldName]))
                fieldStatus[fieldName] = { changed: true };
            else
                fieldStatus[fieldName] = { unchanged: true };
        };

        
        addStatusForResultField('votersCount');
        addStatusForResultField('additionalVotersCount');
        addStatusForResultField('votersVotedCount');

        addStatusForResultField('uncastBallots');
        addStatusForResultField('invalidAndUncastBallots');
        addStatusForResultField('totalVotesCast');
        

        if(protocolType === 'paper-machine') {
            addStatusForResultField('nonMachineVotesCount');
            addStatusForResultField('machineVotesCount');
        }

        if(protocolType === 'paper' || protocolType === 'paper-machine') {
            addStatusForResultField('invalidVotesCount');
            addStatusForResultField('validVotesCount');
        }
            
        let invalidFields = false;
        let changedFields = false;
    
        for(const key of Object.keys(fieldStatus)) {
            if(fieldStatus[key].invalid)
                invalidFields = true;
            if(fieldStatus[key].changed)
                changedFields = true;
        }

        if(protocolType === 'unset')
            invalidFields = true;

        return { fieldStatus, invalidFields, changedFields };
    }

    filterNumberFieldInput(newValue, oldValue) {
        let isNum = /^\d+$/.test(newValue);
        if(isNum) {
            return newValue;
        } else if(newValue === '') {
            return '';
        } else {
            return oldValue;
        }
    }

    hasInvalidFields() {
        for(const key of Object.keys(fieldStatus)) {
            if(fieldStatus[key].invalid)
                return true;
        }
        return false;
    }

    hasChangedFields() {
        for(const key of Object.keys(fieldStatus)) {
            if(fieldStatus[key].changed)
                return true;
        }
        return false;
    }

    generateResults(parties, protocolType, machineCount) {
        const results = [];

        for(const party of parties) {
            const result = {
                party: party.id,
                machineVotes: [],
            }

            if(protocolType === 'paper' || protocolType === 'paper-machine') {
                result.nonMachineVotesCount = parseInt(this.resultsData[`party${party.id}paper`], 10);
            }

            for(let i = 0; i < machineCount; i++) {
                result.machineVotes.push(parseInt(this.resultsData[`party${party.id}machine${i+1}`], 10));
            }

            results.push(result);
        }

        return results;
    }

    updateProtocolNumber(value) {
        this.formData = {...this.formData, sectionId: value};
        return new ValidationFormState({...this});
    }

    updateFormData(key, value) {
        const newValue = this.filterNumberFieldInput(value, this.formData[key]);
        this.formData = {...this.formData, [key]: newValue};

        return new ValidationFormState({...this});
    }

    updateResultsData(key, value) {
        const newValue = this.filterNumberFieldInput(value, this.resultsData[key]);
        this.resultsData = {...this.resultsData, [key]: newValue};
        return new ValidationFormState({...this});
    }
}