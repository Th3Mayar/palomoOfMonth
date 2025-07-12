// Global configuration for scores
const scoreConfig = ref({
  maxScore: 5,
  minScore: 1,
  scoreStep: 1
})

export const useScoreConfig = () => {
  const getMaxScore = () => scoreConfig.value.maxScore
  const getMinScore = () => scoreConfig.value.minScore
  const getScoreStep = () => scoreConfig.value.scoreStep

  const setMaxScore = (value: number) => {
    if (value > 0) {
      scoreConfig.value.maxScore = value
    }
  }

  const setMinScore = (value: number) => {
    if (value >= 0 && value < scoreConfig.value.maxScore) {
      scoreConfig.value.minScore = value
    }
  }

  const setScoreStep = (value: number) => {
    if (value > 0) {
      scoreConfig.value.scoreStep = value
    }
  }

  const getScoreOptions = () => {
    const options = []
    for (let i = scoreConfig.value.minScore; i <= scoreConfig.value.maxScore; i += scoreConfig.value.scoreStep) {
      options.push({
        value: i,
        label: i.toString()
      })
    }
    return options
  }

  const isValidScore = (score: number): boolean => {
    return score >= scoreConfig.value.minScore && 
           score <= scoreConfig.value.maxScore &&
           score % scoreConfig.value.scoreStep === 0
  }

  return {
    getMaxScore,
    getMinScore,
    getScoreStep,
    setMaxScore,
    setMinScore,
    setScoreStep,
    getScoreOptions,
    isValidScore,
    config: readonly(scoreConfig)
  }
}
