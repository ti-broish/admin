class ValidationFormState {

    // should maybe be list of fields

    // every field has a status
    // every field has a value
    // every field has a mutator fn

    // could form data and results data be unified?
    // YES

    // could above and protocol num data be unified?
    // YES

    // one object; party number fields dynamically added

    formData = {
        sectionId: null,
        votersCount: null,
        validVotesCount: null,
        invalidVotesCount: null,
    };

    resultsData = {

    };

    fieldStatus = {

    };


    constructor() {

    }
}