// server/utils/calculateScore.js

const calculateScore = (responses, questions, negativeMarking) => {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  let markedForReview = 0;
  let score = 0;

  responses.forEach((response) => {
    // question dhundo
    const question = questions.find(
      (q) => q._id.toString() === response.questionId.toString()
    );
    if (!question) return;

    if (response.selectedAnswer === null || response.selectedAnswer === undefined) {
      // skipped
      skipped++;
      response.status = 'skipped';
      response.isCorrect = false;

    } else if (response.selectedAnswer === question.correctAnswer) {
      // correct
      correct++;
      score += question.marks;
      response.status = 'correct';
      response.isCorrect = true;

    } else {
      // incorrect
      incorrect++;
      score -= negativeMarking * question.marks;
      response.status = 'incorrect';
      response.isCorrect = false;
    }

    // marked for review bhi track karo
    if (response.markedForReview) {
      markedForReview++;
    }
  });

  // accuracy — sirf attempted questions mein se
  const attempted = correct + incorrect;
  const accuracy = attempted > 0
    ? Math.round((correct / attempted) * 100)
    : 0;

  return {
    score: Math.max(0, score), // score kabhi negative nahi hoga
    correct,
    incorrect,
    skipped,
    markedForReview,
    accuracy,
  };
};

module.exports = calculateScore;