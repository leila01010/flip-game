import { reactive } from 'vue'

export function useTimer() {
  const timer = reactive({
    start: 0,
    text: '',
    timeout: null,
    status: '',
    allowed: 120, // 2 minutes
  })

  function startTimer(){
    timer.start = new Date().getTime()
    timer.status = 'start'
    updateTimer()
  }

  function stopTimer() {
    window.clearTimeout(timer.timeout)
    timer.text = '0'
    timer.status = 'end'
  }

  function updateTimer() {
    window.clearTimeout(timer.timeout)
    const elapsed = timer.allowed - Math.floor(new Date().getTime() - timer.start) / 1000

    if (elapsed <= 0) {
      return stopTimer()
    }

    timer.text = Math.floor(elapsed / 60) + ':' + Math.floor(elapsed % 60)
    timer.timeout = window.setTimeout(updateTimer, 1000)
  }

  function initTimer() {
    timer.start = new Date().getTime()
    const elapsed = timer.allowed - Math.floor(new Date().getTime() - timer.start) / 1000
    timer.text = Math.floor(elapsed / 60) + ':' + Math.floor(elapsed % 60)
  }

  return {
    timer,
    startTimer,
    stopTimer,
    updateTimer,
    initTimer,
  }
  
}