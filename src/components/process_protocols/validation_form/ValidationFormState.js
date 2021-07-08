export default class ValidationFormState {

    constructor({ formData, resultsData, protocol, parties, allParties }) {
        if(formData && resultsData) {
            this.formData = formData;
            this.resultsData = resultsData;
        } else {
            const zeroIfEmpty = value => value? value : '';//0;

            this.formData = {
                sectionId: protocol.section.id,
                votersCount: zeroIfEmpty(protocol.results.votersCount),
                validVotesCount: zeroIfEmpty(protocol.results.validVotesCount),
                invalidVotesCount: zeroIfEmpty(protocol.results.invalidVotesCount),
            }
    
            this.initResults(protocol, parties, allParties);
        }
    }

    initResults(protocol, parties, allParties) {
        const emptyStrIfNull = value => (value || value === 0)? value : '';

        this.resultsData = { '0': '' };

        for(const party of parties) {
            if((allParties? true : party.isFeatured) || party.id.toString() === '0')
                this.resultsData[party.id] = '';
                this.resultsData[`${party.id}m`] = '';
                this.resultsData[`${party.id}nm`] = '';
        }

        for(const result of protocol.results.results) {
            this.resultsData[result.party.id] = emptyStrIfNull(result.validVotesCount);
            this.resultsData[`${result.party.id}m`] = emptyStrIfNull(result.machineVotesCount);
            this.resultsData[`${result.party.id}nm`] = emptyStrIfNull(result.nonMachineVotesCount);
        }
    }

    getFieldStatus(protocol, parties, allParties, sectionData) {
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

        for(const party of parties) {
            if((allParties? true : party.isFeatured) || party.id.toString() === '0') {

                const updateFieldStatus = (apiKey, resultSuffix) => {
                    let originalResult = '';
                    for(const result of protocol.results.results) {
                        if(result.party.id === party.id) {
                            originalResult = emptyStrIfNull(result[apiKey]);
                        }
                    }

                    if(this.resultsData[`${party.id}${resultSuffix}`] === '')
                        fieldStatus[`party${party.id}${resultSuffix}`] = { invalid: true };
                    else if(originalResult.toString() !== this.resultsData[`${party.id}${resultSuffix}`].toString())
                        fieldStatus[`party${party.id}${resultSuffix}`] = { changed: true };
                    else
                        fieldStatus[`party${party.id}${resultSuffix}`] = { unchanged: true };
                };

                updateFieldStatus('validVotesCount', '');

                if(sectionData.isMachine) {
                    updateFieldStatus('machineVotesCount', 'm');
                    updateFieldStatus('nonMachineVotesCount', 'nm');
                }
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
        addStatusForResultField('validVotesCount');
        addStatusForResultField('invalidVotesCount');

        let invalidFields = false;
        let changedFields = false;
    
        for(const key of Object.keys(fieldStatus)) {
            if(fieldStatus[key].invalid)
                invalidFields = true;
            if(fieldStatus[key].changed)
                changedFields = true;
        }

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

    generateResults(isMachine) {
        const results = {};

        Object.keys(this.resultsData).forEach(key => {
            if(key[key.length - 2] === 'n') {
                let newKey = key.slice(0, key.length - 2);
                if(!results[newKey]) results[newKey] = {};
                results[newKey].nonMachineVotesCount = !isMachine? null : parseInt(this.resultsData[key], 10);
            } else if(key[key.length - 1] === 'm') {
                let newKey = key.slice(0, key.length - 1);
                if(!results[newKey]) results[newKey] = {};
                results[newKey].machineVotesCount = !isMachine? null : parseInt(this.resultsData[key], 10);
            } else {
                if(!results[key]) results[key] = {};
                results[key].validVotesCount = parseInt(this.resultsData[key], 10);
            }
        });

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