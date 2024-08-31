function shuffle(array) {
  let currentIndex = array.length
  let newArray = JSON.parse(JSON.stringify(array))

  while (currentIndex !== 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]]
  }

  return newArray
}

export {
  shuffle
}