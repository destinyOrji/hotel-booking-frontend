import { useState, useCallback } from 'react'

/**
 * Custom hook for handling async operations with loading and error states
 * @param {Function} asyncFunction - The async function to execute
 * @param {boolean} immediate - Whether to execute immediately on mount
 * @returns {Object} - { execute, loading, error, data, reset }
 */
export const useAsync = (asyncFunction, immediate = false) => {
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(
    async (...params) => {
      setLoading(true)
      setError(null)

      try {
        const response = await asyncFunction(...params)
        setData(response)
        return response
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { execute, loading, error, data, reset }
}

export default useAsync
