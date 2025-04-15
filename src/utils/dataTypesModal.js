const mongoose = require('mongoose');
const { encryptValues, decryptValues, hashValue } = require('../../configs/crypto');

// encryptions 
function secureSet(val) {
    if (val) {
        return encryptValues(val);
    }
    return val;
}

function secureGet(val) {
    return val ? decryptValues(val) : val;
}

//  Period Schema
const periodSchema = new mongoose.Schema({
    start: { type: Date }, // Starting time (inclusive boundary)
    end: { type: Date } // End time (inclusive boundary, if not ongoing)
}, { _id: false });

// ContactPoint Schema
const contactPointSchema = new mongoose.Schema({
    system: { type: String }, // phone, email, etc.
    value: { type: String, set: secureSet, get: secureGet }, // Encrypted contact value
    use: { type: String },
    rank: { type: Number, min: 1 },
    period: { type: periodSchema },
    hashedValue: { type: String, select: false } // Store hashed contact value
}, { _id: false });

// Pre-save hook to hash the contact value field
contactPointSchema.pre('save', async function (next) {
    if (this.isModified('value')) {
        this.hashedValue = await hashValue(this.value);
    }
    next();
});

contactPointSchema.set('toJSON', { getters: true });
contactPointSchema.set('toObject', { getters: true });
// Attachment Schema
const attachmentSchema = new mongoose.Schema({
    contentType: { type: String },
    language: { type: String },
    data: { type: Buffer, set: secureSet, get: secureGet }, // Encrypted file data
    url: { type: String, set: secureSet, get: secureGet }, // Encrypted URL
    size: { type: Number },
    hash: { type: Buffer }, // Hash of file content
    title: { type: String, set: secureSet, get: secureGet }, // Encrypted title
    creation: { type: Date },
    fileName: { type: String },
    name: { type: String },
    hashedValue: { type: String, select: false } // Stores the hash for integrity checks
}, { _id: false });

attachmentSchema.set('toJSON', { getters: true });
attachmentSchema.set('toObject', { getters: true });
// // Pre-save hook to hash attachment details
// attachmentSchema.pre('save', async function (next) {
//     const hashSource = JSON.stringify({
//         contentType: this.contentType,
//         language: this.language,
//         data: this.data,
//         url: this.url,
//         title: this.title
//     });

//     this.hashedValue = await hashValue(hashSource);
//     next();
// });


// Coding Schema
const codingSchema = new mongoose.Schema({
    system: { type: String },
    version: { type: String },
    code: { type: String },
    display: { type: String },
    userSelected: { type: Boolean }
}, { _id: false });


// CodeableConcept Schema
const codeableConceptSchema = new mongoose.Schema({
    coding: { type: [codingSchema], default: [] },
    text: { type: String }
}, { _id: false });


// Quantity Schema
const quantitySchema = new mongoose.Schema({
    value: { type: Number }, // Numerical value with precision
    comparator: {
        type: String,
        // enum: ['<', '<=', '>=', '>']
    }, // Comparator for the value
    unit: { type: String }, // Human-readable unit representation
    system: { type: String }, // URI for the unit system
    code: { type: String } // Coded form of the unit
}, { _id: false });


// Money Schema
const moneySchema = new mongoose.Schema({
    value: { type: Number }, // Numeric amount with precision
    currency: { type: String } // ISO 4217 Currency Code
}, { _id: false });


// Range Schema
const rangeSchema = new mongoose.Schema({
    low: { type: quantitySchema }, // Lower bound of the range
    high: { type: quantitySchema } // Upper bound of the range
}, { _id: false });


// Ratio Schema
const ratioSchema = new mongoose.Schema({
    numerator: { type: quantitySchema }, // Numerator value
    denominator: { type: quantitySchema } // Denominator value
}, { _id: false });


// SampledData Schema
const sampledDataSchema = new mongoose.Schema({
    origin: { type: quantitySchema }, // Zero value and units
    period: { type: Number }, // Time interval between samples (ms)
    factor: { type: Number }, // Scale factor to be applied to data
    lowerLimit: { type: Number }, // Minimum detection limit
    upperLimit: { type: Number }, // Maximum detection limit
    dimensions: { type: Number, min: 1 }, // Number of sample points per time point
    data: {
        type: String,
        // validate: {
        //     validator: function (v) {
        //         return /^(\d+(\.\d+)?|E|L|U)(\s(\d+(\.\d+)?|E|L|U))*$/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid SampledData format`
        // }
    } // Space-separated decimal values or special values ("E", "L", "U")
}, { _id: false });

// Identifier Schema
const identifierSchema = new mongoose.Schema({
    identifierType: { type: String },
    use: { type: String },
    type: { type: codeableConceptSchema },
    system: { type: String },
    value: {
        type: String,
        set: secureSet,
        get: secureGet,
        required: true
    },
    period: { type: periodSchema },
    assigner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    file: [attachmentSchema],
    documents: [attachmentSchema],
    issuingAuthority: {
        type: String,
        // enum: ['NPPES', 'IRS', 'State Licensing Authority', 'CMS', 'The Joint Commission', 'Dun & Bradstreet', 'CLIA'],
        // required: true
    },
    expiry: { type: Date },
    status: { type: String, enum: ['active', 'hold', 'ristricted'] },
    licenseState: { type: String },
    ennumerationDate: { type: Date },
    expirationDate: { type: Date },
    hashedValue: {
        type: String,
        select: false
    }
}, { _id: false });

// Pre-save hook to hash value
identifierSchema.pre('save', async function (next) {
    if (this.isModified('value')) {
        this.hashedValue = await hashValue(this.value);
    }
    next();
});
// identifierSchema.set('toJSON', { getters: true });
// identifierSchema.set('toObject', { getters: true });

const humanNameSchema = new mongoose.Schema({
    use: { type: String },
    text: { type: String, set: secureSet, get: secureGet },
    family: { type: String, set: secureSet, get: secureGet },
    given: [{ type: String, set: secureSet, get: secureGet }],
    prefix: [{ type: String, set: secureSet, get: secureGet }],
    suffix: [{ type: String, set: secureSet, get: secureGet }],
    preferred: { type: Boolean, default: true },
    period: { type: periodSchema },
    hashedValueFirstName: { type: String, select: false },
    hashedValueLastName: { type: String, select: false },
    hashedValueFamilyName: { type: String, select: false }
}, { _id: false });

// Pre-save hook to hash names
humanNameSchema.pre('save', async function (next) {
    if (this.isModified('given') && this.given.length > 0) {
        this.hashedValueFirstName = await hashValue(this.given.join(' '));
    }
    if (this.isModified('family')) {
        this.hashedValueFamilyName = await hashValue(this.family);
    }
    if (this.isModified('text')) {
        this.hashedValueLastName = await hashValue(this.text);
    }
    next();
});
humanNameSchema.set('toJSON', { getters: true });
humanNameSchema.set('toObject', { getters: true });

// Address Schema
const addressSchema = new mongoose.Schema({
    use: { type: String },
    type: { type: String },
    text: { type: String, set: secureSet, get: secureGet }, // Encrypt full address
    line: {
        type: [{ type: String }],
        set: (vals) => vals?.map(secureSet),
        get: (vals) => vals?.map(secureGet)
    }, // Encrypt each line separately
    city: { type: String },
    district: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    status: { type: Boolean },
    telecom: { type: [contactPointSchema] },
    period: { type: periodSchema },
    hashedValue: { type: String, select: false } // Hash for data integrity
}, { _id: false });

addressSchema.set('toJSON', { getters: true });
addressSchema.set('toObject', { getters: true });
// Pre-save hook to hash address
// addressSchema.pre('save', async function (next) {
//     const hashSource = JSON.stringify({
//         text: this.text,
//         line: this.line,
//         city: this.city,
//         district: this.district,
//         state: this.state,
//         postalCode: this.postalCode,
//         country: this.country
//     });

//     this.hashedValue = await hashValue(hashSource);
//     next();
// });

// Timing Schema
const timingSchema = new mongoose.Schema({
    event: [{ type: Date }], // List of event timestamps
    repeat: {
        boundsDuration: { type: String },
        boundsRange: { type: rangeSchema },
        boundsPeriod: { type: periodSchema },
        count: { type: Number, min: 1 },
        countMax: { type: Number, min: 1 },
        duration: { type: Number, min: 0 },
        durationMax: { type: Number, min: 0 },
        durationUnit: {
            type: String,
            enum: ['s', 'min', 'h', 'd', 'wk', 'mo', 'a'], // UCUM units
        },
        frequency: { type: Number, min: 1 },
        frequencyMax: { type: Number, min: 1 },
        period: { type: Number, min: 0 },
        periodMax: { type: Number, min: 0 },
        periodUnit: {
            type: String,
            enum: ['s', 'min', 'h', 'd', 'wk', 'mo', 'a'], // UCUM units
        },
        dayOfWeek: [{
            type: String,
            enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        }],
        timeOfDay: [{ type: String }], // e.g., "10:00:00"
        when: [{
            type: String,
            enum: ['MORN', 'AFT', 'EVE', 'NIGHT', 'C', 'CM', 'CD', 'CV', 'AC', 'PC'], // EventTiming
        }],
        offset: { type: Number, min: 0 },
    },
    code: { type: codeableConceptSchema }, // BID, TID, QD, etc.
}, { _id: false });


// Narrative Schema
const narrativeSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["generated", "extensions", "additional", "empty"],
        required: true
    },
    div: {
        type: String,
        required: true
    }
}, { _id: false });


// Reference Schema
const referenceSchema = new mongoose.Schema({
    reference: {
        type: String
    },
    type: {
        type: String
    },
    identifier: {
        system: { type: String },
        value: { type: String }
    },
    display: {
        type: String
    }
}, { _id: false });


const signatureSchema = new mongoose.Schema({
    type: [{
        type: codingSchema
    }],
    when: { type: Date }, // Timestamp of signature creation
    who: {
        type: referenceSchema,
        set: secureSet,
        get: secureGet
    }, // Who signed
    onBehalfOf: { type: referenceSchema }, // Party represented
    targetFormat: { type: String }, // Format of signed resource (e.g., application/fhir+xml)
    sigFormat: { type: String }, // Format of the signature (e.g., application/jose)
    data: {
        type: String,
        set: secureSet,
        get: secureGet
    }, // Encrypted Base64-encoded signature content
    hashedValue: { type: String, select: false } // Stores the hashed value of the signature details
}, { _id: false });

// Pre-save hook to hash signature details
signatureSchema.pre('save', async function (next) {
    const hashSource = JSON.stringify({
        who: this.who,
        onBehalfOf: this.onBehalfOf,
        when: this.when,
        data: this.data
    });

    this.hashedValue = await hashValue(hashSource);
    next();
});
// signatureSchema.set('toJSON', { getters: true });
// signatureSchema.set('toObject', { getters: true });

// annotation Schema
const annotationSchema = new mongoose.Schema({
    authorReference: { type: referenceSchema }, // Reference to Practitioner, Patient, etc.
    authorString: {
        type: String,
        set: secureSet,
        get: secureGet
    }, // Encrypted author name
    time: { type: Date }, // Timestamp when annotation was made
    text: {
        type: String,
        required: true,
        set: secureSet,
        get: secureGet
    }, // Encrypted annotation content
    hashedValue: { type: String, select: false } // Stores the hash of annotation details
}, { _id: false });

// Pre-save hook to hash annotation details
annotationSchema.pre('save', async function (next) {
    const hashSource = JSON.stringify({
        authorReference: this.authorReference,
        authorString: this.authorString,
        time: this.time,
        text: this.text
    });

    this.hashedValue = await hashValue(hashSource);
    next();
});

// annotationSchema.set('toJSON', { getters: true });
// annotationSchema.set('toObject', { getters: true });
// Resource Schema
const resourceSchema = new mongoose.Schema({
    resourceType: { type: String, required: true },
    id: { type: String, required: true },
    meta: {
        versionId: { type: String },
        lastUpdated: { type: Date },
        profile: [{ type: String }] // US Core requires profile declaration
    },
    text: { type: mongoose.Schema.Types.ObjectId, ref: 'Narrative' }
});


// Extension Schema
const extensionSchema = new mongoose.Schema({
    url: { type: String },
    valueString: { type: String },
    valueBoolean: { type: Boolean },
    valueInteger: { type: Number },
    valueDecimal: { type: Number },
    valueDateTime: { type: Date },
    valueCodeableConcept: { type: codeableConceptSchema },
    valueQuantity: { type: quantitySchema },
    valueReference: { type: referenceSchema }
}, { _id: false });

// taxonomy Schema
const taxonomySchema = new mongoose.Schema({
    type: { type: String, enum: ['Primary', 'Secondary'] },
    code: { type: String }, // Taxonomy code
    Grouping: { type: String }, // Taxonomy grouping
    Classification: { type: String }, // Taxonomy classification
    Specialization: { type: String }, // Taxonomy specialization
    Definition: { type: String }, // Taxonomy definition
    Notes: { type: String }, // Taxonomy notes
    displayName: { type: String }, // Taxonomy display name
    section: { type: String }, // Taxonomy section
    state: { type: String }, // Taxonomy state
    licenseNumber: { type: String }, // Taxonomy license number
}, { _id: false });

// Exporting the dataTypes schemas
module.exports = {
    attachmentSchema,
    codingSchema,
    codeableConceptSchema,
    quantitySchema,
    moneySchema,
    rangeSchema,
    ratioSchema,
    periodSchema,
    sampledDataSchema,
    identifierSchema,
    humanNameSchema,
    addressSchema,
    contactPointSchema,
    timingSchema,
    signatureSchema,
    annotationSchema,
    narrativeSchema,
    referenceSchema,
    resourceSchema,
    extensionSchema,
    taxonomySchema
}; // end of exports
