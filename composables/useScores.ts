import type { Score, CreateScoreRequest, UpdateScoreRequest } from '~/types/score'
import type { Employee } from '~/types/employee'
import { ScoreService } from '~/services/score/scoreService'

export const useScores = () => {
  const scores = ref<Score[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchScores = async () => {
    loading.value = true
    error.value = null
    
    try {
      const scoreService = ScoreService.getInstance()
      const fetchedScores = await scoreService.getAllScores()
      
      // Set scores without employee names initially
      scores.value = fetchedScores.map(score => ({
        ...score,
        employeeName: '' // Will be updated by updateEmployeeNames()
      }))
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch scores'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createScore = async (scoreData: CreateScoreRequest): Promise<Score> => {
    loading.value = true
    error.value = null
    
    try {
      const scoreService = ScoreService.getInstance()
      const newScore = await scoreService.createScore(scoreData)
      
      // Add score without employee name initially
      const scoreWithoutName = {
        ...newScore,
        employeeName: '' // Will be updated by updateEmployeeNames()
      }
      
      // Add to local state
      scores.value.unshift(scoreWithoutName)
      
      return scoreWithoutName
    } catch (err: any) {
      error.value = err.message || 'Failed to create score'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateScore = async (id: number, scoreData: UpdateScoreRequest): Promise<Score> => {
    loading.value = true
    error.value = null
    
    try {
      const scoreService = ScoreService.getInstance()
      const updatedScore = await scoreService.updateScore(id, scoreData)
      
      // Update score without employee name initially
      const scoreWithoutName = {
        ...updatedScore,
        employeeName: '' // Will be updated by updateEmployeeNames()
      }
      
      // Update local state
      const index = scores.value.findIndex(score => score.id === id)
      if (index !== -1) {
        scores.value[index] = scoreWithoutName
      }
      
      return scoreWithoutName
    } catch (err: any) {
      error.value = err.message || 'Failed to update score'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteScore = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      const scoreService = ScoreService.getInstance()
      await scoreService.deleteScore(id)
      
      // Remove from local state
      scores.value = scores.value.filter(score => score.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete score'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getScoreById = (id: number): Score | undefined => {
    return scores.value.find(score => score.id === id)
  }

  const getScoresByEmployee = (employeeId: number): Score[] => {
    return scores.value.filter(score => score.employeeId === employeeId)
  }

  const getScoresByDateRange = (startDate: Date, endDate: Date): Score[] => {
    return scores.value.filter(score => {
      const scoreDate = new Date(score.date)
      return scoreDate >= startDate && scoreDate <= endDate
    })
  }

  const getTotalScoreForEmployee = (employeeId: number): number => {
    return getScoresByEmployee(employeeId).reduce((total, score) => total + score.score, 0)
  }

  const getAverageScoreForEmployee = (employeeId: number): number => {
    const employeeScores = getScoresByEmployee(employeeId)
    if (employeeScores.length === 0) return 0
    return getTotalScoreForEmployee(employeeId) / employeeScores.length
  }

  const updateEmployeeNames = (employeesData?: readonly Employee[]) => {
    try {
      // Use passed employees data or try to get from useEmployees
      let employeesList = employeesData
      if (!employeesList) {
        const { employees } = useEmployees()
        employeesList = employees.value
      }
      
      // Only update if we have employees data and scores
      if (employeesList && employeesList.length > 0 && scores.value.length > 0) {
        console.log('Updating employee names...', {
          employeesCount: employeesList.length,
          scoresCount: scores.value.length
        })
        
        // Create a new array with updated names
        const updatedScores = scores.value.map(score => {
          const employee = employeesList.find(emp => emp.id === score.employeeId)
          
          console.log(`Score ${score.id}: employeeId=${score.employeeId}, found employee:`, employee)
          
          return {
            ...score,
            employeeName: employee ? employee.name : `Palomo ID: ${score.employeeId}`
          }
        })
        
        // Force Vue reactivity by replacing the entire array
        scores.value = updatedScores
        
        console.log('Updated scores with names:', scores.value.map(s => ({ id: s.id, employeeId: s.employeeId, employeeName: s.employeeName })))
      } else {
        console.log('Cannot update names:', {
          employeesCount: employeesList ? employeesList.length : 0,
          scoresCount: scores.value.length
        })
      }
    } catch (err) {
      console.warn('Failed to update employee names:', err)
    }
  }

  return {
    scores: readonly(scores),
    loading: readonly(loading),
    error: readonly(error),
    fetchScores,
    createScore,
    updateScore,
    deleteScore,
    getScoreById,
    getScoresByEmployee,
    getScoresByDateRange,
    getTotalScoreForEmployee,
    getAverageScoreForEmployee,
    updateEmployeeNames
  }
}
