module.exports = (arr)=>{
    var current = arr.length, temp, rand
  
    while (current !== 0) {
      rand = Math.floor(Math.random() * current)
      current -= 1
      temp = arr[current]
      arr[current] = arr[rand]
      arr[rand] = temp
    }
    return arr
  }

