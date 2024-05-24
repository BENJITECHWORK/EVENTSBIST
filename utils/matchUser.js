
exports.compareScores=(studentData, studentToCompare)=> {
    let result = {};
    for (let i = 0; i < studentData.length; i++) {
        let student = studentData[i];
        let score = calculateScore(student.attempt, studentToCompare.attempt);
        result[student.userId] = score;
    }
    return result;
}

function calculateScore(attempts1, attempts2) {
    let score = 0;
    for (let i = 0; i < attempts1.length; i++) {
        for (let j = 0; j < attempts2.length; j++) {
            if (attempts1[i].questionId === attempts2[j].questionId &&
                attempts1[i].answerId === attempts2[j].answerId) {
                score++;
                break;
            }
        }
    }
    return score;
}

let studentData = [
    {
        id: 2,
        userId: 5,
        attempt: [
            {
                questionId: 10,
                answerId: 5
            }
        ]
    },
    {
        id: 5,
        userId: 5,
        attempt: [
            {
                questionId: 10,
                answerId: 105
            }
        ]
    },
    {
        id: 11,
        userId: 8,
        attempt: [
            {
                questionId: 9,
                answerId: 90
            },
            {
                questionId: 2,
                answerId: 20
            }
        ]
    }
];

let studentToCompare = {
    userId: 13,
    attempt: [
        {
            questionId: 9,
            answerId: 90
        },
        {
            questionId: 10,
            answerId: 105
        },
        {
            questionId: 2,
            answerId: 20
        }
    ]
};

// let comparisonResult = compareScores(studentData, studentToCompare);
// console.log(comparisonResult);
