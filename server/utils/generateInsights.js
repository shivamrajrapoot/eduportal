// server/utils/generateInsights.js

const generateInsights = (responses, questions) => {

  // Most time consuming question
  const mostTimeConsuming = responses.reduce((max, r) =>
    r.timeTaken > max.timeTaken ? r : max, responses[0]);

  // Most skipped question — global analytics se
  const skippedResponses = responses.filter(r => r.status === 'skipped');
  const incorrectResponses = responses.filter(r => r.status === 'incorrect');
  const correctResponses = responses.filter(r => r.status === 'correct');
  const markedResponses = responses.filter(r => r.markedForReview === true);

  // Question ka text dhundo
  const getQuestion = (questionId) => {
    return questions.find(q => q._id.toString() === questionId.toString());
  };

  return {
    mostTimeConsuming: mostTimeConsuming ? {
      questionId: mostTimeConsuming.questionId,
      questionText: getQuestion(mostTimeConsuming.questionId)?.questionText,
      timeTaken: mostTimeConsuming.timeTaken,
    } : null,

    mostSkipped: skippedResponses.length > 0 ? {
      count: skippedResponses.length,
      questions: skippedResponses.map(r => ({
        questionId: r.questionId,
        questionText: getQuestion(r.questionId)?.questionText,
      }))
    } : null,

    mostIncorrect: incorrectResponses.length > 0 ? {
      count: incorrectResponses.length,
      questions: incorrectResponses.map(r => ({
        questionId: r.questionId,
        questionText: getQuestion(r.questionId)?.questionText,
      }))
    } : null,

    mostCorrect: correctResponses.length > 0 ? {
      count: correctResponses.length,
      questions: correctResponses.map(r => ({
        questionId: r.questionId,
        questionText: getQuestion(r.questionId)?.questionText,
      }))
    } : null,

    mostMarkedForReview: markedResponses.length > 0 ? {
      count: markedResponses.length,
      questions: markedResponses.map(r => ({
        questionId: r.questionId,
        questionText: getQuestion(r.questionId)?.questionText,
      }))
    } : null,
  };
};

module.exports = generateInsights;