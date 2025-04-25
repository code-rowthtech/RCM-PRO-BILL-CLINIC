import React from 'react';

const PatientSummary = () => {
    const patient = {
        name: "John Doe",
        age: 45,
        gender: "Male",
        dob: "1979-03-15",
        bloodType: "O+",
        allergies: "Peanuts",
        conditions: "Hypertension",
        medications: "Lisinopril",
    };

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Patient Summary</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.age}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.gender}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.dob}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Blood Type</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.bloodType}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Allergies</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.allergies}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Conditions</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.conditions}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Medications</p>
                        <p className="text-lg font-semibold text-gray-700">{patient.medications}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSummary;
