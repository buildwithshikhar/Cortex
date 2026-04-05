import { useCallback, useEffect, useRef, useState } from 'react'

const MOCK_STREAM_EVENTS = [
  {
    type: 'system',
    text: 'Initializing CORTEX Secure Enclave...',
  },
  {
    type: 'agent',
    from: 'Lead Strategist',
    text: 'Objective received. Delegating competitive analysis to OSINT Researcher.',
  },
  {
    type: 'payload',
    from: 'OSINT Researcher',
    json: {
      status: 'crawling',
      targets: ['competitor A', 'competitor B'],
    },
  },
  {
    type: 'agent',
    from: 'Lead Strategist',
    text: 'Synthesizing data into battlecard format.',
  },
  {
    type: 'system',
    text: 'Proof-of-Execution Hash: 0x8fB...3a1 generated on Polygon.',
  },
  {
    type: 'success',
    text: 'Task Complete. Awaiting next instruction.',
  },
]

const STREAM_INTERVAL_MS = 1500

/**
 * Mock WebSocket stream: does not auto-start. Call `startStream()` to replay events.
 */
export function useMockStream() {
  const [events, setEvents] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const timeoutRef = useRef(null)
  const cancelledRef = useRef(false)

  const clearScheduled = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const resetStream = useCallback(() => {
    cancelledRef.current = true
    clearScheduled()
    cancelledRef.current = false
    setEvents([])
    setIsStreaming(false)
    setIsComplete(false)
  }, [])

  const startStream = useCallback(() => {
    clearScheduled()
    cancelledRef.current = false
    setEvents([])
    setIsComplete(false)
    setIsStreaming(true)

    let index = 0

    const scheduleNext = () => {
      timeoutRef.current = window.setTimeout(() => {
        if (cancelledRef.current) return

        setEvents((prev) => [...prev, MOCK_STREAM_EVENTS[index]])
        index += 1

        if (index < MOCK_STREAM_EVENTS.length) {
          scheduleNext()
        } else {
          setIsStreaming(false)
          setIsComplete(true)
          timeoutRef.current = null
        }
      }, STREAM_INTERVAL_MS)
    }

    scheduleNext()
  }, [])

  useEffect(() => {
    return () => {
      cancelledRef.current = true
      clearScheduled()
    }
  }, [])

  return {
    events,
    isStreaming,
    isComplete,
    startStream,
    resetStream,
  }
}
